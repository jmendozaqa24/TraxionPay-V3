import { test, expect } from '@playwright/test';
import userDetails from './userDetails.json';

function getRandomCorrectUser() {
  const testUserProfile = userDetails.testUserProfile;
  const randomIndex = Math.floor(Math.random() * testUserProfile.length);
  return testUserProfile[randomIndex];
}

// Helper function to log in
async function login(page) {
  const testUserProfile = getRandomCorrectUser();
  await page.goto('https://merchant-sit.traxionpay.com/signin');
  await page.getByPlaceholder('your@email.com').fill(testUserProfile.email);
  await page.getByPlaceholder('your password').fill(testUserProfile.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Verify login success
  await expect(page).toHaveURL('https://merchant-sit.traxionpay.com');
  await expect(page.getByText('Overview')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
}

test('Profile Tab', async ({ browser }) => {
  test.setTimeout(120000); // Increase timeout to 120 seconds

  // Create a new browser context and page
  const context = await browser.newContext();
  const page = await context.newPage();

  // Log in
  await login(page);

  console.log('Navigating to profile tab...');
  console.log('Clicking user menu...');
  await page.waitForSelector('[aria-label="Open user menu"]', { state: 'visible' });
  await page.getByLabel('Open user menu').click();
  console.log('User menu clicked');

  console.log('Waiting for Profile link...');
  await page.waitForSelector('a:has-text("Profile")', { state: 'visible' });
  console.log('Profile link is visible');

  console.log('Clicking Profile link...');
  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('link', { name: 'Profile' }).click(),
  ]);
  console.log('Profile link clicked');

  console.log('Retrieving user details...');
  await page.waitForSelector('h1.fw-bold', { state: 'visible' });
  const userName = await page.locator('h1.fw-bold').textContent() || 'N/A';
  console.log(`Name: ${userName}`);

  console.log('Checking if user is verified...');
  const isVerified = await page.getByRole('link', { name: 'Verified' }).isVisible();
  console.log(`User is ${isVerified ? 'VERIFIED' : 'NOT VERIFIED'}`);

  // Close the browser context
  await context.close();
});

test('My Account Tab', async ({ browser }) => {
  test.setTimeout(120000); // Increase timeout to 120 seconds

  // Create a new browser context and page
  const context = await browser.newContext();
  const page = await context.newPage();

  // Log in
  await login(page);

  console.log('Navigating to My Account tab...');
  await page.getByLabel('Open user menu').click();
  await page.waitForSelector('a:has-text("Settings")', { state: 'visible' });
  await page.getByRole('link', { name: 'Settings' }).nth(0).click();
  await page.waitForSelector('a:has-text("My Account")', { state: 'visible' });
  await page.getByRole('link', { name: 'My Account' }).click();

  console.log('Retrieving account details...');
  await page.waitForSelector('.col-auto > .avatar', { state: 'visible' });
  await page.locator('.col-auto > .avatar').click();

  const emailLabel = await page.getByText('Your email can be used to log in to your account.');
  const userEmail = await emailLabel.evaluate(node => node.nextElementSibling.querySelector('div:nth-child(6) > div > .col-auto').innerText.trim());
  console.log(`Email: ${userEmail}`);

  const mobilenNumLabel = await page.getByText('Your mobile number can be used to login to your account.');
  const mobileNumber = await mobilenNumLabel.evaluate(node => node.nextElementSibling.querySelector('div:nth-child(9) > div > .col-auto').innerText.trim());
  console.log(`Mobile Number: ${mobileNumber}`);

  // Close the browser context
  await context.close();
});

test('Merchant Details Tab', async ({ browser }) => {
  test.setTimeout(120000); // Increase timeout to 120 seconds

  // Create a new browser context and page
  const context = await browser.newContext();
  const page = await context.newPage();

  // Log in
  await login(page);

  console.log('Navigating to Merchant Details tab...');
  await page.getByLabel('Open user menu').click();
  await page.waitForSelector('a:has-text("Settings")', { state: 'visible' });
  await page.getByRole('link', { name: 'Settings' }).nth(0).click();
  await page.waitForSelector('a:has-text("Merchant Details")', { state: 'visible' });
  await page.getByRole('link', { name: 'Merchant Details' }).click();

  console.log('Retrieving merchant details...');
  await page.waitForSelector('h1:has-text("Merchant Details")', { state: 'visible' });

  const businessNameLabel = await page.getByText('Business Name:');
  const businessName = await businessNameLabel.evaluate(node => node.nextElementSibling.textContent.trim());
  console.log(`Business Name: ${businessName}`);

  const businessNameAliasLabel = await page.getByText('Business Name Alias:');
  const businessNameAlias = await businessNameAliasLabel.evaluate(node => node.nextElementSibling.textContent.trim());
  console.log(`Business Name Alias: ${businessNameAlias}`);

  const websiteURLLabel = await page.getByText('Website URL:');
  const websiteURL = await websiteURLLabel.evaluate(node => node.nextElementSibling.textContent.trim());
  console.log(`Website URL: ${websiteURL}`);

  const dateOfIncorporationLabel = await page.getByText('Date Of Incorporation:');
  const dateOfIncorporation = await dateOfIncorporationLabel.evaluate(node => node.nextElementSibling.textContent.trim());
  console.log(`Date Of Incorporation: ${dateOfIncorporation}`);

  const merchantCodeLabel = await page.getByText('Merchant Code:');
  const merchantCode = await merchantCodeLabel.evaluate(node => node.nextElementSibling.textContent.trim());
  console.log(`Merchant Code: ${merchantCode}`);

  const gcSubMIDLabel = await page.getByText('GC-subMID:');
  const gcSubMID = await gcSubMIDLabel.evaluate(node => node.nextElementSibling.textContent.trim());
  console.log(`GC-subMID: ${gcSubMID}`);

  const businessTypeLabel = await page.getByText('Business Type:');
  const businessType = await businessTypeLabel.evaluate(node => node.nextElementSibling.textContent.trim());
  console.log(`Business Type: ${businessType}`);

  const merchantTypeLabel = await page.getByText('Merchant Type:');
  const merchantType = await merchantTypeLabel.evaluate(node => node.nextElementSibling.textContent.trim());
  console.log(`Merchant Type: ${merchantType}`);

  const notesRemarksLabel = await page.getByText('Notes/Remarks:');
  const notesRemarks = await notesRemarksLabel.evaluate(node => node.nextElementSibling.textContent.trim());
  console.log(`Notes/Remarks: ${notesRemarks}`);

  // Close the browser context
  await context.close();
});

test('Bank Accounts Tab', async ({ browser }) => {
  test.setTimeout(120000); // Increase timeout to 120 seconds

  // Create a new browser context and page
  const context = await browser.newContext();
  const page = await context.newPage();

  // Log in
  await login(page);

  console.log('Navigating to Bank Accounts tab...');
  await page.getByLabel('Open user menu').click();
  await page.waitForSelector('a:has-text("Settings")', { state: 'visible' });
  await page.getByRole('link', { name: 'Settings' }).nth(0).click();
  await page.waitForSelector('a:has-text("Bank Accounts")', { state: 'visible' });
  await page.getByRole('link', { name: 'Bank Accounts' }).click();

  console.log('Retrieving bank account details...');
  await page.waitForSelector('h1:has-text("Linked Bank Accounts")', { state: 'visible' });

  const accountContainers = await page.locator('.col-lg-6').elementHandles();

  for (let i = 0; i < accountContainers.length && i < 10; i++) {
    const container = accountContainers[i];

    const bankNameElement = await container.$('.mb-2:has-text("Bank Name:")');
    const accountNameElement = await container.$('.mb-2:has-text("Account Name:")');
    const accountNumberElement = await container.$('.mb-2:has-text("Account Number:")');
    const accountTypeElement = await container.$('.mb-2:has-text("Account Type:")');

    if (bankNameElement && accountNameElement && accountNumberElement && accountTypeElement) {
      const bankName = await bankNameElement.evaluate(node =>
        (node as HTMLElement).innerText.replace('Bank Name:', '').trim()
      );

      const accountName = await accountNameElement.evaluate(node =>
        (node as HTMLElement).innerText.replace('Account Name:', '').trim()
      );

      const accountNumber = await accountNumberElement.evaluate(node =>
        (node as HTMLElement).innerText.replace('Account Number:', '').trim()
      );

      const accountType = await accountTypeElement.evaluate(node =>
        (node as HTMLElement).innerText.replace('Account Type:', '').trim()
      );

      console.log(`Bank Account ${i + 1}`);
      console.log(`Bank Name: ${bankName}`);
      console.log(`Account Name: ${accountName}`);
      console.log(`Account Number: ${accountNumber}`);
      console.log(`Account Type: ${accountType}`);
    } else {
      console.log(`Open Bank Account Slot ${i + 1}.`);
    }
  }

  // Close the browser context
  await context.close();
});