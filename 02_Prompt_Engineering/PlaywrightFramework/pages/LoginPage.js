const { test, expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByRole('textbox', { name: 'Email address' });
    this.password = page.getByPlaceholder('Enter password');
    this.togglePasswordVisibility = page.getByRole('button', { name: 'Toggle password visibility' });
    this.forgotPasswordButton = page.getByRole('button', { name: 'Forgot Password?' });
    this.rememberMeLabel = page.getByText('Remember me');
    this.rememberMeCheckbox = page.getByLabel('Remember me');
    this.signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
    this.freeTrialLink = page.getByRole('link', { name: 'Start a free trial' });
    this.errorNotification = page.getByText('Your email, password, IP address or location did not match');
  }

  async open() {
    await test.step('Open the login page', async () => {
      await this.page.goto('/#/login');
      await this.username.waitFor({ state: 'visible' });
    });
  }

  async measureFormReadyTime() {
    return test.step('Measure the time until the login form is ready', async () => {
      const start = Date.now();
      await this.page.goto('/#/login');
      await this.username.waitFor({ state: 'visible' });
      await this.password.waitFor({ state: 'visible' });
      await this.signInButton.waitFor({ state: 'visible' });
      return Date.now() - start;
    });
  }

  async enterUsername(value) {
    await test.step('Enter the email address', async () => {
      await this.username.fill(value);
    });
  }

  async enterPassword(value) {
    await test.step('Enter the password', async () => {
      await this.password.fill(value);
    });
  }

  async clickSignIn() {
    await test.step('Click Sign in', async () => {
      await this.signInButton.click();
    });
  }

  async toggleRememberMe() {
    await test.step('Toggle Remember me', async () => {
      await this.rememberMeLabel.click();
    });
  }

  async togglePassword() {
    await test.step('Toggle password visibility', async () => {
      await this.togglePasswordVisibility.click();
    });
  }

  async doLogin(user, pass) {
    await test.step('Log in with the given credentials', async () => {
      await this.username.fill(user);
      await this.password.fill(pass);
      await this.signInButton.click();
    });
  }

  async pressTabAndGetFocusedLabel() {
    await this.page.keyboard.press('Tab');
    return this.page.evaluate(() => {
      const element = document.activeElement;
      return element.getAttribute('placeholder') || element.getAttribute('aria-label') || element.textContent.trim();
    });
  }

  async expectOnLoginPage() {
    await test.step('Verify the user is still on the login page', async () => {
      await expect(this.page).toHaveURL(/#\/login/);
      await expect(this.username).toBeVisible();
      await expect(this.signInButton).toBeVisible();
    });
  }
}

module.exports = { LoginPage };
