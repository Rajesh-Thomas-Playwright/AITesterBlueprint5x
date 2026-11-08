package com.qa.salesforce.tests;

import com.qa.salesforce.base.BaseTest;
import com.qa.salesforce.pages.LoginPage;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("Salesforce")
@Feature("Login - Valid scenarios")
public class LoginValidTest extends BaseTest {

    @Test(priority = 1, description = "Login page loads with expected title")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Verify the login page opens and the page title contains Login")
    public void verifyLoginPageLoads() {
        LoginPage loginPage = new LoginPage(driver).open();
        Assert.assertTrue(loginPage.getPageTitle().contains("Login"), "Unexpected title: " + loginPage.getPageTitle());
    }

    @Test(priority = 2, description = "All login controls are displayed")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify username, password, Remember me and Log In controls are displayed")
    public void verifyLoginControlsDisplayed() {
        LoginPage loginPage = new LoginPage(driver).open();
        Assert.assertTrue(loginPage.isUsernameDisplayed(), "Username field not displayed");
        Assert.assertTrue(loginPage.isRememberMeDisplayed(), "Remember me checkbox not displayed");
        Assert.assertTrue(loginPage.isLoginButtonDisplayed(), "Log In button not displayed");
        Assert.assertTrue(loginPage.isLoginButtonEnabled(), "Log In button not enabled");
    }

    @Test(priority = 3, description = "Username field accepts input")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify the username field retains the entered value")
    public void verifyUsernameAcceptsInput() {
        String user = "tester@example.com";
        LoginPage loginPage = new LoginPage(driver).open().enterUsername(user);
        Assert.assertEquals(loginPage.getUsernameValue(), user);
    }

    @Test(priority = 4, description = "Password field masks input")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify the password field appears after a username is submitted, is masked and accepts input")
    public void verifyPasswordIsMasked() {
        LoginPage loginPage = new LoginPage(driver).open().submitUsername("tester@example.com");
        Assert.assertTrue(loginPage.isPasswordDisplayed(), "Password field not displayed after username submit");
        Assert.assertEquals(loginPage.getPasswordType(), "password");
        loginPage.enterPassword("Secret@123");
        Assert.assertEquals(loginPage.getPasswordValue(), "Secret@123");
    }

    @Test(priority = 5, description = "Remember me checkbox can be selected")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify Remember me is unchecked by default and becomes checked after selection")
    public void verifyRememberMeSelectable() {
        LoginPage loginPage = new LoginPage(driver).open();
        Assert.assertFalse(loginPage.isRememberMeSelected(), "Remember me selected by default");
        loginPage.selectRememberMe();
        Assert.assertTrue(loginPage.isRememberMeSelected(), "Remember me not selected after click");
    }
}
