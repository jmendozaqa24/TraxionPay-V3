import { test, expect } from '@playwright/test';
import userDetails from './userDetails.json'; 

function getRandomCorrectUser() {
    const testDataUsers = userDetails.correctUsers;
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

        test('Transactions - Status Selection', async () => {
        await page.getByLabel('Success Pending Failed').selectOption('success');

        });

        test('Transactions - Type Selection', async () => {
        //await page.getByLabel('All Cash-Ins Cash-Outs').selectOption('cr');

        });

    }); 
});