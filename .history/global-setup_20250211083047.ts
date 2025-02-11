// global-setup.ts
import { FullConfig } from '@playwright/test';
import { allure } from 'allure-playwright';

async function globalSetup(config: FullConfig) {
  // Add a hook to take a screenshot on failure
  config.projects.forEach(project => {
    project.use = {
      ...project.use,
      screenshot: 'only-on-failure', // Ensure screenshots are taken on failure
    };
  });

  // Attach screenshots to Allure report
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      const screenshotPath = `screenshots/${testInfo.title}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      allure.attachment('Screenshot', await page.screenshot(), 'image/png');
    }
  });
}

export default globalSetup;