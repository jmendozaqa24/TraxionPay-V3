// global-setup.ts
import { FullConfig } from '@playwright/test';

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
      const screenshot = await page.screenshot({ path: screenshotPath, fullPage: true });
      testInfo.attachments.push({
        name: 'Screenshot',
        path: screenshotPath,
        contentType: 'image/png',
      });
    }
  });
}

export default globalSetup;