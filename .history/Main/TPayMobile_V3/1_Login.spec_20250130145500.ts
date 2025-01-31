import { test, expect, Page } from '@playwright/test';



test.describe.parallel('Mobile - Login', () => {
    test('test navigation', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        });

    test('onboarding screen visible', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/onboarding');

        await page.getByRole'text="Skip"').click();
    });
});