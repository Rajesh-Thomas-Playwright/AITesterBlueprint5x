package com.qa.salesforce.pages;

import io.qameta.allure.Step;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {

    private static final String LOGIN_URL = "https://login.salesforce.com/?locale=in";
    private static final Duration TIMEOUT = Duration.ofSeconds(20);

    private static final Duration SHORT_TIMEOUT = Duration.ofSeconds(8);
    private static final int MAX_OPEN_ATTEMPTS = 5;

    private final WebDriver driver;
    private final WebDriverWait wait;
    private final WebDriverWait shortWait;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement username;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement password;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMe;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, TIMEOUT);
        this.shortWait = new WebDriverWait(driver, SHORT_TIMEOUT);
        PageFactory.initElements(driver, this);
    }

    @Step("Open Salesforce login page")
    public LoginPage open() {
        for (int attempt = 1; attempt <= MAX_OPEN_ATTEMPTS; attempt++) {
            try {
                driver.get(LOGIN_URL);
                shortWait.until(ExpectedConditions.visibilityOf(username));
                return this;
            } catch (TimeoutException e) {
                driver.manage().deleteAllCookies();
            }
        }
        throw new IllegalStateException("Classic login page did not load after " + MAX_OPEN_ATTEMPTS + " attempts");
    }

    @Step("Enter username: {user}")
    public LoginPage enterUsername(String user) {
        try {
            wait.until(ExpectedConditions.visibilityOf(username)).clear();
            username.sendKeys(user);
            return this;
        } catch (TimeoutException | NoSuchElementException e) {
            throw new IllegalStateException("Username field is not available", e);
        }
    }

    @Step("Enter password")
    public LoginPage enterPassword(String pass) {
        try {
            wait.until(ExpectedConditions.visibilityOf(password)).clear();
            password.sendKeys(pass);
            return this;
        } catch (TimeoutException | NoSuchElementException e) {
            throw new IllegalStateException("Password field is not available", e);
        }
    }

    @Step("Select Remember me checkbox")
    public LoginPage selectRememberMe() {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(rememberMe));
            if (!rememberMe.isSelected()) {
                rememberMe.click();
            }
            return this;
        } catch (TimeoutException | NoSuchElementException e) {
            throw new IllegalStateException("Remember me checkbox is not available", e);
        }
    }

    @Step("Click Log In button")
    public LoginPage clickLogin() {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
            return this;
        } catch (TimeoutException | NoSuchElementException e) {
            throw new IllegalStateException("Log In button is not clickable", e);
        }
    }

    @Step("Submit username: {user}")
    public LoginPage submitUsername(String user) {
        enterUsername(user).clickLogin();
        try {
            wait.until(ExpectedConditions.or(
                    ExpectedConditions.visibilityOf(password),
                    ExpectedConditions.visibilityOf(errorMessage)));
            return this;
        } catch (TimeoutException e) {
            throw new IllegalStateException("Neither password field nor error appeared after submitting username", e);
        }
    }

    @Step("Login with username and password")
    public LoginPage doLogin(String user, String pass) {
        submitUsername(user);
        if (isDisplayed(password)) {
            enterPassword(pass).clickLogin();
        }
        return this;
    }

    public boolean isUsernameDisplayed() {
        return isDisplayed(username);
    }

    public boolean isPasswordDisplayed() {
        return isDisplayed(password);
    }

    public boolean isLoginButtonDisplayed() {
        return isDisplayed(loginButton);
    }

    public boolean isLoginButtonEnabled() {
        return loginButton.isEnabled();
    }

    public boolean isRememberMeDisplayed() {
        return isDisplayed(rememberMe);
    }

    public boolean isRememberMeSelected() {
        return rememberMe.isSelected();
    }

    public String getUsernameValue() {
        return username.getAttribute("value");
    }

    public String getPasswordValue() {
        return password.getAttribute("value");
    }

    public String getPasswordType() {
        return password.getAttribute("type");
    }

    public String getPageTitle() {
        return driver.getTitle();
    }

    public String getErrorMessage() {
        try {
            return wait.until(ExpectedConditions.visibilityOf(errorMessage)).getText().trim();
        } catch (TimeoutException e) {
            return "";
        }
    }

    private boolean isDisplayed(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }
}
