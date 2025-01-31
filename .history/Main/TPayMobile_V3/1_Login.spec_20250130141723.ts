import { test, expect, Page } from '@playwright/test';


test('test navigation', async ({ page }) => {
  await page.goto('https://traxionpay-app.web.app/#/login');
});