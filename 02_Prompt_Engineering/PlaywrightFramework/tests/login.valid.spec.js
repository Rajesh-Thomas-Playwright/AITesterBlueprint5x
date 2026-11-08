const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const PAGE_LOAD_THRESHOLD_MS = Number(process.env.PAGE_LOAD_THRESHOLD_MS || 2000);

test.describe('VWO Login - Valid scenarios', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    try {
      loginPage = new LoginPage(page);
      await loginPage.open();
    } catch (error) {
      throw new Error(`Setup failed: ${error.message}`);
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    try {
      if (testInfo.status !== testInfo.expectedStatus) {
        await testInfo.attach('failure-url', { body: page.url(), contentType: 'text/plain' });
      }
    } catch (error) {
      throw new Error(`Teardown failed: ${error.message}`);
    }
  });

  test('[PRD: Current State Analysis > Existing Features] login page loads with expected title', async ({ page }) => {
    try {
      await expect(page).toHaveTitle(/Login/);
      await expect(page).toHaveURL(/#\/login/);
    } catch (error) {
      throw new Error(`Login page load verification failed: ${error.message}`);
    }
  });

  test('[PRD: Authentication System > Login Process] email, password, Remember me and Sign in controls are visible', async () => {
    try {
      await expect(loginPage.username).toBeVisible();
      await expect(loginPage.password).toBeVisible();
      await expect(loginPage.rememberMeLabel).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
      await expect(loginPage.signInButton).toBeEnabled();
    } catch (error) {
      throw new Error(`Login controls visibility check failed: ${error.message}`);
    }
  });

  test('[PRD: Password Management > Forgot Password Flow] Forgot Password option is visible', async () => {
    try {
      await expect(loginPage.forgotPasswordButton).toBeVisible();
      await expect(loginPage.forgotPasswordButton).toBeEnabled();
    } catch (error) {
      throw new Error(`Forgot Password visibility check failed: ${error.message}`);
    }
  });

  test('[PRD: Current State Analysis > Account Registration Link] free trial signup link is visible', async () => {
    try {
      await expect(loginPage.freeTrialLink).toBeVisible();
      await expect(loginPage.freeTrialLink).toHaveAttribute('href', /free-trial/);
    } catch (error) {
      throw new Error(`Free trial link check failed: ${error.message}`);
    }
  });

  test('[PRD: Authentication System > Login Process] email and password fields accept input', async () => {
    try {
      await loginPage.enterUsername('qa.tester@example.com');
      await loginPage.enterPassword('Sample@123');
      await expect(loginPage.username).toHaveValue('qa.tester@example.com');
      await expect(loginPage.password).toHaveValue('Sample@123');
    } catch (error) {
      throw new Error(`Field input check failed: ${error.message}`);
    }
  });

  test('[PRD: Technical Requirements > Security Specifications] password is masked and visibility can be toggled', async () => {
    try {
      await loginPage.enterPassword('Sample@123');
      await expect(loginPage.password).toHaveAttribute('type', 'password');
      await loginPage.togglePassword();
      await expect(loginPage.password).toHaveAttribute('type', 'text');
      await loginPage.togglePassword();
      await expect(loginPage.password).toHaveAttribute('type', 'password');
    } catch (error) {
      throw new Error(`Password masking check failed: ${error.message}`);
    }
  });

  test('[PRD: Current State Analysis > Remember Me Functionality] Remember me can be toggled', async () => {
    try {
      await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
      await loginPage.toggleRememberMe();
      await expect(loginPage.rememberMeCheckbox).toBeChecked();
      await loginPage.toggleRememberMe();
      await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
    } catch (error) {
      throw new Error(`Remember me toggle check failed: ${error.message}`);
    }
  });

  test('[PRD: User Experience Features > Auto-focus] email field is focused automatically', async () => {
    try {
      await expect(loginPage.username).toBeFocused();
    } catch (error) {
      throw new Error(`Auto-focus check failed: ${error.message}`);
    }
  });

  test('[PRD: Accessibility Features > Keyboard Navigation] Tab moves focus through the form in order', async () => {
    try {
      await expect(loginPage.username).toBeFocused();
      expect(await loginPage.pressTabAndGetFocusedLabel()).toBe('Enter password');
      expect(await loginPage.pressTabAndGetFocusedLabel()).toBe('Toggle password visibility');
      expect(await loginPage.pressTabAndGetFocusedLabel()).toBe('Forgot Password?');
      expect(await loginPage.pressTabAndGetFocusedLabel()).toBe('Sign in');
    } catch (error) {
      throw new Error(`Keyboard navigation check failed: ${error.message}`);
    }
  });

  test(`[PRD: Performance Requirements > Page Load Speed] login form is ready within ${PAGE_LOAD_THRESHOLD_MS} ms`, async ({ browser }) => {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      const freshLoginPage = new LoginPage(page);
      const elapsed = await freshLoginPage.measureFormReadyTime();
      expect(elapsed, `Login form took ${elapsed} ms against a ${PAGE_LOAD_THRESHOLD_MS} ms threshold`).toBeLessThanOrEqual(PAGE_LOAD_THRESHOLD_MS);
    } catch (error) {
      throw new Error(`Page load time check failed: ${error.message}`);
    } finally {
      await context.close();
    }
  });
});
