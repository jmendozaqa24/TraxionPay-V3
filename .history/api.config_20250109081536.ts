import {defineConfig} from '@playwright/test';

const config: defineConfig = {
    timeout: 6000,
    retries: 0,
    testDir: './Main',
    use:{
        headless: true,
        viewport:{width: 1920, height: 1080},
        actionTimeout: 10000,
        ignoreHTTPSErrors: true,
        video: 'off',
        screenshot: 'off',
    },
    
    projects    : [
        {
            name: 'chromium',
            use: { 
                browserName: 'chromium',
                launchOptions:{
                    slowMo:100,
                },
            },
        },
        {
            name: 'firefox',
            use: { 
                browserName: 'firefox',
                launchOptions:{
                    slowMo:100,
                },
            },
        },
        {
            name: 'Mobile',
            use: {
                browserName: 'webkit',
                viewport: { width: 375, height: 812 },
                launchOptions:{
                    slowMo:100,
                },
            },
        }
    
}

export default config;