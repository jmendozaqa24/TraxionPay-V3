import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const userDetails = JSON.parse(readFileSync(resolve(__dirname, 'TPay V3 Web/userDetails.json'), 'utf-8'));

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

test('correct login', async ({ page }) => {
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

test('incorrect login', async ({ page }) => {
  const incorrectUser = getRandomIncorrectUser();
  const randomPassword = getRandomPassword();

  await page.goto('https://merchant-sit.traxionpay.com/signin');

  await page.getByPlaceholder('your@email.com').fill(incorrectUser.email);
  await page.getByPlaceholder('your password').fill(randomPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Add assertions to verify login failure
  if (randomPassword.length < 8) {
    await expect(page.getByText('Missing or invalid input. Try again.')).toBeVisible();
  } else {
    await expect(page.getByText('Authentication error. Incorrect username and password combination')).toBeVisible();
  }
});