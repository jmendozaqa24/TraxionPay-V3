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