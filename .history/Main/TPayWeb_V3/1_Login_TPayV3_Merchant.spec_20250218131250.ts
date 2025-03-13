import { test, expect } from '@playwright/test';
import userDetails from './userDetails.json'; 
import { allure } from 'allure-playwright';

function getRandomCorrectUser() {
  const correctUsers = userDetails.correctUsers;
  const randomIndex = Math.floor(Math.random() * correctUsers.length);
  return correctUsers[randomIndex];
}

function getRandomIncorrectUser() {
  const incorrectUsers = userDetails.incorrectUsers;
  const randomIndex = Math.floor(Math.random() * incorrectUsers.length);
  return incorrectUsers[randomIndex];
}

function generateUniqueEmail() {
  const timestamp = Date.now();
  return `user${timestamp}@example.com`;
}

function generateUniqueMobile() {
  const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `9${randomDigits}`;
} 

function getRandomPassword() {
  const passwords = [
    'short', // Less than 8 characters
    'longenoughpassword' // 8 or more characters
  ];
  const randomIndex = Math.floor(Math.random() * passwords.length);
  return passwords[randomIndex];
}

test.afterEach(async ({ page }) => {
  if (test.info().status !== "passed") { // Only take a screenshot when the test actually fails
    const screenshotPath = `screenshots/${test.info().title}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    test.info().attachments.push({
      name: 'Screenshot',
      path: screenshotPath,
      contentType: 'image/png'
    });
  }
});

test.describe('Login', () => {
  test('Login - Valid Input', async ({ page }) => {
    const correctUser = getRandomCorrectUser();

    await page.route('https://merchant-sit.traxionpay.com/', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.goto('https://merchant-sit.traxionpay.com/signin');

    await page.getByPlaceholder('your@email.com').fill(correctUser.email);
    await page.getByPlaceholder('your password').fill(correctUser.password);

    // Add on this part the API validation
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('https://merchant-sit.traxionpay.com/') && response.status() === 200),
      page.getByRole('button', { name: 'Sign in' }).click()
    ]);
    expect(response.status()).toBe(200);

    // Verification
    await expect(page).toHaveURL('https://merchant-sit.traxionpay.com');
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('Login - Invalid Input Test', async ({ page }) => {
    const incorrectUser = getRandomIncorrectUser();
    const randomPassword = getRandomPassword();

    await page.goto('https://merchant-sit.traxionpay.com/signin');

    await page.getByPlaceholder('your@email.com').fill(incorrectUser.email);
    await page.getByPlaceholder('your password').fill(randomPassword);
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Add assertions to verify login failure
    if (randomPassword.length < 8) {
      await expect(page.getByText('Missing or invalid input. Try again.')).toBeVisible();
    } else {
      await expect(page.getByText('Authentication error. Incorrect username and password combination ')).toBeVisible();
    }
  });

  
  test.skip('Login - Show Password & Remember Me Functionality', async ({ page }) => {
    const correctUser = getRandomCorrectUser();

    await page.goto('https://merchant-sit.traxionpay.com/signin');

    await page.getByPlaceholder('your@email.com').fill(correctUser.email);
    await page.getByPlaceholder('your password').fill(correctUser.password);

    await page.getByLabel('Show password').click();
    const passwordInput = await page.getByPlaceholder('your password');
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    await page.getByLabel('Remember me on this device').check();
    await expect(page.getByLabel('Remember me on this device')).toBeChecked();
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL('https://merchant-sit.traxionpay.com');
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Log out
    await page.getByLabel('Open user menu').click();
    await page.getByRole('link', { name: 'Signout' }).click();

    // Navigate back to the login page
    await page.goto('https://merchant-sit.traxionpay.com/signin');

    // Verify that the email and password are saved
    await expect(page.getByPlaceholder('your@email.com')).toHaveValue(correctUser.email);
    await expect(page.getByPlaceholder('your password')).toHaveValue(correctUser.password);
    // Verify that the "Remember me" checkbox is checked
    await expect(page.getByLabel('Remember me on this device')).toBeChecked();

  });
});

test.describe('Sign Up', () => {
  test('Sign Up - Success', async ({ page }) => {
    const uniqueEmail = generateUniqueEmail();
    const uniqueMobile = generateUniqueMobile();

    await page.goto('https://merchant-sit.traxionpay.com/signin');
    await page.getByRole('link', { name: 'Sign up' }).click();

    await expect(page).toHaveURL('https://merchant-sit.traxionpay.com/signup');
    await expect(page.getByText('Email address')).toBeVisible();
    await page.getByPlaceholder('your@email.com').fill(uniqueEmail);
    await expect(page.getByText('Mobile Number')).toBeVisible();
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill(uniqueMobile);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    await page.getByText('Enter the OTP we sent to your mobile number.').isVisible();
  });
});

test.describe('Forgot Password', () => {
  test('Forgot Password - Valid', async ({ page }) => {
    const correctUser = getRandomCorrectUser();
    
    await page.goto('https://merchant-sit.traxionpay.com/signin');
    await page.getByRole('link', { name: 'Forgot Password?' }).click();
    
    //verify test if visible
    await page.getByRole('heading', { name: 'Forgot Password' }).isVisible();
    await page.getByRole('textbox', { name: 'Email Address' }).isVisible();
    await page.getByRole('button', { name: 'Send Link' }).click();

    //verification test the email reset is succesful
    await page.getByRole('textbox', { name: 'Email Address' }).fill(correctUser.email); 
    const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes('https://merchant-sit.traxionpay.com/forgot-password') && response.status() === 200),
        page.getByRole('button', { name: 'Send Link' }).click()
    ]);

    // Verify response status
    expect(response.status()).toBe(200);
    
  });
});

