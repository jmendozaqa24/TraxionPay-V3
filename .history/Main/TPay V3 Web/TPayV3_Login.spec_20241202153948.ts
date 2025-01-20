import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const userDetails = JSON.parse(fs.readFileSync('main/TPay V3 Web/userDetails.json', 'utf-8'));

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

function getRandomSignUpUser() {
  const signUpUsers = userDetails.signUpUsers;
  const randomIndex = Math.floor(Math.random() * signUpUsers.length);
  return signUpUsers[randomIndex];
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

test('sign up', async ({ page }) => {
  const signUpUser = getRandomSignUpUser();

  await page.goto('https://merchant-sit.traxionpay.com/signin');
  await page.getByRole('link', { name: 'Sign up' }).click();

  await expect(page).toHaveURL('https://merchant-sit.traxionpay.com/signup');

  await expect(page.getByText('Email address')).toBeVisible();
  await page.getByPlaceholder('your@email.com').fill(signUpUser.email);
  await expect(page.getByText('Mobile Number')).toBeVisible();
  await page.getByPlaceholder('Your mobile number').fill(signUpUser.mobile);
  await page.getByRole('button', { name: 'Sign Up' }).click();

});

test('show password and remember me functionality', async ({ page }) => {
  const correctUser = getRandomCorrectUser();

  await page.goto('https://merchant-sit.traxionpay.com/signin');

  await page.getByPlaceholder('your@email.com').fill(correctUser.email);
  await page.getByPlaceholder('your password').fill(correctUser.password);

  // Click the "Show password" checkbox
  await page.getByLabel('Show password').click();
  // Verify that the password is now visible
  const passwordInput = await page.getByPlaceholder('your password');
  await expect(passwordInput).toHaveAttribute('type', 'text');

  // Click the "Remember me" checkbox
  await page.getByLabel('Remember me on this device').check();
  // Verify that the "Remember me" checkbox is checked
  await expect(page.getByLabel('Remember me on this device')).toBeChecked();

  // Submit the form
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Verification
  await expect(page).toHaveURL('https://merchant-sit.traxionpay.com');
  await expect(page.getByText('Overview')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});


