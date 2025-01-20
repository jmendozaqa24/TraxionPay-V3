// filepath: /c:/Users/vasalanga/Documents/Projects/TPAYV3_AUTOMATION/Main/TPay V3 Api Testing/environmentUtils.ts
import fs from 'fs';
import path from 'path';

const envFilePath = path.resolve(__dirname, 'environment.json');

export const getEnvVariable = (key: string) => {
  const env = JSON.parse(fs.readFileSync(envFilePath, 'utf-8'));
  return env[key];
};

export const setEnvVariable = (key: string, value: string) => {
  const env = JSON.parse(fs.readFileSync(envFilePath, 'utf-8'));
  env[key] = value;
  fs.writeFileSync(envFilePath, JSON.stringify(env, null, 2), 'utf-8');
};

export const clearEnvVariables = () => {
  const currentSecretKey = getEnvVariable('secret_key');
  const env = {
    bearer_token: "",
    refresh_token: "",
    generated_totp_code: "",
    secret_key: currentSecretKey,
    e2e: true
  };
  fs.writeFileSync(envFilePath, JSON.stringify(env, null, 2), 'utf-8');
};