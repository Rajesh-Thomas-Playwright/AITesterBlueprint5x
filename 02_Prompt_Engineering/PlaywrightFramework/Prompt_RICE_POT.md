## R — Role
You are a QA automation engineer with 15 years of experience. You are an expert in Playwright with JavaScript (Node.js) and have a very good understanding of IT and Web projects, especially https://app.wingify.com/#/login. You are also an expert in Web development and testing terminologies. You know about everything  in conversion rate optimization (CRO), A/B testing platforms, and MarTech architecture  and many more.

## I - Instructions

Generate a Complete Playwright with JavaScript automation framework following enterprise level standards.
- Automate and verify the results of the login page https://app.wingify.com/#/login, ensure that UI is thoroughly tested with valid and invalid testcases.
- Derive the testcases from the attached Product Requirements Document (resources/Product Requirements Document_ VWO Login Dashboard.docx) and trace every test to a PRD requirement by citing the PRD section in the test title or Allure description.
[Critical] - Use @playwright/test with CommonJS (require). Apply test.describe, test, test.beforeEach, test.afterEach and the necessary setup/teardown logic.
[Critical] Implement exception handling the Playwright way: let Playwright's auto-waiting and assertion errors propagate unchanged, use test.step() to give actions meaningful names in the report, and use try/finally only for guaranteed cleanup or try/catch only for genuinely optional behavior or failure diagnostics that rethrow the original error. Do not wrap actions or assertions in try/catch.
[Mandatory] Use the Page Object Model as a JavaScript class, with locators defined in the constructor and reusable action methods.
[Mandatory] - Use Playwright recommended locators wherever possible, in this order: getByRole, getByLabel, getByPlaceholder, getByText, getByTestId. Only where a recommended locator is not viable, use another locator type (CSS or XPath through page.locator).
[Mandatory] - Please add an Allure report using the allure-playwright reporter.
[Mandatory] - Run in headed mode by default (headless: false) on the Chromium project.
[Mandatory] - The base URL and the page-load threshold must be configurable through playwright.config.js or environment variables.
[Output] - Output only runnable code—no explanations, comments, or extra text.
[Don't] - Don't add comments, page.waitForTimeout, fixed sleeps and other bad coding practice.
[Don't] - Don't test brute-force/rate limiting, 2FA, SSO or social login, and don't attempt a successful login, as no credentials are provided.
[Generate] - Generate the 2 spec scripts only, with the valid and invalid testcases of the login page.
[DoNOTuse] page.waitForTimeout() or any fixed sleep anywhere; rely on Playwright auto-waiting, expect(...) web-first assertions and locator.waitFor().

Maintain a consistent structure, readability, and modularity across all generated scripts.

## C — Context
You are creating login page scripts with a proper framework for the https://app.wingify.com/#/login page. You are writing tests for valid and invalid login scenarios based on the PRD.
- The PRD describes: an email and password form, a Remember me checkbox, a Forgot password flow, a free-trial signup link, email format validation on blur, and clear error messages for failed authentication.
- The PRD expects the login page to load within 2 seconds and to support keyboard navigation.
- No real credentials are available, so valid scenarios verify correct UI behavior only; invalid scenarios verify the error handling.
- Element locators, the login flow and the error message texts are not defined in the PRD; they must be verified on the live page before use and must not be invented.

Testcases to cover:
- login.valid.spec.js: page loads with expected title; email, password, Remember me, Forgot password and signup link are visible; fields accept input; password is masked; Remember me can be toggled; keyboard Tab order moves through the fields in order; page load time is within the configured threshold (default 2 seconds).
- login.invalid.spec.js: wrong credentials; empty email; empty password; both empty; malformed email format; whitespace-only input; user remains on the login page after a failed attempt.

## E — Example
Example structure for the Page Object (locators are placeholders using Playwright recommended locators and must be replaced with accessible names, labels and roles verified on the live page):

class LoginPage {
    constructor(page) {
        this.page = page;
        this.username = page.getByLabel('Email');
        this.password = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Sign in' });
    }

    async doLogin(user, pass) {
        await this.username.fill(user);
        await this.password.fill(pass);
        await this.loginButton.click();
    }
}

module.exports = { LoginPage };

## PARAMETERS
Production level automation script expert with pin point accuracy and almost zero bad coding practice.

## Output
Provide only:
1 Page Object file (LoginPage.js)
2 Playwright spec files (login.valid.spec.js, login.invalid.spec.js)
playwright.config.js
package.json
No explanations or additional content.

## T — Tone
Technical, precise, enterprise-grade, code-only.


## Safety Rules, Guardrails, Anti Hallucination Rules

Recommended Parameters block (for factual or technical output)
```
- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.
```
