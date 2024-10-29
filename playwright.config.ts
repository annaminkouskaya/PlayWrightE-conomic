import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',
  globalSetup: path.resolve(__dirname, './auth/login.js'),
  
  use: {
    storageState: './auth/sf-session.json',  
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Enable trace collection for each test
    trace: 'on', // Options: 'on', 'off', 'retain-on-failure', 'on-first-retry'

    // Enable video recording
    video: 'on',  // Options: 'on', 'off', 'retain-on-failure', 'on-first-retry'

    // Enable screenshot on failure
    screenshot: 'only-on-failure',  // Options: 'on', 'off', 'only-on-failure'
  },

  //retries: 1,  // Retries for flaky tests
  reporter: [['list'], ['html', { open: 'on' }]],

  outputDir: 'test-results/',

  workers: 1,
  timeout: 60000,
});
