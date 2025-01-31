import { test, expect } from '@playwright/test';

test.describe.parallel('Mobile - Login', () => {
    test('onboarding screen visible and click skip button', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/onboarding');
        
        //await page.getByRole('button', { name: 'Skip' }).click();
        for (let i = 0; i < 5; i++) {
            await page.getByRole('button', { name: 'Next' }).click();
        }

     
    });
});


