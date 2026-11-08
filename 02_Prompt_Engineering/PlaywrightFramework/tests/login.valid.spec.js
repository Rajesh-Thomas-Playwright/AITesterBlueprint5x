const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const PAGE_LOAD_THRESHOLD_MS = Number(process.env.PAGE_LOAD_THRESHOLD_MS || 2000);

test.describe('VWO Login - Valid scenarios', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('failure-url', { body: page.url(), contentType: 'text/plain' });
    }
  });

  test('[PRD: Current State Analysis > Existing Features] login page loads with expected title', async ({ page }) => {
    await expect(page).toHaveTitle(/Login/);
    await expect(page).toHaveURL(/#\/login/);
  });

  test('[PRD: Authentication System > Login Process] email, password, Remember me and Sign in controls are visible', async () => {
    await expect(loginPage.username).toBeVisible();
    await expect(loginPage.password).toBeVisible();
    await expect(loginPage.rememberMeLabel).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
    await expect(loginPage.signInButton).toBeEnabled();
  });

  test('[PRD: Password Management > Forgot Password Flow] Forgot Password option is visible', async () => {
    await expect(loginPage.forgotPasswordButton).toBeVisible();
    await expect(loginPage.forgotPasswordButton).toBeEnabled();
  });

  test('[PRD: Current State Analysis > Account Registration Link] free trial signup link is visible', async () => {
    await expect(loginPage.freeTrialLink).toBeVisible();
    await expect(loginPage.freeTrialLink).toHaveAttribute('href', /free-trial/);
  });

  test('[PRD: Authentication System > Login Process] email and password fields accept input', async () => {
    await loginPage.enterUsername('qa.tester@example.com');
    await loginPage.enterPassword('Sample@123');
    await expect(loginPage.username).toHaveValue('qa.tester@example.com');
    await expect(loginPage.password).toHaveValue('Sample@123');
  });

  test('[PRD: Technical Requirements > Security Specifications] password is masked and visibility can be toggled', async () => {
    await loginPage.enterPassword('Sample@123');
    await expect(loginPage.password).toHaveAttribute('type', 'password');
    await loginPage.togglePassword();
    await expect(loginPage.password).toHaveAttribute('type', 'text');
    await loginPage.togglePassword();
    await expect(loginPage.password).toHaveAttribute('type', 'password');
  });

  test('[PRD: Current State Analysis > Remember Me Functionality] Remember me can be toggled', async () => {
    await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
    await loginPage.toggleRememberMe();
    await expect(loginPage.rememberMeCheckbox).toBeChecked();
    await loginPage.toggleRememberMe();
    await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
  });

  test('[PRD: User Experience Features > Auto-focus] email field is focused automatically', async () => {
    await expect(loginPage.username).toBeFocused();
  });

  test('[PRD: Accessibility Features > Keyboard Navigation] Tab moves focus through the form in order', async () => {
    await expect(loginPage.username).toBeFocused();
    expect(await loginPage.pressTabAndGetFocusedLabel()).toBe('Enter password');
    expect(await loginPage.pressTabAndGetFocusedLabel()).toBe('Toggle password visibility');
    expect(await loginPage.pressTabAndGetFocusedLabel()).toBe('Forgot Password?');
    expect(await loginPage.pressTabAndGetFocusedLabel()).toBe('Sign in');
  });

  test(`[PRD: Performance Requirements > Page Load Speed] login form is ready within ${PAGE_LOAD_THRESHOLD_MS} ms`, async ({ browser }) => {
    const context = await browser.newContext();
    try {
      const freshLoginPage = new LoginPage(await context.newPage());
      const elapsed = await freshLoginPage.measureFormReadyTime();
      expect(elapsed, `Login form took ${elapsed} ms against a ${PAGE_LOAD_THRESHOLD_MS} ms threshold`).toBeLessThanOrEqual(PAGE_LOAD_THRESHOLD_MS);
    } finally {
      await context.close();
    }
  });
});
