// filepath: /c:/Users/vasalanga/Documents/Projects/TPAYV3_AUTOMATION/Main/TPay V3 Api Testing/postResponseScript.ts
import cryptoJS from 'crypto-js';

export const decryptResponse = (responseBody, otp) => {
  let decrypted = cryptoJS.AES.decrypt(responseBody.data, otp);
  let response_data = JSON.parse(decrypted.toString(cryptoJS.enc.Utf8));
  console.log("RESPONSE DATA", response_data);

  if (response_data.code == '220022') {
    // log in, set your session variables
    console.log("Login successful");
  } else if (response_data.code == '440044' || response_data.code == '40300') {
    // log out, remove your session variables
    console.log("Login failed");
  }

  return response_data;
};