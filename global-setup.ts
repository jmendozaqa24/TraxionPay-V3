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
}

export default globalSetup;