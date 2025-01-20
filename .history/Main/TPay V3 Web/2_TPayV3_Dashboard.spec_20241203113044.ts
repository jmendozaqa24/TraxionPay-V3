import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const userDetails = JSON.parse(fs.readFileSync('main/TPay V3 Web/userDetails.json', 'utf-8'));

function getRandomCorrectUser() {
  const correctUsers = userDetails.correctUsers;
  const randomIndex = Math.floor(Math.random() * correctUsers.length);
  return correctUsers[randomIndex];
}

let page;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  const correctUser = getRandomCorrectUser();

  await page.goto('https://merchant-sit.traxionpay.com/signin');

  await page.getByPlaceholder('your@email.com').fill(correctUser.email);
  await page.getByPlaceholder('your password').fill(correctUser.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Verification
  await expect(page).toHaveURL('https://merchant-sit.traxionpay.com');
  await expect(page.getByText('Overview')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('check transaction table and dropdowns', async () => {
  // Scroll down to the transaction table
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));

  // Check if the transaction table is present
  const transactionTable = await page.$('div.table-responsive > div#transactions-list_wrapper.dt-container.dt-bootstrap5.dt-empty-footer');
  expect(transactionTable).not.toBeNull();

  // Check the "Failed Pending Success" dropdown
  await page.getByLabel('Failed Pending Success').selectOption('-1');
  const selectedOption = await page.getByLabel('Failed Pending Success').inputValue();
  expect(selectedOption).toBe('-1');

  // Check the "entries per page" dropdown
  await page.getByLabel('entries per page').selectOption('25');
  const entriesOption = await page.getByLabel('entries per page').inputValue();
  expect(entriesOption).toBe('25');
});