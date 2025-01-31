import { test, expect } from '@playwright/test';

test.describe.parallel('Mobile - Login', () => {
    test('onboarding screen visible and click skip button', async ({ page }) => {
        await page.goto('https://traxionpay-app.web.app/#/login);
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/onboarding');
        
        // Wait for the flutter-view element to be present
        const flutterView = await page.waitForSelector('flutter-view');

        // Access the shadow DOM of the flutter-view element
        const shadowRootHandle = await flutterView.evaluateHandle(el => el.shadowRoot);

        // Find the skip button within the shadow DOM
        const skipButtonHandle = await shadowRootHandle.evaluateHandle(root => {
            if (root) {
                return Array.from(root.querySelectorAll('button')).find(button => button.textContent && button.textContent.includes('Skip'));
            }
            return null;
        });

        // Click the skip button if it exists
        if (skipButtonHandle) {
            const skipButton = await skipButtonHandle.asElement();
            if (skipButton) {
                await skipButton.click();
            } else {
                throw new Error('Skip button not found');
            }
        } else {
            throw new Error('Skip button not found');
        }

        // Add assertions to verify the result of the button click
        await expect(page).toHaveURL('https://traxionpay-app.web.app/#/next-page'); // Adjust the URL as needed
    });
});


