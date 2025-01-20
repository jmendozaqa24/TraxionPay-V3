import { test, expect } from '@playwright/test';
import { getEnvVariable } from './environmentUtils';
import { decryptResponse } from './postResponseScript';

test.describe.parallel('API Testing - Person Profile', () => {
  const baseURL = 'https://api-sit.traxionpay.com';

  test('Get Profile', async ({ request }) => {
    const bearerToken = getEnvVariable('bearer_token');
    const secretKey = getEnvVariable('secret_key');

    const response = await request.get(`${baseURL}/persons/profile/40602`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody);

    // Decrypt the response
    const decryptedResponse = decryptResponse(responseBody, secretKey);
    console.log(decryptedResponse);

    // Add more assertions as needed
    expect(decryptedResponse).toHaveProperty('data');
    const data = decryptedResponse.data;
    console.log(data);
  });
});