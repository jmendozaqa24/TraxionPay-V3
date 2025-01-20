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
  test('User Profile', async () => {
    await page.getByLabel('Open user menu').click();
    await page.getByRole('link', { name: 'Profile' }).click();

    // Retrieve and log user details
    const userName = await page.locator('h1.fw-bold').textContent() || 'N/A';
    const kycStatusElement = await page.locator('text=KYC Status:').elementHandle();
    const kycStatus = kycStatusElement ? await kycStatusElement.evaluate(node => node.nextElementSibling?.textContent || 'N/A') : 'N/A';

    const personCodeElement = await page.locator('text=Person Code:').elementHandle();
    const personCode = personCodeElement ? await personCodeElement.evaluate(node => node.nextElementSibling?.textContent || 'N/A') : 'N/A';

    const phoneNumberElement = await page.locator('text=Phone Number:').elementHandle();
    const phoneNumber = phoneNumberElement ? await phoneNumberElement.evaluate(node => node.nextElementSibling?.textContent || 'N/A') : 'N/A';

    const emailElement = await page.locator('text=Email:').elementHandle();
    const email = emailElement ? await emailElement.evaluate(node => node.nextElementSibling?.textContent || 'N/A') : 'N/A';

    console.log(`Name: ${userName}`);
    console.log(`not set`);
    console.log(`${phoneNumber}`);
    console.log(`${email}`);
    console.log(``);
    console.log(`KYC Status: ${kycStatus}`);
    console.log(`Person Code: ${personCode}`);

    // Check if the user is verified
    const isVerified = await page.getByRole('link', { name: 'Verified' }).isVisible();
    console.log(`User is ${isVerified ? 'VERIFIED' : 'NOT VERIFIED'}`);
  });
});