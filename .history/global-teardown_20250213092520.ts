import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // Any global teardown logic can go here
}

export default globalTeardown;