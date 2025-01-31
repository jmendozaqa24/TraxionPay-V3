import { test, expect } from '@playwright/test';

test.describe.parallel('Mobile - Login', () => {
    test('onboarding screen visible and click skip button', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login');
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/onboarding');
        
        // Click the skip button in the Flutter app
        const buttonClicked = await page.evaluate(() => {
            const flutterApp = document.querySelector('flutter-view');
            if (flutterApp && flutterApp.shadowRoot) {
                const skipButton = Array.from(flutterApp.shadowRoot.querySelectorAll('button')).find(button => button.textContent && button.textContent.includes('Skip'));
                if (skipButton) {
                    skipButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    return true;
                }
            }
            return false;
        });

        // Add assertions to verify the result of the button click
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/login'); // Adjust the URL as needed
    });
});