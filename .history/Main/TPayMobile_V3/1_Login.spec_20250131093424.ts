import { test, expect } from '@playwright/test';

test.describe.parallel('Mobile - Login Page', () => {
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

        // Retry mechanism to fill the fields
        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Fill the phone number field
                await page.getByLabel('9XX XXX XXXX').fill('9947369780');
                // Fill the password field
                await page.getByLabel('Enter Password').fill('Traxion123!');
                break; // Exit the loop if successful
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error; // Rethrow the error if max retries reached
                }
                await page.waitForTimeout(1000); // Wait before retrying
            }
        }

        // Click the login button
        await page.getByRole('button', { name: 'Login' }).click();
    });
});


