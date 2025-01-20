import { test, expect } from '@playwright/test';
import { generateOtpAndEncryptBody } from './preRequestScript';
import { decryptResponse } from './postResponseScript';
import { getEnvVariable, setEnvVariable } from './environmentUtils';
import { allure } from 'allure-playwright';

test.describe.parallel('API Testing - Login', () => {
  const baseURL = getEnvVariable('base_url');

  test('Login', async ({ request }) => {
    allure.description('This test logs in a user and stores the tokens in environment variables.');

    const loginPayload = {
      username: "+639777781410",
      userPassword: "Traxion@01!",
      passwordType: 1,
      applicationId: 1
    };
    /*
    const loginPayload = {
      username: "+639777781410",
      userPassword: "Traxion@01!",
      passwordType: 1,
      applicationId: 1
    };
    */

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
    allure.description('This test logs out a user and clears the tokens from environment variables.');

    const bearerToken = getEnvVariable('bearer_token');
    const newSecret = getEnvVariable('secret_key');

    const { otp: newOtp } = generateOtpAndEncryptBody({}, newSecret);
    setEnvVariable('generated_totp_code', newOtp);

    const response = await request.get(`${baseURL}/auth/logout`, {
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

    // Clear environment variables on logout
    setEnvVariable('bearer_token', '');
    setEnvVariable('refresh_token', '');
    setEnvVariable('secret_key', '');
    setEnvVariable('generated_totp_code', '');
  });
});

test.describe.parallel('API Testing - WhoAmI', () => {
  const baseURL = getEnvVariable('base_url');

  test('WhoAmI', async ({ request }) => {
    allure.description('This test retrieves the current user information using the WhoAmI endpoint.');

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

  test('WhoAmI multiple times', async ({ request }) => {
    allure.description('This test runs the WhoAmI endpoint multiple times to calculate the average response time.');

    test.setTimeout(600000); 

    const bearerToken = getEnvVariable('bearer_token');
    const newSecret = getEnvVariable('secret_key');

    console.log("Using new secret key TOTP for WhoAmI request.");

    const iterations = 500; // Change this value to the desired number of iterations
    let totalResponseTime = 0;
    let successfulRequests = 0;
    let encounteredErrors = 0;
    const errors: string[] = []; 

    for (let i = 0; i < iterations; i++) {
      try {
        const { otp: newOtp } = generateOtpAndEncryptBody({}, newSecret);

        setEnvVariable('generated_totp_code', newOtp);

        const startTime = performance.now();

        const response = await request.get(`${baseURL}/auth/whoami`, {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
          }
        });

        const endTime = performance.now();
        const responseTime = endTime - startTime;
        totalResponseTime += responseTime;

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

        successfulRequests++;
      } catch (error) {
        console.error(`Error on request ${i + 1}:`, error);
        encounteredErrors++;
        errors.push(`Error on request ${i + 1}: ${error.message}`);
      }
    }

    const averageResponseTime = totalResponseTime / iterations;
    console.log(`Average Response Time: ${averageResponseTime} ms`);
    console.log(`Successfully Run ${iterations} times WhoAmI`);
    console.log(`No encountered errors: ${encounteredErrors === 0}`);
    if (encounteredErrors > 0) {
      console.log(`Encountered errors: ${encounteredErrors}`);
      errors.forEach(error => console.log(error));
    }
  });
});

test.describe.parallel('API Testing - Refresh Tokens', () => {
  const baseURL = getEnvVariable('base_url');
  
  test('Refresh-Token', async ({ request }) => {
    allure.description('This test refreshes the tokens using the refresh token endpoint.');

    const bearerToken = getEnvVariable('bearer_token');
    const newSecret = getEnvVariable('secret_key');
    const refreshToken = getEnvVariable('refresh_token');

    console.log("Using new secret key TOTP for Refresh Token request.");

    const { otp: newOtp } = generateOtpAndEncryptBody({}, newSecret);

    setEnvVariable('generated_totp_code', newOtp);

    const response = await request.post(`${baseURL}/auth/refresh-token`, {
      data: { refreshToken },
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

    // Store the new tokens
    if (decryptedResponse.code == '220022') {
      setEnvVariable('bearer_token', decryptedResponse.data.accessToken);
      setEnvVariable('refresh_token', decryptedResponse.data.refreshToken);
    }
  });
});