import { test, expect } from '@playwright/test';

test.describe.parallel('Mobile - Login', async () => {
    test('onboarding screen visible and click skip button', async () => {
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

    test('login with valid credentials', async () => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        


    });
});


