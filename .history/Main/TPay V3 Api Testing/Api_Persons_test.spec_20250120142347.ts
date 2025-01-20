import { test, expect } from '@playwright/test';
import { generateOtpAndEncryptBody } from './preRequestScript';
import { decryptResponse } from './postResponseScript';
import { getEnvVariable, setEnvVariable } from './environmentUtils';

test.describe.parallel('API Testing - Person Profile', () => {
  const baseURL = getEnvVariable('base_url');
  
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
  
    test('Get Profile - Invalid Person ID', async ({ request }) => {
      const bearerToken = getEnvVariable('bearer_token');
  
      const response = await request.get(`${baseURL}/persons/profile/invalid-id`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(400); 
    });
  
    test('Get Profile - Non-existent Person ID', async ({ request }) => {
      const bearerToken = getEnvVariable('bearer_token');
  
      const response = await request.get(`${baseURL}/persons/profile/999999`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(400);
    });
  
    test('Get Profile - without Bearer Token', async ({ request }) => {
      const response = await request.get(`${baseURL}/persons/profile/40602`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(403);  
    });
  
    test('Get Profile - Invalid Bearer Token', async ({ request }) => {
      const response = await request.get(`${baseURL}/persons/profile/40602`, {
        headers: {
          'Authorization': `Bearer invalid-token`,
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(502); 
    });
  
    test('Get Profile - Expired Token', async ({ request }) => {
      const expiredToken = 'eyJzdWIiOjE3MzY5MTI5NzY3MDY0NDIsInVzZXIiOiJVMkZzZEdWa1gxOG1jaXQycVJsS1RNOXgySDRlcEpwYTdIWENtYlBPTFJWTGR1WmxoazR1RkxiSnlEQVZNMkxXcjBOZnVTR0l6YXNBaVZJRDBRZDk1ZXVpM000ZnZtU1N1eE9iSjhkMnF2MXZhNk56VW42d240L0pidTl2azhNcTQxQUt6aGFUVHRtcjV2QkxQcTFTNk1VTkwwNVA1cTRzM3RQUVNqNmYxVGdOVkpxUWlUejFhdm1qRmdzbEtTNlBEbGxFQXJqNXVxNWxoUENsSU94TFR5aXdYR0pMa1R4N2xPWm4zRS9tSjE4YjFhYWIwd0FoTHVFaTFJVldYRzhUKzZLd1YxN3A3RlphSDFIaGtmaUlEL1kzamZMU2MvYzBoVzhyWWphUDAzb3ExanhTL1AxVzhIYVVybTltem5mNU43ZVdFNHM3QkZsVGx3YkVxVHZndXFUZjUrcmJOcEE2YmtIZWJkSDdxejRYSmVtcEZkalFWYmhETHk4WlBScjN3M1NzRnUwODh0WWZxMGhlay9zbWlTTnZWYi9qd2doczhOSGN3cmczTFNhN1F5TGZrU3ZFSEgwRG1ZWjBQVkRkQlVoZmlRQ1dxVldlL0ZVbDMzYnNYK2V6eUtYZmNOZkliOVIyQzVJcjZaV1N2WGJOOW1Pck5BRWNuL1JzbmNkVDU1RldGZ3MrMTNnMjJDdGg1S1lXYWtZbGthWEZSUG9uRGtkSzFKMERZalZTOUkwbnBaQTFyQldpejdiTEdPRTIiLCJyYW5kb20iOiJYWUtLQUFYVUVXR0JYTUxCIiwiaWF0IjoxNzM2OTEyOTc2LCJleHAiOjE3MzgxMjI1NzZ9'; 
  
      const response = await request.get(`${baseURL}/persons/profile/40602`, {
        headers: {
          'Authorization': `Bearer ${expiredToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(502);
    });
});

test.describe.parallel('API Testing - Person List', () => {
    
  const baseURL = getEnvVariable('base_url');
  
    test('Get Person List', async ({ request }) => {
      const bearerToken = getEnvVariable('bearer_token');
      const secretKey = getEnvVariable('secret_key');
  
      // Generate new OTP using the secret key
      const { otp: newOtp } = generateOtpAndEncryptBody({}, secretKey);
  
      const response = await request.get(`${baseURL}/persons`, {
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

    test('Get Person List with Invalid Token', async ({ request }) => {
      const invalidBearerToken = 'invalid_token';
      const secretKey = getEnvVariable('secret_key');
  
      // Generate new OTP using the secret key
      const { otp: newOtp } = generateOtpAndEncryptBody({}, secretKey);
  
      const response = await request.get(`${baseURL}/persons`, {
        headers: {
          'Authorization': `Bearer ${invalidBearerToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      expect(response.status()).toBe(401); // Expecting Unauthorized status
      const responseBody = await response.json();
      console.log(responseBody);
  
      // Decrypt the response using the new OTP (if applicable)
      // const decryptedResponse = decryptResponse(responseBody, newOtp);
      // console.log(decryptedResponse);
  
      // Add more assertions as needed
      expect(responseBody).toHaveProperty('error');
      const error = responseBody.error;
      console.log(error);
    });
  });
});