import { test, expect } from '@playwright/test';
import { generateOtpAndEncryptBody } from './preRequestScript';
import { decryptResponse } from './postResponseScript';
import { getEnvVariable, setEnvVariable } from './environmentUtils';

test.describe.parallel('API Testing - Person Profile', () => {
    const baseURL = 'https://api-sit.traxionpay.com';
  
    test('Get Profile', async ({ request }) => {
      const bearerToken = getEnvVariable('bearer_token');
      const secretKey = getEnvVariable('secret_key');
  
      // Generate new OTP using the secret key
      const { otp: newOtp } = generateOtpAndEncryptBody({}, secretKey);
  
      const response = await request.get(`${baseURL}/persons/profile/40602`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      console.log(responseBody);
  
      // Decrypt the response using the new OTP
      const decryptedResponse = decryptResponse(responseBody, newOtp);
      console.log(decryptedResponse);
  
      // Add more assertions as needed
      expect(decryptedResponse).toHaveProperty('data');
      const data = decryptedResponse.data;
      console.log(data);
    });
  
    test('Get Profile with Invalid Person ID', async ({ request }) => {
      const bearerToken = getEnvVariable('bearer_token');
  
      const response = await request.get(`${baseURL}/persons/profile/invalid-id`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(400); // Assuming the API returns 400 for invalid ID
    });
  
    test('Get Profile with Non-existent Person ID', async ({ request }) => {
      const bearerToken = getEnvVariable('bearer_token');
  
      const response = await request.get(`${baseURL}/persons/profile/999999`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(404); // Assuming the API returns 404 for non-existent ID
    });
  
    test('Get Profile without Bearer Token', async ({ request }) => {
      const response = await request.get(`${baseURL}/persons/profile/40602`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(401); // Assuming the API returns 401 for unauthorized access
    });
  
    test('Get Profile with Invalid Bearer Token', async ({ request }) => {
      const response = await request.get(`${baseURL}/persons/profile/40602`, {
        headers: {
          'Authorization': `Bearer invalid-token`,
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(401); // Assuming the API returns 401 for invalid token
    });
  
    test('Get Profile with Expired Token', async ({ request }) => {
      const expiredToken = 'expired-token'; // Replace with an actual expired token for testing
  
      const response = await request.get(`${baseURL}/persons/profile/40602`, {
        headers: {
          'Authorization': `Bearer ${expiredToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(401); // Assuming the API returns 401 for expired token
    });
  });