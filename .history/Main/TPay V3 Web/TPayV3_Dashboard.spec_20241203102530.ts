import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const userDetails = JSON.parse(fs.readFileSync('main/TPay V3 Web/userDetails.json', 'utf-8'));

function getRandomCorrectUser() {
  const correctUsers = userDetails.correctUsers;
  const randomIndex = Math.floor(Math.random() * correctUsers.length);
  return correctUsers[randomIndex];
}

let loginState;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const correctUser = getRandomCorrectUser();

  await page.goto('https://merchant-sit.traxionpay.com/signin');

  await page.getByPlaceholder('your@email.com').fill(correctUser.email);
  await page.getByPlaceholder('your password').fill(correctUser.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Verification
  await expect(page).toHaveURL('https://merchant-sit.traxionpay.com');
  await expect(page.getByText('Overview')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Save login state
  loginState = await context.storageState();
  await context.close();
});

test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext({ storageState: loginState });
  const page = await context.newPage();
  await page.goto('https://merchant-sit.traxionpay.com/dashboard');
});

test('check transaction table', async ({ page }) => {
  // Check if the transaction table is present
  const transactionTable = await page.$('div.table-responsive > div#transactions-list_wrapper.dt-container.dt-bootstrap5.dt-empty-footer');
});

test('another dashboard test', async ({ page }) => {
  // Add another test for the dashboard
  // Example: Check if a specific element is present
  await expect(page.getByText('Some Dashboard Element')).toBeVisible();
});

// Add more tests as needed