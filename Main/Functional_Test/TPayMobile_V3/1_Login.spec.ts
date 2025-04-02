import { test, expect } from '@playwright/test';

test.describe.parallel('Mobile - Login Page', () => {
    test('Login - Onboarding Screen Visibility', async ({ page }) => {
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

    test.describe.serial('Mobile - Login Page', () => {
        test('Login - Valid Credentials', async ({ page }) => {
            await page.goto('https://traxionpay-app.web.app/#/login');

            //skip onboarding
            await page.getByRole('button', { name: 'Skip' }).click();
            //condition to pass
            
            await expect(page).toHaveURL('https://traxionpay-app.web.app/#/login');
            await page.waitForTimeout(1000); 
            //login
            await page.getByLabel('9XX XXX XXXX').focus();
            await page.getByLabel('9XX XXX XXXX').fill('9947369780');

            await page.getByLabel('Enter Password').focus();
            await page.getByLabel('Enter Password').fill('Traxion123!');

            await page.getByRole('button', { name: 'Login' }).click();

        });
    });
});


