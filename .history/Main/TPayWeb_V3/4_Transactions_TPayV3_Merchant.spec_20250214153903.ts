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
    test('Transactions - Visibility', async ({ page }) => {
        await page.goto('https://merchant-sit.traxionpay.com/signin');
        await page.getByRole('link', { name: 'Transactions' }).click();
        await expect(page).toHaveURL('https://merchant-sit.traxionpay.com/transactions');
    });
  });