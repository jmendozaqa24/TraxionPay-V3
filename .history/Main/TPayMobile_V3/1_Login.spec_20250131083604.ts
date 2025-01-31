import { test, expect } from '@playwright/test';

test.describe.parallel('Mobile - Login', () => {
    test('onboarding screen visible and click skip button', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/onboarding');
        
        await page.locator('#flt-semantic-node-7').isVisible();

        //await page.getByRole('button', { name: 'Skip' }).isVisible();
        for (let i = 0; i < 6; i++) {
            const nextButton = page.getByRole('button', { name: 'Next' });
            await nextButton.click();
            await page.waitForTimeout(1000); 
        }

        //condition to pass
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/login');        
    });

    test('login with valid credentials', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');

        //skip onboarding
        await page.getByRole('button', { name: 'Skip' }).click();
        //condition to pass
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/login');

        //login
        await page.getByPlaceholder('9XX XXX XXXX').fill('9947369780');
        await page.getByLabel('Enter Password').fill('Traxion123!');

    });
});


