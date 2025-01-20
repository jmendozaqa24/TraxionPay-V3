// filepath: /c:/Users/vasalanga/Documents/Projects/TPAYV3_AUTOMATION/Main/TPay V3 Api Testing/Api_login_test.spec.ts
import { test, expect } from '@playwright/test';
import { generateOtpAndEncryptBody } from './preRequestScript';
import { decryptResponse } from './postResponseScript';

test.describe.parallel('API Testing', () => {
  const baseURL = 'https://api-sit.traxionpay.com';

  test('User Login API Test', async ({ request }) => {
    const loginPayload = {
      username: "+639777781410",
      userPassword: "Traxion@01!",
      passwordType: 1,
      applicationId: 1
    };

    const { encryptedBody, otp } = generateOtpAndEncryptBody(loginPayload);

    const response = await request.post(`${baseURL}/auth/login`, {
      data: { data: encryptedBody },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody);

    const response_data = decryptResponse(responseBody, otp);

    // Add more assertions as needed
    expect(response_data).toHaveProperty('accessToken'); // Example assertion
  });
});