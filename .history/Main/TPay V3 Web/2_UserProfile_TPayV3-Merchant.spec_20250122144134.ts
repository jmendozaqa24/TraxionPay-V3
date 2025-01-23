import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const userDetails = JSON.parse(fs.readFileSync('main/TPay V3 Web/userDetails.json', 'utf-8'));

function getRandomCorrectUser() {
  const testUserProfile = userDetails.testUserProfile;
  const randomIndex = Math.floor(Math.random() * testUserProfile.length);
  return testUserProfile[randomIndex];
}

let context;
let page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  const testUserProfile = getRandomCorrectUser();

  await page.goto('https://merchant-sit.traxionpay.com/signin');

  await page.getByPlaceholder('your@email.com').fill(testUserProfile.email);
  await page.getByPlaceholder('your password').fill(testUserProfile.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Verification
  await expect(page).toHaveURL('https://merchant-sit.traxionpay.com');
  await expect(page.getByText('Overview')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test.beforeEach(async () => {
  // Reset the state of the page before each test
  await page.goto('https://merchant-sit.traxionpay.com');
});

test.describe('TPay V3 - User Profile', () => {
  test('Profile Tab', async () => {
    await page.getByLabel('Open user menu').click();
    await page.getByRole('link', { name: 'Profile' }).click();

    // Retrieve and log user details
    const userName = await page.locator('h1.fw-bold').textContent() || 'N/A';
    console.log(`Name: ${userName}`);

    // Check if the user is verified
    const isVerified = await page.getByRole('link', { name: 'Verified' }).isVisible();
    console.log(`User is ${isVerified ? 'VERIFIED' : 'NOT VERIFIED'}`);
  });

  test.describe('TPay V3 - Settings Tab', () => {
    test('My Account Tab', async () => {
      await page.getByLabel('Open user menu').click();
      await page.getByRole('link', { name: 'Settings' }).click();

      await page.getByRole('link', { name: 'My Account' }).click();

      await page.getByRole('heading', { name: 'Account Details' }).click();
      await page.locator('.col-auto > .avatar').click();

          const emailLabel = await page.getByText('Your email can be used to log in to your account.');
    const userEmail = await emailLabel.evaluate(node => node.nextElementSibling.querySelector('div:nth-child(6) > div > .col-auto').innerText.trim());
    console.log(`Email: ${userEmail}`);

    const mobilenNumLabel = await page.getByText('Your mobile number can be used to login to your account.');
    const mobileNumber = await mobilenNumLabel.evaluate(node => node.nextElementSibling.querySelector('div:nth-child(9) > div > .col-auto').innerText.trim());
    console.log(`Mobile Number: ${mobileNumber}`);
  });

    test('Merchant Details Tab', async () => {
      await page.getByLabel('Open user menu').click();
      await page.getByRole('link', { name: 'Settings' }).click();
      await page.getByRole('link', { name: 'Merchant Details' }).click();
      await page.getByRole('heading', { name: 'Merchant Details' }).click();
  
      // Retrieve and console log the user's merchant details
      console.log('Retrieving merchant details...');
  
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
    });
  });

  test('Bank Accounts Tab', async () => {
    await page.getByLabel('Open user menu').click();
    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('link', { name: 'Bank Accounts' }).click();
    await page.getByRole('heading', { name: 'Linked Bank Accounts' }).click();

    const bankNameLabel = await page.getByText('Bank Name:');
    const bankName = await bankNameLabel.evaluate(node => node.parentElement.querySelector('div').innerText.trim());
    console.log(`Bank Name: ${bankName}`);

    const accountNameLabel = await page.getByText('Account Name:');
    const accountName = await accountNameLabel.evaluate(node => node.parentElement.querySelector('div').innerText.trim());
    console.log(`Account Name: ${accountName}`);

    const accountNumberLabel = await page.getByText('Account Number:');
    const accountNumber = await accountNumberLabel.evaluate(node => node.parentElement.querySelector('div').innerText.trim());
    console.log(`Account Number: ${accountNumber}`);

    const accountTypeLabel = await page.getByText('Account Type:');
    const accountType = await accountTypeLabel.evaluate(node => node.parentElement.querySelector('div').innerText.trim());
    console.log(`Account Type: ${accountType}`);

    // Save the details to the JSON file
    const bankDetails = {
      "Bank Name": bankName,
      "Account Name": accountName,
      "Account Number": accountNumber,
      "Account Type": accountType
    };

    const data = {
      bankDetails: [bankDetails]
    };

    fs.writeFileSync('main/TPay V3 Web/testData.json', JSON.stringify(data, null, 2));
  });   
});