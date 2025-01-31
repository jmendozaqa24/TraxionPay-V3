import { test, expect } from '@playwright/test';

test.describe.parallel('Mobile - Login', () => {
    test('onboarding screen visible and click next button', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/onboarding');
        
        // Click the next button in the Flutter app
        const buttonClicked = await page.evaluate(() => {
            const flutterApp = document.querySelector('flutter-view');
            if (flutterApp && flutterApp.shadowRoot) {
                const nextButton = Array.from(flutterApp.shadowRoot.querySelectorAll('button')).find(button => button.textContent && button.textContent.includes('NEXT'));
                if (nextButton) {
                    nextButton.click();
                    return true;
                }
            }
            return false;
        });

        // Assert that the button was clicked
        expect(buttonClicked).toBe(true);

        // Add assertions to verify the result of the button click
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/next-page'); // Adjust the URL as needed
    });
});