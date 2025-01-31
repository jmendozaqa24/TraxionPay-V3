import { test, expect, Page } from '@playwright/test';



test.describe.parallel('Mobile - Login', () => {
    test('test navigation', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        });

    test('onboarding screen visible and click next button', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/onboarding');
        
        // Click the next button in the Flutter app
        await page.evaluate(() => {
            const flutterApp = document.querySelector('flutter-view');
            if (flutterApp) {
            const nextButton = flutterApp.shadowRoot.querySelector('button'); // Adjust the selector as needed
            if (nextButton) {
                nextButton.click();
            }
            }
        });
        
        // Add assertions to verify the result of the button click
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/next-page'); // Adjust the URL as needed
        });
});