import { test, expect } from '@playwright/test';
import { getEnvVariable } from './environmentUtils';

test.describe.parallel('API Testing - Person Profile', () => {
  const baseURL = 'https://api-sit.traxionpay.com';

  test('Get Profile', async ({ request }) => {
    const bearerToken = getEnvVariable('bearer_token');

    const response = await request.get(`${baseURL}/persons/profile/40602`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody);

    // Add more assertions as needed
    expect(responseBody).toHaveProperty('data');
    const data = responseBody.data;
    console.log(data);
  });
});