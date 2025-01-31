import { test, expect, Page } from '@playwright/test';



test.describe.parallel('API Testing - Login', () => {
    test('test navigation', async ({ page }) => {
    await page.goto('https://traxionpay-app.web.app/#/login');
    });

});