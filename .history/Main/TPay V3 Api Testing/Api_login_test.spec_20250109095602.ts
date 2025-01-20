import { test, expect } from '@playwright/test';

test.describe.parallel('API Testing', () => {
    const baseURL = 'https://merchant-sit.traxionpay.com';

    test('User Login API Test', async ({ request }) => {
        const loginPayload = {
            username: "ejarcena03@traxiontech.net",
            userPassword: "Traxion@01!",
            passwordType: 1,
            applicationId: 1
        };

        const response = await request.post(`${baseURL}/auth/login`, {
            data: loginPayload
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        console.log(responseBody);

        // Add more assertions as needed
        expect(responseBody).toHaveProperty('token'); // Example assertion
    });
});