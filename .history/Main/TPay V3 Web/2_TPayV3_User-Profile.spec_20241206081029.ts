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

    // Function to retrieve text content with delay
    const getTextContent = async (selector: string) => {
      const element = await page.getByText(selector);
      await page.waitForTimeout(500); 
      await element.scrollIntoView();
      await page.waitForTimeout(500); // Add a delay of 500ms
      const text = await element.textContent();
      return text?.trim();
    };

    // Personal Details
    const name = await getTextContent('Name:');
    const kycStatus = await getTextContent('KYC Status: Person Code:');
    await page.getByRole('link', { name: 'Verified' }).click();

    // Other Personal Details
    await page.getByText('Other Personal Details').scrollIntoView();
    await page.waitForTimeout(500); // Add a delay of 500ms
    const birthDate = await getTextContent('Birth Date: ');
    const birthPlace = await getTextContent('Birth Place: ');
    const gender = await getTextContent('Gender: ');
    const civilStatus = await getTextContent('Civil Status: -');
    const nationality = await getTextContent('Nationality: -');

    // User Details
    await page.getByText('User Details').scrollIntoView();
    await page.waitForTimeout(500); // Add a delay of 500ms
    const userCode = await getTextContent('User Code: ');
    const userLevel = await getTextContent('User Level: ');
    const roleName = await getTextContent('Role Name: ');

    // Identification
    await page.getByText('Identifications', { exact: true }).scrollIntoView();
    await page.waitForTimeout(500); // Add a delay of 500ms
    // Add retrieval and logging for identification details if needed

    // Wallet Details
    await page.getByText('Wallet Details').scrollIntoView();
    await page.waitForTimeout(500); // Add a delay of 500ms
    const walletCode = await getTextContent('Wallet Code: ');
    const accountNumber = await getTextContent('Account Number:');
    const currency = await getTextContent('Currency: PHP');
    const currentBalance = await getTextContent('Current Balance:');
    const verificationStatus = await getTextContent('Verification Status: ');
    const scope = await getTextContent('Scope: ');

    // Contact Details
    await page.getByText('Contact Details').scrollIntoView();
    await page.waitForTimeout(500); // Add a delay of 500ms
    const mobileType = await getTextContent('Type: Mobile Number');
    const phoneNumberElement = await page.getByText(/\+63[0-9]{10}/);
    const mobileValue = await phoneNumberElement.textContent();
    const mobileIsActive = await getTextContent('IsActive:');
    const mobileIsPrimary = await getTextContent('IsPrimary:');

    const emailType = await getTextContent('Type: Email Address');
    const emailValue = await getTextContent('Value: ');
    const emailIsActive = await getTextContent('IsActive:');
    const emailIsPrimary = await getTextContent('IsPrimary:');

    // Address
    await page.getByText('Addresses').scrollIntoView();
    await page.waitForTimeout(500); // Add a delay of 500ms
    const address = await getTextContent('Address: ');
    const barangay = await getTextContent('Barangay:');
    const city = await getTextContent('City / Municipality: ');
    const province = await getTextContent('Province: ');
    const region = await getTextContent('Region:');
    const zipCode = await getTextContent('ZipCode:');

    // Log summary of user details
    console.log(`Name: ${name}`);
    console.log(`KYC Status: ${kycStatus}`);
    console.log(`User Code: ${userCode}`);
    console.log(`User Level: ${userLevel}`);
    console.log(`Role Name: ${roleName}`);
    console.log(`Wallet Code: ${walletCode}`);
    console.log(`Account Number: ${accountNumber}`);
    console.log(`Currency: ${currency}`);
    console.log(`Current Balance: ${currentBalance}`);
    console.log(`Verification Status: ${verificationStatus}`);
    console.log(`Scope: ${scope}`);
    console.log(`Mobile Type: ${mobileType}`);
    console.log(`Mobile Value: ${mobileValue?.trim()}`);
    console.log(`Mobile IsActive: ${mobileIsActive}`);
    console.log(`Mobile IsPrimary: ${mobileIsPrimary}`);
    console.log(`Email Type: ${emailType}`);
    console.log(`Email Value: ${emailValue}`);
    console.log(`Email IsActive: ${emailIsActive}`);
    console.log(`Email IsPrimary: ${emailIsPrimary}`);
    console.log(`Address: ${address}`);
    console.log(`Barangay: ${barangay}`);
    console.log(`City / Municipality: ${city}`);
    console.log(`Province: ${province}`);
    console.log(`Region: ${region}`);
    console.log(`ZipCode: ${zipCode}`);
  });
});