import { test, expect } from '@playwright/test';
import userDetails from './userDetails.json'; 
import { allure } from 'allure-playwright';

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

function generateUniqueEmail() {
  const timestamp = Date.now();
  return `user${timestamp}@example.com`;
}

function generateUniqueMobile() {
  const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `9${randomDigits}`;
} 

function getRandomPassword() {
  const passwords = [
    'short', // Less than 8 characters
    'longenoughpassword' // 8 or more characters
  ];
  const randomIndex = Math.floor(Math.random() * passwords.length);
  return passwords[randomIndex];
}

test.afterEach(async ({ page }) => {
  if (test.info().status !== "passed") { // Only take a screenshot when the test actually fails
    const screenshotPath = `screenshots/${test.info().title}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    test.info().attachments.push({
      name: 'Screenshot',
      path: screenshotPath,
      contentType: 'image/png'
    });
  }
});

test.describe('Login', () => {

  test('Login - Invalid Input Test', async ({ page }) => {
    const incorrectUser = getRandomIncorrectUser();
    const randomPassword = getRandomPassword();

    await page.goto('https://merchant-sit.traxionpay.com/signin');

    await page.getByPlaceholder('your@email.com').fill(incorrectUser.email);
    await page.getByPlaceholder('your password').fill(randomPassword);
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Add assertions to verify login failure
    if (randomPassword.length < 8) {
      await expect(page.getByText('Missing or invalid input. Try again.')).toBeVisible();
    } else {
      await expect(page.getByText('Authentication error. Invalid credentials. Please try again.')).toBeVisible();
    }
  });
});

