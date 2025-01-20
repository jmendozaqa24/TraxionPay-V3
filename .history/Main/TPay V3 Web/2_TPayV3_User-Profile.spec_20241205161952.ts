import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const userDetails = JSON.parse(fs.readFileSync('main/TPay V3 Web/userDetails.json', 'utf-8'));

function getRandomCorrectUser() {
  const testDataUsers = userDetails.testDataUsers;
  const randomIndex = Math.floor(Math.random() * testDataUsers.length);
  return testDataUsers[randomIndex];
}

let context;
let page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  const testDataUsers = getRandomCorrectUser();

  await page.goto('https://merchant-sit.traxionpay.com/signin');

  await page.getByPlaceholder('your@email.com').fill(testDataUsers.email);
  await page.getByPlaceholder('your password').fill(testDataUsers.password);
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


        // Other Personal Details
        await page.getByText('Other Personal Details').click();

        await page.getByText('Birth Date: ').click();
        await page.getByText('Birth Place: ').click();
        await page.getByText('Gender: ').click();
        await page.getByText('Civil Status: -').click();
        await page.getByText('Nationality: -').click();

        //User Details
        await page.getByText('User Details').click();
        await page.getByText('User Code: ').click();
        await page.getByText('User Level: ').click();
        await page.getByText('Role Name: ').click();

        //Identification
        await page.getByText('Identifications', { exact: true }).click();

        //Wallet Details
        await page.getByText('Wallet Details').click();
        await page.getByText('Wallet Code: ').click();
        await page.getByText('Account Number:').click();
        await page.getByText('Currency: PHP').click();
        await page.getByText('Current Balance:').click();
        await page.getByText('Verification Status: ').click();
        await page.getByText('Scope: ').click();

        // Contact Details
        await page.getByText('Contact Details').click();
        await page.getByText('Type: Mobile Number').click();
        await page.getByText('Value: ').click();
        await page.getByText('IsActive:').first().click();
        await page.getByText('IsPrimary:').first().click();

        await page.getByText('Type: Email Address').click();
        await page.getByText('Value: ').click();
        await page.getByText('IsActive:').nth(1).click();
        await page.getByText('IsPrimary:').nth(1).click();

        //Address
        await page.getByText('Addresses').click();
        await page.getByText('Address: ').click();
        await page.getByText('Barangay:').first().click();
        await page.getByText('City / Municipality: ').first().click();
        await page.getByText('Province: ').first().click();
        await page.getByText('Region:').first().click();
        await page.getByText('ZipCode:').first().click();
    });
});