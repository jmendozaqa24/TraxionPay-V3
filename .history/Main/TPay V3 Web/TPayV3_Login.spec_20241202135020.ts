import { test, expect } from '@playwright/test';

await page.goto('https://merchant-sit.traxionpay.com/signin');

await page.getByPlaceholder('your@email.com').click();
await page.getByPlaceholder('your password').click();
await page.getByRole('button', { name: 'Sign in' }).click();




await page.getByRole('link', { name: 'Traxion Logo' }).click();
await page.getByText('Login to your account Email').click();

