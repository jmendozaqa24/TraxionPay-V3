import { test, expect } from '@playwright/test';

test.describe.parallel('API Testing', () => {
    const baseURL = 'https://merchant-sit.traxionpay.com';

    test('User Login API Test', async ({ request }) => {
        const loginPayload = {
            username: "ejarcena03@traxiontech.net",
            userPassword: "p@55w0rd"
        };

        const response = await request.post(`${baseURL}/auth/login`, {
            data: loginPayload
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        console.log(responseBody);

    });
});