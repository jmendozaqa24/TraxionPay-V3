import { test, expect, Page } from '@playwright/test';



test.describe.parallel('Mobile - Login', () => {
    test('test navigation', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        });

    test('mobile firt open check', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        });
});