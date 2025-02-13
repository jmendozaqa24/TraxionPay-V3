import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  // Clear the screenshots directory before running tests
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (fs.existsSync(screenshotsDir)) {
    fs.readdirSync(screenshotsDir).forEach(file => {
      const filePath = path.join(screenshotsDir, file);
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });
  } else {
    fs.mkdirSync(screenshotsDir);
  }

  // Ensure screenshots are taken on failure
  config.projects.forEach(project => {
    project.use = {
      ...project.use,
      screenshot: 'only-on-failure',
    };
  });
}

export default globalSetup;