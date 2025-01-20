import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const userDetails = JSON.parse(fs.readFileSync('userDetails.json', 'utf-8'));

function getRandomCorrectUser() {
  const correctUsers = userDetails.correctUsers;
  const randomIndex = Math.floor(Math.random() * correctUsers.length);
  return correctUsers[randomIndex];
}

test('correct login', async ({ page }) => {
  const correctUser = getRandomCorrectUser();

  await page.goto('https://merchant-sit.traxionpay.com/signin');

  await page.getByPlaceholder('your@email.com').fill(correctUser.email);
  await page.getByPlaceholder('your password').fill(correctUser.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Add assertions to verify successful login
  await expect(page.getByRole('link', { name: 'Traxion Logo' })).toBeVisible();
});

test('incorrect login', async ({ page }) => {
  await page.goto('https://merchant-sit.traxionpay.com/signin');

  await page.getByPlaceholder('your@email.com').fill(userDetails.incorrectUser.email);
  await page.getByPlaceholder('your password').fill(userDetails.incorrectUser.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Add assertions to verify login failure
  await expect(page.getByText('Invalid email or password')).toBeVisible();
});