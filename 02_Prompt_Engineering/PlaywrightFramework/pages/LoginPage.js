const { expect } = require('@playwright/test');

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
    try {
      await this.page.goto('/#/login');
      await this.username.waitFor({ state: 'visible' });
    } catch (error) {
      throw new Error(`Unable to open the login page: ${error.message}`);
    }
  }

  async measureFormReadyTime() {
    try {
      const start = Date.now();
      await this.page.goto('/#/login');
      await this.username.waitFor({ state: 'visible' });
      await this.password.waitFor({ state: 'visible' });
      await this.signInButton.waitFor({ state: 'visible' });
      return Date.now() - start;
    } catch (error) {
      throw new Error(`Unable to measure login form ready time: ${error.message}`);
    }
  }

  async enterUsername(value) {
    try {
      await this.username.fill(value);
    } catch (error) {
      throw new Error(`Unable to enter email address: ${error.message}`);
    }
  }

  async enterPassword(value) {
    try {
      await this.password.fill(value);
    } catch (error) {
      throw new Error(`Unable to enter password: ${error.message}`);
    }
  }

  async clickSignIn() {
    try {
      await this.signInButton.click();
    } catch (error) {
      throw new Error(`Unable to click Sign in: ${error.message}`);
    }
  }

  async toggleRememberMe() {
    try {
      await this.rememberMeLabel.click();
    } catch (error) {
      throw new Error(`Unable to toggle Remember me: ${error.message}`);
    }
  }

  async togglePassword() {
    try {
      await this.togglePasswordVisibility.click();
    } catch (error) {
      throw new Error(`Unable to toggle password visibility: ${error.message}`);
    }
  }

  async doLogin(user, pass) {
    try {
      await this.enterUsername(user);
      await this.enterPassword(pass);
      await this.clickSignIn();
    } catch (error) {
      throw new Error(`Login action failed: ${error.message}`);
    }
  }

  async pressTabAndGetFocusedLabel() {
    try {
      await this.page.keyboard.press('Tab');
      return await this.page.evaluate(() => {
        const element = document.activeElement;
        return element.getAttribute('placeholder') || element.getAttribute('aria-label') || element.textContent.trim();
      });
    } catch (error) {
      throw new Error(`Unable to read keyboard focus: ${error.message}`);
    }
  }

  async expectOnLoginPage() {
    try {
      await expect(this.page).toHaveURL(/#\/login/);
      await expect(this.username).toBeVisible();
      await expect(this.signInButton).toBeVisible();
    } catch (error) {
      throw new Error(`User is not on the login page: ${error.message}`);
    }
  }
}

module.exports = { LoginPage };
