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


// Function to get text content of an element by role and name
async function getTextContentByRole(page, role, name) {
  const element = await page.getByRole(role, { name });
  return await element.textContent();
}

test.describe('TPay V3 - User Profile', () => {
  test('User details validation', async ({ page }) => {
    // Log in to the account (assuming you have a login function)
    await login(page, 'testAccount');

    // Retrieve and log user details
    const userName = await getTextContentByRole(page, 'heading', '');
    const kycStatus = await getTextContentByRole(page, 'text', 'KYC Status:');
    const personCode = await getTextContentByRole(page, 'text', 'Person Code:');

    console.log(`Name: ${userName}`);
    console.log(`KYC Status: ${kycStatus}`);
    console.log(`Person Code: ${personCode}`);

    // Check if the user is verified
    const isVerified = await page.getByRole('link', { name: 'Verified' }).isVisible();
    console.log(`User is ${isVerified ? 'VERIFIED' : 'NOT VERIFIED'}`);
});
});