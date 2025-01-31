import { test, expect, Page } from '@playwright/test';



test.describe.parallel('Mobile - Login', () => {
    test('test navigation', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        });

    test('mobile first open check', async ({ page }) => {
        await page.getByRole('textbox').isVisible();
        await page.locator('flutter-view').click();
        await page.locator('Login').click();
        });
});