import {test, expect} from '@playwright/test';

test.describe.parallel('API Testing', () => {
    const baseURL = 'https://api-sit.traxionpay.com'

    test('Simple API Test - Assert Status Code', async ({request}) => {
        const response = await request.get(`${baseURL}/auth/login`);
        expect(response.status()).toBe(200);
    })
});