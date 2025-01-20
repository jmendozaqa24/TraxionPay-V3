import { test, expect } from '@playwright/test';
import { generateOtpAndEncryptBody } from './preRequestScript';
import { decryptResponse } from './postResponseScript';
import { getEnvVariable, setEnvVariable } from './environmentUtils';

test.describe.parallel('API Testing Login', () => {
  const baseURL = 'https://api-sit.traxionpay.com';

  test('Login', async ({ request }) => {
    const loginPayload = {
      username: "vasalanga+1@traxiontech.net",
      userPassword: "Traxion123!",
      passwordType: 1,
      applicationId: 1
    };

    const { encryptedBody, otp } = generateOtpAndEncryptBody(loginPayload, "HCFQQARAAHRGMYDK");

    console.log("Using hardcoded secret key for login TOTP generation.");

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

    // Store environment variables
    if (response_data.code == '220022') {
      setEnvVariable('bearer_token', response_data.data.accessToken);
      setEnvVariable('refresh_token', response_data.data.refreshToken);
      setEnvVariable('secret_key', response_data.data.secretKey);
      setEnvVariable('generated_totp_code', otp); // Save the OTP used for login
    }
  });

  test('Logout', async ({ request }) => {
    const bearerToken = getEnvVariable('bearer_token');

    const response = await request.get(`${baseURL}/auth/logout`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody);

    // Clear environment variables on logout
    setEnvVariable('bearer_token', '');
    setEnvVariable('refresh_token', '');
    setEnvVariable('secret_key', '');
    setEnvVariable('generated_totp_code', '');
  });
});

test.describe.parallel('API Testing WhoAmI', () => {
  const baseURL = 'https://api-sit.traxionpay.com';

  test('WhoAmI', async ({ request }) => {
    const bearerToken = getEnvVariable('bearer_token');
    const newSecret = getEnvVariable('secret_key');

    console.log("Using new secret key TOTP for WhoAmI request.");

    const { otp: newOtp } = generateOtpAndEncryptBody({}, newSecret);

    setEnvVariable('generated_totp_code', newOtp);

    const response = await request.get(`${baseURL}/auth/whoami`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody);

    // Decrypt the response
    const decryptedResponse = decryptResponse(responseBody, newOtp);
    console.log(decryptedResponse);

    // Add more assertions as needed
    expect(decryptedResponse).toHaveProperty('data');
    const data = decryptedResponse.data;
    console.log(data);
  });

  // Add negative scenarios for WhoAmI
  test('WhoAmI with invalid token', async ({ request }) => {
    const invalidBearerToken = 'invalid_token';
    const response = await request.get(`${baseURL}/auth/whoami`, {
      headers: {
        'Authorization': `Bearer ${invalidBearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(401); // Expect unauthorized status
    const responseBody = await response.json();
    console.log(responseBody);
  });

  test('WhoAmI with expired token', async ({ request }) => {
    const expiredBearerToken = 'expired_token'; // Replace with an actual expired token for testing

    const response = await request.get(`${baseURL}/auth/whoami`, {
      headers: {
        'Authorization': `Bearer ${expiredBearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(401); // Expect unauthorized status
    const responseBody = await response.json();
    console.log(responseBody);
  });

  // Duplicate test to run WhoAmI 10 times
  test('WhoAmI 10 times', async ({ request }) => {
    const bearerToken = getEnvVariable('bearer_token');
    const newSecret = getEnvVariable('secret_key');

    console.log("Using new secret key TOTP for WhoAmI request.");

    for (let i = 0; i < 500; i++) {
      const { otp: newOtp } = generateOtpAndEncryptBody({}, newSecret);

      setEnvVariable('generated_totp_code', newOtp);

      const response = await request.get(`${baseURL}/auth/whoami`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      console.log(`Response ${i + 1}:`, responseBody);

      // Decrypt the response
      const decryptedResponse = decryptResponse(responseBody, newOtp);
      console.log(`Decrypted Response ${i + 1}:`, decryptedResponse);

      // Add more assertions as needed
      expect(decryptedResponse).toHaveProperty('data');
      const data = decryptedResponse.data;
      console.log(`Data ${i + 1}:`, data);
    }
  });
});