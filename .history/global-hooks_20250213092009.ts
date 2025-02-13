import { test as base } from '@playwright/test';
import { allure } from 'allure-playwright';

const test = base.extend({
  page: async ({ page }, use) => {
    await use(page);

    // Add hooks to categorize tests based on their status
    test.afterEach(async ({}, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        allure.label('category', 'Failed');
      } else {
        allure.label('category', 'Passed');
      }
    });
  },
});

export { test };