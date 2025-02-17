import { test, expect } from '@playwright/test';
import userDetails from './userDetails.json'; 

function getRandomCorrectUser() {
    const testDataUsers = userDetails.testDataUsers;
    const randomIndex = Math.floor(Math.random() * testDataUsers.length);
    return testDataUsers[randomIndex];
  }
  
  
  let context;
  let page;
  
  test.afterEach(async ({ page }) => {
    if (test.info().status !== test.info().expectedStatus) {
      // Add a hook to take a screenshot on failure
      const screenshotPath = `screenshots/${test.info().title}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      test.info().attachments.push({
        name: 'Screenshot',
        path: screenshotPath,
        contentType: 'image/png'
      });
    }
  });
  
  test.describe('Transactions', () => {
    test('Transactions - Tab Navigation', async ({ page }) => {
        const testDataUsers = getRandomCorrectUser();
        await page.goto('https://merchant-sit.traxionpay.com/signin');
        await page.getByPlaceholder('your@email.com').fill(testDataUsers.email);
        await page.getByPlaceholder('your password').fill(testDataUsers.password);
        await page.getByRole('button', { name: 'Sign in' }).click();

        await page.getByRole('link', { name: 'Transactions' }).click();
        
    });

    test('Transactions - Table Visibility', async ({ page }) => {
        const testDataUsers = getRandomCorrectUser();
        await page.goto('https://merchant-sit.traxionpay.com/signin');
        await page.getByPlaceholder('your@email.com').fill(testDataUsers.email);
        await page.getByPlaceholder('your password').fill(testDataUsers.password);
        await page.getByRole('button', { name: 'Sign in' }).click();

        await page.getByRole('link', { name: 'Transactions' }).click();
        
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        // Check if the transaction table is present
        const transactionTable = await page.$('div.table-responsive > div#transactions-list_wrapper.dt-container.dt-bootstrap5.dt-empty-footer');
        expect(transactionTable).not.toBeNull();
    });

  });