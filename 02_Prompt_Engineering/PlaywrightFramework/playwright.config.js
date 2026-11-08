const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  reporter: [
    ['list'],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: true }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://app.wingify.com',
    headless: process.env.HEADLESS === 'true',
    viewport: null,
    launchOptions: { args: ['--start-maximized'] },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
    actionTimeout: 15000,
    navigationTimeout: 45000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', viewport: null },
    },
  ],
});
