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
    
        // Function to retrieve and log text content
        const getTextContent = async (selector: string) => {
          const element = await page.getByText(selector);
          const text = await element.textContent();
          console.log(`${selector} ${text?.trim()}`);
          return text?.trim();
        };
    
        // Personal Details
        await getTextContent('Name:');
        await getTextContent('KYC Status: Person Code:');
        await page.getByRole('link', { name: 'Verified' }).click();
    
        // Other Personal Details
        await page.getByText('Other Personal Details').click();
        await getTextContent('Birth Date: ');
        await getTextContent('Birth Place: ');
        await getTextContent('Gender: ');
        await getTextContent('Civil Status: -');
        await getTextContent('Nationality: -');
    
        // User Details
        await page.getByText('User Details').click();
        const userCode = await getTextContent('User Code: ');
        const userLevel = await getTextContent('User Level: ');
        const roleName = await getTextContent('Role Name: ');
    
        // Identification
        await page.getByText('Identifications', { exact: true }).click();
        // Add retrieval and logging for identification details if needed
    
        // Wallet Details
        await page.getByText('Wallet Details').click();
        await getTextContent('Wallet Code: ');
        await getTextContent('Account Number:');
        await getTextContent('Currency: PHP');
        await getTextContent('Current Balance:');
        await getTextContent('Verification Status: ');
        await getTextContent('Scope: ');
    
        // Contact Details
        await page.getByText('Contact Details').click();
        await getTextContent('Type: Mobile Number');
        await getTextContent('Value: ');
        await getTextContent('IsActive:');
        await getTextContent('IsPrimary:');
    
        await getTextContent('Type: Email Address');
        await getTextContent('Value: ');
        await getTextContent('IsActive:');
        await getTextContent('IsPrimary:');
    
        // Address
        await page.getByText('Addresses').click();
        await getTextContent('Address: ');
        await getTextContent('Barangay:');
        await getTextContent('City / Municipality: ');
        await getTextContent('Province: ');
        await getTextContent('Region:');
        await getTextContent('ZipCode:');
    
        // Log summary of user details
        console.log(`User Code: ${userCode}`);
        console.log(`User Level: ${userLevel}`);
        console.log(`Role Name: ${roleName}`);
      });
});