package com.qa.salesforce.tests;

import com.qa.salesforce.base.BaseTest;
import com.qa.salesforce.pages.LoginPage;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

@Epic("Salesforce")
@Feature("Login - Invalid scenarios")
public class LoginInvalidTest extends BaseTest {

    @DataProvider(name = "invalidCredentials")
    public Object[][] invalidCredentials() {
        return new Object[][]{
                {"invalid.user@example.com", "WrongPass@123"},
                {"invalid.user@example.com", ""},
                {"", "WrongPass@123"},
                {"", ""},
                {"   ", "   "}
        };
    }

    @Test(dataProvider = "invalidCredentials", description = "Invalid credentials show an error")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify an error message is shown and the user stays on the login page for invalid input")
    public void verifyInvalidLoginShowsError(String user, String pass) {
        LoginPage loginPage = new LoginPage(driver).open().doLogin(user, pass);
        Assert.assertFalse(loginPage.getErrorMessage().isEmpty(), "No error message displayed");
        Assert.assertTrue(loginPage.isLoginButtonDisplayed(), "User left the login page");
    }

    @Test(description = "Wrong credentials error text")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Verify the error text for wrong username and password")
    public void verifyWrongCredentialsErrorText() {
        LoginPage loginPage = new LoginPage(driver).open().doLogin("invalid.user@example.com", "WrongPass@123");
        Assert.assertTrue(loginPage.getErrorMessage().contains("Please check your username and password"),
                "Unexpected error: " + loginPage.getErrorMessage());
    }

    @Test(description = "Password cleared after failed login")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify the password field is cleared after a failed login")
    public void verifyPasswordClearedAfterFailedLogin() {
        LoginPage loginPage = new LoginPage(driver).open().doLogin("invalid.user@example.com", "WrongPass@123");
        Assert.assertFalse(loginPage.getErrorMessage().isEmpty(), "No error message displayed");
        Assert.assertTrue(loginPage.getPasswordValue().isEmpty(), "Password field not cleared");
    }
}
