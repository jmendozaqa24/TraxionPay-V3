import { test, expect } from '@playwright/test';

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
            if (flutterApp && flutterApp.shadowRoot) {
                const nextButton = Array.from(flutterApp.shadowRoot.querySelectorAll('button')).find(button => button.textContent && button.textContent.includes('Next'));
                if (nextButton) {
                    nextButton.click();
                }
            }
        });
    });
});