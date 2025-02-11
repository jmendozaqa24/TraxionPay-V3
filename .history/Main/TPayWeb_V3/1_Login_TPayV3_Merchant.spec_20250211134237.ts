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

function getRandomPassword() {
  const passwords = [
    'short', // Less than 8 characters
    'longenoughpassword' // 8 or more characters
  ];
  const randomIndex = Math.floor(Math.random() * passwords.length);
  return passwords[randomIndex];
}

function getRandomSignUpUser() {
  const signUpUsers = userDetails.signUpUsers;
  const randomIndex = Math.floor(Math.random() * signUpUsers.length);
  return signUpUsers[randomIndex];
}

test.afterEach(async ({ page }) => {
  // Add a hook to take a screenshot on failure
  test.step('Take screenshot on failure', async () => {
    const screenshotPath = `screenshots/${test.info().title}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    test.info().attachments.push({
      name: 'Screenshot',
      path: screenshotPath,
      contentType: 'image/png'
    });
  });
});

test.describe('Login', () => {
  test('Valid Login', async ({ page }) => {
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

  test('Invalid Login', async ({ page }) => {
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
});

test('Sign Up', async ({ page }) => {
  const signUpUser = getRandomSignUpUser();

  await page.goto('https://merchant-sit.traxionpay.com/signin');
  await page.getByRole('link', { name: 'Sign up' }).click();

  await expect(page).toHaveURL('https://merchant-sit.traxionpay.com/signup');

  await expect(page.getByText('Email address')).toBeVisible();
  await page.getByPlaceholder('your@email.com').fill(signUpUser.email);
  await expect(page.getByText('Mobile Number')).toBeVisible();
  await page.getByPlaceholder('Your mobile number').fill(signUpUser.mobile);
  await page.getByRole('button', { name: 'Sign Up' }).click();
});


test.skip('Show Password & Remember Me Functionality', async ({ page }) => {
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


test.skip('Forgot Password', async ({ page }) => {

  const correctUser = getRandomCorrectUser();
  
  await page.goto('https://merchant-sit.traxionpay.com/signin');
  await page.getByRole('link', { name: 'Forgot Password?' }).click();
  
  //verify test if visible
  await page.getByRole('heading', { name: 'Forgot Password' }).isVisible();
  await page.getByRole('textbox', { name: 'Email Address' }).isVisible();
  await page.getByRole('button', { name: 'Send Link' }).click();

  //
  await page.getByRole('textbox', { name: 'Email Address' }).fill(correctUser);
  await page.getByRole('button', { name: 'Send Link' }).click();


});