import { test, expect } from '@playwright/test';
import userDetails from './userDetails.json'; 

function getRandomCorrectUser() {
    const testDataUsers = userDetails.transactData;
    const randomIndex = Math.floor(Math.random() * testDataUsers.length);
    return testDataUsers[randomIndex];
}

test.describe('Transactions - Tab Navigation', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        const testDataUsers = getRandomCorrectUser();

        await page.goto('https://merchant-sit.traxionpay.com/signin');
        await page.getByPlaceholder('your@email.com').fill(testDataUsers.email);
        await page.getByPlaceholder('your password').fill(testDataUsers.password);
        await page.getByRole('button', { name: 'Sign in' }).click();
        await page.getByRole('link', { name: 'Transactions' }).click();

    });

    test.afterEach(async ({ }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
            const screenshotPath = `screenshots/${testInfo.title}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });
            testInfo.attachments.push({
                name: 'Screenshot',
                path: screenshotPath,
                contentType: 'image/png'
            });
        }
    });

    test('Transactions - Table Visibility', async () => {        
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const transactionTable = await page.$('div.table-responsive > div#transactions-list_wrapper.dt-container.dt-bootstrap5.dt-empty-footer');
        expect(transactionTable).not.toBeNull();
    });

    test.describe('Transactions - Progress', async () => {
        test('Transactions - Date Range Selection', async () => {
            // Open date picker
            await page.getByPlaceholder('Select date range').click();

            await page.getByRole('button').first().click();
            
            // Select start date (15th)
            await page.getByText('15', { exact: true }).first().click();
            
            // Select end date (19th)
            await page.getByText('19', { exact: true }).first().click();
            
            // Wait for table to update with new date range
            await page.waitForTimeout(2000); // Give time for data to load
            
            // Verify date range is applied
            const dateRangeInput = await page.getByPlaceholder('Select date range');
            const dateRangeValue = await dateRangeInput.inputValue();
            
            // Assert that selected dates are within range
            expect(dateRangeValue).toContain('15');
            expect(dateRangeValue).toContain('19');
            
            // Optional: Verify table data updated
            const transactionTable = await page.$('div.table-responsive > div#transactions-list_wrapper');
            expect(transactionTable).not.toBeNull();
            
            // Optional: Verify transaction dates are within selected range
            const tableContent = await page.textContent('div.table-responsive');
            expect(tableContent).toBeTruthy();
        });

        test('Transaction - Status Selection', async () => {
              // Check the "Failed Pending Success" dropdown
              const statusDropdown = await page.getByLabel('Success Pending Failed');
              const statusOptions = ['1', '0', '-1'];
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

        test('Transaction - Filter Selection', async () => {
            // Define filter options for transaction types
            const filterOptions = ['All', 'Cash-Ins', 'Cash-Outs'];
            const filterDropdown = await page.getByLabel('All Cash-Ins Cash-Outs');
        
            for (const option of filterOptions) {
                console.log(`Testing filter: ${option}`);
                
                // Select the filter option
                await filterDropdown.selectOption(option);
                
                // Wait for table to update
                await page.waitForTimeout(2000);
                
                // Verify filter is applied
                const tableRows = await page.$$('div#transactions-list_wrapper tbody tr');
                expect(tableRows.length).toBeGreaterThan(0);
                
                // Verify transaction types in table match selected filter
                if (option !== 'All') {
                    const transactionTypes = await page.$$eval('tbody tr td:nth-child(3)', 
                        cells => cells.map(cell => cell.textContent?.trim()));
                    
                    for (const type of transactionTypes) {
                        expect(type).toContain(option.slice(0, -1)); // Remove 's' from 'Cash-Ins'/'Cash-Outs'
                    }
                }
        
                // Scroll down to view more results
                await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                await page.waitForTimeout(1000);
        
                // Scroll back to filter
                const transactionTable = await page.$('div.table-responsive');
                await transactionTable?.scrollIntoViewIfNeeded();
                await page.waitForTimeout(1000);
            }
        });

        test('Transaction - Table Entry Page', async () => {
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

    }); 
});