const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const invalidCredentials = [
  { name: 'wrong email and wrong password', user: 'invalid.user@example.com', pass: 'WrongPass@123' },
  { name: 'empty email with a password', user: '', pass: 'WrongPass@123' },
  { name: 'valid email format with empty password', user: 'invalid.user@example.com', pass: '' },
  { name: 'both fields empty', user: '', pass: '' },
  { name: 'malformed email format', user: 'not-an-email', pass: 'WrongPass@123' },
  { name: 'whitespace-only email and password', user: '   ', pass: '   ' },
];

test.describe('VWO Login - Invalid scenarios', () => {
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

  for (const data of invalidCredentials) {
    test(`[PRD: Error Recovery Flow > Error Identification] ${data.name} shows an error and stays on the login page`, async () => {
      try {
        await loginPage.doLogin(data.user, data.pass);
        await expect(loginPage.errorNotification).toBeVisible();
        await loginPage.expectOnLoginPage();
      } catch (error) {
        throw new Error(`Invalid login check failed for "${data.name}": ${error.message}`);
      }
    });
  }

  test('[PRD: User Input Validation > Error Handling] error message is shown for wrong credentials', async () => {
    try {
      await loginPage.doLogin('invalid.user@example.com', 'WrongPass@123');
      await expect(loginPage.errorNotification).toHaveText(/Your email, password, IP address or location did not match/);
    } catch (error) {
      throw new Error(`Error message check failed: ${error.message}`);
    }
  });

  test('[PRD: Error Recovery Flow > Recovery Options] Forgot Password option remains available after a failed login', async () => {
    try {
      await loginPage.doLogin('invalid.user@example.com', 'WrongPass@123');
      await expect(loginPage.errorNotification).toBeVisible();
      await expect(loginPage.forgotPasswordButton).toBeVisible();
      await expect(loginPage.forgotPasswordButton).toBeEnabled();
    } catch (error) {
      throw new Error(`Recovery option check failed: ${error.message}`);
    }
  });
});
