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
  
    });

    test('Merchant Details Tab', async () => {
      await page.getByLabel('Open user menu').click();
      await page.getByRole('link', { name: 'Settings' }).click();
      await page.getByRole('link', { name: 'Merchant Details' }).click();
      await page.getByRole('heading', { name: 'Merchant Details' }).click();
  
      // Retrieve and console log the user's merchant details
      await page.getByText('Business Name:').click();
      const businessName = await page.getByRole('heading', { name: /Name/ }).textContent();
      console.log(`Business Name: ${businessName.trim()}`);
  
      

      await page.getByText('Business Name Alias:').click();
      const businessNameAlias = await page.getByRole('heading', { name: /Business Name Alias/ }).textContent();
      console.log(`Business Name Alias: ${businessNameAlias.trim()}`);
  
      await page.getByText('Website URL:').click();
      const websiteURL = await page.getByRole('heading', { name: /Website URL/ }).textContent();
      console.log(`Website URL: ${websiteURL.trim()}`);
  
      await page.getByText('Date Of Incorporation:').click();
      const dateOfIncorporation = await page.getByRole('heading', { name: /Date Of Incorporation/ }).textContent();
      console.log(`Date Of Incorporation: ${dateOfIncorporation.trim()}`);
  
      await page.getByText('Merchant Code:').click();
      const merchantCode = await page.getByRole('heading', { name: /Merchant Code/ }).textContent();
      console.log(`Merchant Code: ${merchantCode.trim()}`);
  
      await page.getByText('GC-subMID:').click();
      const gcSubMID = await page.getByRole('heading', { name: /GC-subMID/ }).textContent();
      console.log(`GC-subMID: ${gcSubMID.trim()}`);
  
      await page.getByText('Business Type:').click();
      const businessType = await page.getByRole('heading', { name: /Business Type/ }).textContent();
      console.log(`Business Type: ${businessType.trim()}`);
  
      await page.getByText('Merchant Type:').click();
      const merchantType = await page.getByRole('heading', { name: /Merchant Type/ }).textContent();
      console.log(`Merchant Type: ${merchantType.trim()}`);
  
      await page.getByText('Notes/Remarks:').click();
      const notesRemarks = await page.getByRole('heading', { name: /Notes\/Remarks/ }).textContent();
      console.log(`Notes/Remarks: ${notesRemarks.trim()}`);
    });
  });

});