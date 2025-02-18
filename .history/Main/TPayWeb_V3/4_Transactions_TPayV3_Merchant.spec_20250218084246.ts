import { test, expect } from '@playwright/test';
import userDetails from './userDetails.json'; 

function getRandomCorrectUser() {
    const testDataUsers = userDetails.testDataUsers;
    const randomIndex = Math.floor(Math.random() * testDataUsers.length);
    return testDataUsers[randomIndex];
}

test.describe('Transactions', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        const testDataUsers = getRandomCorrectUser();

        await page.goto('https://merchant-sit.traxionpay.com/signin');
        await page.getByPlaceholder('your@email.com').fill(testDataUsers.email);
        await page.getByPlaceholder('your password').fill(testDataUsers.password);
        await page.getByRole('button', { name: 'Sign in' }).click();
    });

    test.afterAll(async () => {
        await page.close();
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

    test('Transactions - Tab Navigation', async () => {        
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const transactionTable = await page.$('div.table-responsive > div#transactions-list_wrapper.dt-container.dt-bootstrap5.dt-empty-footer');
        expect(transactionTable).not.toBeNull();
    });

    test('Transactions - Table Visibility', async () => {        
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const transactionTable = await page.$('div.table-responsive > div#transactions-list_wrapper.dt-container.dt-bootstrap5.dt-empty-footer');
        expect(transactionTable).not.toBeNull();
    });

    test('Transactions - Progress', async () => {
        // Your test code here
    }); 
});