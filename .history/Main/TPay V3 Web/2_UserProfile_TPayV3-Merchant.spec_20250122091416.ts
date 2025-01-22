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

    test('Merchant Details   Tab', async () => {
      await page.getByLabel('Open user menu').click();
      await page.getByRole('link', { name: 'Settings' }).click();

      await page.getByRole('link', { name: 'Merchant Details' }).click();

      await page.getByRole('heading', { name: 'Merchant Details' }).click();

      
  
    });
  });

});