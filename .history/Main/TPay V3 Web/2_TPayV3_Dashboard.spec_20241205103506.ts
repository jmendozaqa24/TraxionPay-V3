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


test.describe('Dashboard - User Details', () => {
  test('User Details Visibility and Retrieval', async () => {
    // Check visibility of the account link and retrieve its value
    console.log('Checking visibility of the account link...');
    const accountLink = await page.getByRole('link', { name: /Account:/ });
    await expect(accountLink).toBeVisible();
    const accountLinkText = await accountLink.textContent();
    console.log(`Account Number: Visible\nAccount: ${accountLinkText.trim()}`);

    // Check visibility of the current currency link and retrieve its value
    console.log('Checking visibility of the current currency link...');
    const currentCurrencyLink = await page.getByRole('link', { name: /Current:/ });
    await expect(currentCurrencyLink).toBeVisible();
    const currentCurrencyText = await currentCurrencyLink.textContent();
    console.log(`Current Currency: Visible\nCurrent: ${currentCurrencyText.trim()}`);

    // Check visibility of the available currency link and retrieve its value
    console.log('Checking visibility of the available currency link...');
    const availableCurrencyLink = await page.getByRole('link', { name: /Available:/ });
    await expect(availableCurrencyLink).toBeVisible();
    const availableCurrencyText = await availableCurrencyLink.textContent();
    console.log(`Available Currency: Visible\nAvailable: ${availableCurrencyText.trim()}`);

    // Check visibility of the heading and retrieve its value
    console.log('Checking visibility of the heading...');
    const heading = await page.getByRole('heading', { name: /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}/ });
    await expect(heading).toBeVisible();
    const headingText = await heading.textContent();
    console.log(`Heading: Visible\nHeading: ${headingText.trim()}`);

    // Check visibility of the email link and retrieve its value
    console.log('Checking visibility of the email link...');
    const emailLink = await page.getByRole('link', { name: /@traxiontech.net/ });
    await expect(emailLink).toBeVisible();
    const emailText = await emailLink.textContent();
    console.log(`Email: Visible\nEmail: ${emailText.trim()}`);

    // Check visibility of the QR code image and retrieve its alt text
    console.log('Checking visibility of the QR code image...');
    const qrCodeImage = await page.getByRole('img', { name: /QR Code/ });
    await expect(qrCodeImage).toBeVisible();
    const qrCodeAltText = await qrCodeImage.getAttribute('alt');
    console.log(`QR Code Image: Visible\nQR Code: ${qrCodeAltText}`);

    // Check visibility of the phone number and retrieve its value
    console.log('Checking visibility of the phone number...');
    const phoneNumber = await page.getByText(/\+63[0-9]{10}/);
    await expect(phoneNumber).toBeVisible();
    const phoneNumberText = await phoneNumber.textContent();
    console.log(`Phone Number: Visible\nPhone: ${phoneNumberText.trim()}`);
  });
});

test.describe('Dashboard - Analytics', () => {
  test('Overview Analytics Visibility and Retrieval', async () => {

    // Wait for the total PayIns value element to be visible and ensure it has content
    // Wait for the total PayIns value element to be visible and ensure it has content
    console.log('Checking visibility of the total PayIns value...');
    const totalPayIns = await page.locator('#payins-total');
    await expect(totalPayIns).toBeVisible();

    // Retry mechanism to wait for the value to be updated
    let totalPayInsText = '';
    for (let i = 0; i < 10; i++) { // Retry up to 10 times
      totalPayInsText = await totalPayIns.textContent();
      if (totalPayInsText.trim() !== '0.00') {
        break;
      }
      await page.waitForTimeout(1000); // Wait for 1 second before retrying
    }

    console.log(`Total PayIns: Visible\nTotal PayIns: ${totalPayInsText.trim()}`);

    console.log('Checking visibility of the total PayOuts value...');
    const totalPayOuts = await page.locator('#payouts-total');
    await expect(totalPayOuts).toBeVisible();

    // Retry mechanism to wait for the value to be updated
    let totalPayOutsText = '';
    for (let i = 0; i < 10; i++) { // Retry up to 10 times
      totalPayOutsText = await totalPayOuts.textContent();
      if (totalPayOutsText.trim() !== '0.00') {
        break;
      }
      await page.waitForTimeout(1000); // Wait for 1 second before retrying
    }

    console.log(`Total PayOuts: Visible\nTotal PayOuts: ${totalPayOutsText.trim()}`);
  });

    test('Transaction Chart Visibility and Retrieval', async () => {
      // Scroll down to the Analytics Chart heading
      const chartHeading = await page.getByRole('heading', { name: 'Transactions (last 30 days)' });
      await chartHeading.scrollIntoViewIfNeeded();
      await expect(chartHeading).toBeVisible();
  
      // Check if the Analytics Chart SVG element is visible
      const chartSvg = await page.locator('#div:nth-child(2) > .col-lg-12 > .card > .card-body');
      await chartSvg.scrollIntoViewIfNeeded();
      await expect(chartSvg).toBeVisible();
  
      // Retrieve Y-axis labels and their values
      const yAxisLabels = await page.locator('text').filter({ hasText: /^[0-9]+$/ });
      const yAxisValues: number[] = [];
      for (let i = 0; i < await yAxisLabels.count(); i++) {
        const label = yAxisLabels.nth(i);
        const textContent = await label.textContent();
        const value = textContent ? parseInt(textContent, 10) : 0;
        yAxisValues.push(value);
      }
  
      // Retrieve X-axis labels and their values
      const xAxisLabels = await page.locator('text').filter({ hasText: /^\d{4}-\d{2}-\d{2}$/ });
      const xAxisValues: string[] = [];
      for (let i = 0; i < await xAxisLabels.count(); i++) {
        const label = xAxisLabels.nth(i);
        const value = await label.textContent();
        if (value !== null) {
          xAxisValues.push(value);
        }
      }
  
      // Retrieve bar graphs and their heights
      const barGraphs = await page.locator('path');
      const barGraphCount = await barGraphs.count();
  
      for (let i = 0; i < barGraphCount; i++) {
        const barGraph = barGraphs.nth(i);
        await barGraph.scrollIntoViewIfNeeded();
        await expect(barGraph).toBeVisible();
  
        // Retrieve and log the attributes of the bar graph
        const barGraphHeight = await barGraph.getAttribute('height');
        const barGraphWidth = await barGraph.getAttribute('width');
        const heightValue = parseFloat(barGraphHeight);
        const yAxisValue = yAxisValues.find(value => value >= heightValue);
        console.log(`Bar Graph ${i + 1}: Height = ${barGraphHeight}, Width = ${barGraphWidth}, Y-Axis Value = ${yAxisValue}`);
      }
  
      // Log the X-axis values
      console.log('X-Axis Values:', xAxisValues);
    });
});

test.describe('Dashboard - Transaction Table Test', () => {
  test('Transaction Table Visibility', async () => {
    // Section 1: Check transaction table visibility
    // Scroll down to the transaction table
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Check if the transaction table is present
    const transactionTable = await page.$('div.table-responsive > div#transactions-list_wrapper.dt-container.dt-bootstrap5.dt-empty-footer');
    expect(transactionTable).not.toBeNull();
  });

    test('Transaction Status', async () => {
      // Check the "Failed Pending Success" dropdown
      const statusDropdown = await page.getByLabel('Failed Pending Success');
      const statusOptions = ['-1', '0', '1'];
      for (const option of statusOptions) {
        await statusDropdown.click(); // Open the dropdown
        await statusDropdown.selectOption(option);
        const selectedStatusValue = await statusDropdown.inputValue();
        expect(selectedStatusValue).toBe(option);
        // Add a check to verify the table updates accordingly
        const tableRows = await page.$$('div#transactions-list_wrapper tbody tr');
        expect(tableRows.length).toBeGreaterThan(0); // Ensure there are rows in the table
        // Add a delay of 10-20 seconds
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000)));

        // Add a delay of 0.3 seconds before scrolling
        await new Promise(resolve => setTimeout(resolve, 300));

        // Scroll down to the bottom of the table
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        // Add a delay to simulate reading time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Scroll back up to the transaction table part
        const transactionTable = await page.$('div.table-responsive > div#transactions-list_wrapper.dt-container.dt-bootstrap5.dt-empty-footer');
        await transactionTable.scrollIntoViewIfNeeded();
        // Add a delay to simulate reading time
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    });

    test('Transaction Table Entry Page', async () => {
      const entriesDropdown = await page.getByLabel('entries per page');
      const entriesOptions = ['10', '25', '50', '100'];
      for (const option of entriesOptions) {
        await entriesDropdown.click(); // Open the dropdown
        await entriesDropdown.selectOption(option);
        const selectedEntriesValue = await entriesDropdown.inputValue();
        expect(selectedEntriesValue).toBe(option);
    
        // Add a check to verify the table updates accordingly
        const tableRows = await page.$$('div#transactions-list_wrapper tbody tr');
        expect(tableRows.length).toBeLessThanOrEqual(parseInt(option)); // Ensure the number of rows does not exceed the selected entries per page
    
        // Add a delay of 10-20 seconds
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000)));
    
        // Add a delay of 1 second before scrolling
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        // Scroll down to the bottom of the table
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        // Add a delay to simulate reading time
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        // Validate the "Showing 1 to X" text
        const showingText = `Showing 1 to ${option}`;
        const showingElement = await page.getByText(showingText);
        expect(showingElement).toBeVisible();
    
        // Validate the number of rows under the transaction table
        const transactionRows = await page.$$('div#transactions-list_wrapper tbody tr');
        console.log(`Number of rows for option ${option}: ${transactionRows.length}`);
        expect(transactionRows.length).toBe(parseInt(option)); // Ensure the number of rows matches the selected entries per page
    
        // Scroll back up to the transaction table part
        const transactionTable = await page.$('div.table-responsive > div#transactions-list_wrapper.dt-container.dt-bootstrap5.dt-empty-footer');
        await transactionTable.scrollIntoViewIfNeeded();
        // Add a delay to simulate reading time
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    });
    
    test('Page Number Functionality', async () => {
      const entriesDropdown = await page.getByLabel('entries per page');
      const entriesOptions = ['10', '25', '50', '100'];
    
      for (const option of entriesOptions) {
        await entriesDropdown.click();
        await entriesDropdown.selectOption(option);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for the table to update
    
        // Get the total number of entries
        const totalEntriesText = await page.textContent('div#transactions-list_info');
        const totalEntriesMatch = totalEntriesText.match(/of (\d+) entries/);
        const totalEntries = parseInt(totalEntriesMatch[1]);
    
        // Function to generate the "Showing X to Y of Z entries" text
        const generateShowingText = (start, end, total) => `Showing ${start} to ${end} of ${total} entries`;
    
        // Calculate the number of entries per page
        const entriesPerPage = parseInt(option);
    
        // Validate initial page
        let showingText = generateShowingText(1, entriesPerPage, totalEntries);
        let showingElement = await page.getByText(showingText);
        expect(showingElement).toBeVisible();
    
        // Click Next and validate
        await page.getByLabel('Next').click();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the table to update
        showingText = generateShowingText(entriesPerPage + 1, Math.min(entriesPerPage * 2, totalEntries), totalEntries);
        showingElement = await page.getByText(showingText);
        expect(showingElement).toBeVisible();
    
        // Click Next and validate
        await page.getByLabel('Next').click();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the table to update
        showingText = generateShowingText(entriesPerPage * 2 + 1, Math.min(entriesPerPage * 3, totalEntries), totalEntries);
        showingElement = await page.getByText(showingText);
        expect(showingElement).toBeVisible();
    
        // Click Previous and validate
        await page.getByLabel('Previous').click();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the table to update
        showingText = generateShowingText(entriesPerPage + 1, Math.min(entriesPerPage * 2, totalEntries), totalEntries);
        showingElement = await page.getByText(showingText);
        expect(showingElement).toBeVisible();

        // Click First and validate
        await page.getByLabel('First').click();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the table to update
        showingText = generateShowingText(1, entriesPerPage, totalEntries);
        showingElement = await page.getByText(showingText);
        expect(showingElement).toBeVisible();
    
        // Click Last and validate
        await page.getByLabel('Last').click();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the table to update
        const lastPageStart = Math.floor((totalEntries - 1) / entriesPerPage) * entriesPerPage + 1;
        showingText = generateShowingText(lastPageStart, totalEntries, totalEntries);
        showingElement = await page.getByText(showingText);
        expect(showingElement).toBeVisible();
      }
    });
});