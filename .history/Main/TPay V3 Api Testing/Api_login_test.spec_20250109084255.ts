import {test, expect} from '@playwright/test';

test.describe.parallel('API Testing', () => {
    const baseURL = 'https://sit2.traxionpay.com/api'

    test('Simple API Test - Assert Status Code', async ({request}) => {
        const response = await request.get(`${baseURL}/users/2`);
        expect(response.status()).toBe(200);
    })
});