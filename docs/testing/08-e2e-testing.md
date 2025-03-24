# End-to-End Testing with Playwright

This document provides specific guidelines and best practices for end-to-end testing of the VernisAI Chat application using Playwright.

## Overview

End-to-end (E2E) testing verifies that the entire application works correctly from the user's perspective, testing all system components together. Playwright is our tool of choice for E2E testing because of its cross-browser support, powerful selectors, and reliability.

## Test Structure

E2E tests should be organized in the following structure:

```
e2e/
├── config/
│   └── playwright.config.ts
├── fixtures/
│   ├── auth.fixture.ts
│   └── data.fixture.ts
├── models/
│   ├── conversation.model.ts
│   └── user.model.ts
├── pages/
│   ├── chat.page.ts
│   ├── login.page.ts
│   └── settings.page.ts
├── specs/
│   ├── authentication.spec.ts
│   ├── chat.spec.ts
│   └── settings.spec.ts
└── utils/
    ├── api-helpers.ts
    └── test-helpers.ts
```

## Setting Up Playwright

### Installation and Configuration

```typescript
// e2e/config/playwright.config.ts
import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "../specs",
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["html"],
    ["list"],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
};

export default config;
```

### Page Object Model (POM)

Use the Page Object Model to encapsulate page functionality and make tests more maintainable:

```typescript
// e2e/pages/login.page.ts
import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[data-testid="login-error"]');
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async waitForError() {
    await this.errorMessage.waitFor({ state: "visible" });
    return this.errorMessage.textContent();
  }
}
```

## Writing E2E Tests

### Basic Test Structure

```typescript
// e2e/specs/authentication.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { HomePage } from "../pages/home.page";

test.describe("Authentication", () => {
  test("should login with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");

    // Wait for redirect to home page
    await expect(page).toHaveURL("/");

    // Verify user is logged in
    await expect(homePage.userMenu).toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("test@example.com", "wrongpassword");

    // Verify error message
    const errorMessage = await loginPage.waitForError();
    expect(errorMessage).toContain("Invalid email or password");
  });

  test("should redirect to login page for protected routes", async ({
    page,
  }) => {
    // Try to access a protected route directly
    await page.goto("/settings");

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});
```

### Testing Chat Functionality

```typescript
// e2e/specs/chat.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { ChatPage } from "../pages/chat.page";
import { seedConversation } from "../fixtures/data.fixture";

test.describe("Chat Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");

    // Wait for redirect to home page
    await expect(page).toHaveURL("/");
  });

  test("should create a new conversation", async ({ page }) => {
    const chatPage = new ChatPage(page);

    await chatPage.goto();
    await chatPage.newConversationButton.click();

    // Check that a new conversation is created
    await expect(chatPage.messageInput).toBeEnabled();

    // Send a message
    await chatPage.sendMessage("Hello, AI assistant!");

    // Verify the message appears in the conversation
    await expect(
      chatPage.getMessageByContent("Hello, AI assistant!"),
    ).toBeVisible();

    // Wait for the AI to respond
    await expect(chatPage.getLastAssistantMessage()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should load existing conversations", async ({ page, request }) => {
    // Create test data through API
    const conversationId = await seedConversation(request, {
      title: "Test Conversation",
      messages: [
        { role: "user", content: "What is AI?" },
        {
          role: "assistant",
          content: "AI stands for Artificial Intelligence...",
        },
      ],
    });

    const chatPage = new ChatPage(page);
    await chatPage.goto();

    // Find and click on the seeded conversation
    await chatPage.selectConversation("Test Conversation");

    // Verify messages are loaded
    await expect(chatPage.getMessageByContent("What is AI?")).toBeVisible();
    await expect(
      chatPage.getMessageByContent("AI stands for Artificial Intelligence..."),
    ).toBeVisible();
  });
});
```

### Testing Responsive Behavior

```typescript
// e2e/specs/responsive.spec.ts
import { test, expect } from "@playwright/test";
import { ChatPage } from "../pages/chat.page";
import { LoginPage } from "../pages/login.page";

test.describe("Responsive Behavior", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");
  });

  test("should show sidebar on desktop", async ({ page }) => {
    // Use desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    const chatPage = new ChatPage(page);
    await chatPage.goto();

    // Sidebar should be visible
    await expect(chatPage.sidebar).toBeVisible();
  });

  test("should hide sidebar on mobile", async ({ page }) => {
    // Use mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const chatPage = new ChatPage(page);
    await chatPage.goto();

    // Sidebar should be hidden
    await expect(chatPage.sidebar).toBeHidden();

    // Click menu button to show sidebar
    await chatPage.menuButton.click();

    // Sidebar should now be visible
    await expect(chatPage.sidebar).toBeVisible();
  });
});
```

## Test Fixtures

Fixtures help with test setup and provide consistent test data:

```typescript
// e2e/fixtures/auth.fixture.ts
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

type AuthFixture = {
  loggedInPage: Page;
};

export const test = base.extend<AuthFixture>({
  loggedInPage: async ({ page }, use) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");

    // Wait for redirect to home page
    await page.waitForURL("/");

    // Use the authenticated page
    await use(page);
  },
});
```

Using the auth fixture:

```typescript
// e2e/specs/settings.spec.ts
import { test } from "../fixtures/auth.fixture";
import { expect } from "@playwright/test";
import { SettingsPage } from "../pages/settings.page";

test.describe("Settings", () => {
  test("should update user profile", async ({ loggedInPage }) => {
    const settingsPage = new SettingsPage(loggedInPage);

    await settingsPage.goto();
    await settingsPage.displayNameInput.fill("New Name");
    await settingsPage.saveButton.click();

    // Wait for success message
    await expect(settingsPage.successMessage).toBeVisible();

    // Reload and verify changes persisted
    await settingsPage.goto();
    await expect(settingsPage.displayNameInput).toHaveValue("New Name");
  });
});
```

## API Test Helpers

Create API helpers to set up test data:

```typescript
// e2e/utils/api-helpers.ts
import { APIRequestContext } from "@playwright/test";

export async function createUser(request: APIRequestContext, userData: any) {
  const response = await request.post("/api/users", {
    data: userData,
  });

  return await response.json();
}

export async function generateAuthToken(
  request: APIRequestContext,
  email: string,
  password: string,
) {
  const response = await request.post("/api/auth/token", {
    data: { email, password },
  });

  const data = await response.json();
  return data.token;
}

export async function cleanupTestData(
  request: APIRequestContext,
  userId: string,
) {
  await request.delete(`/api/users/${userId}`);
}
```

## Testing Strategies

### Visual Testing

Visual testing ensures the UI looks correct:

```typescript
// e2e/specs/visual.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test.describe("Visual Testing", () => {
  test("login page matches snapshot", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // Compare the screenshot with a reference
    await expect(page).toHaveScreenshot("login-page.png");
  });

  test("dark mode looks correct", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // Enable dark mode
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
      window.location.reload();
    });

    await page.waitForLoadState("networkidle");

    // Compare the screenshot with a reference
    await expect(page).toHaveScreenshot("login-page-dark.png");
  });
});
```

### Accessibility Testing

```typescript
// e2e/specs/accessibility.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { LoginPage } from "../pages/login.page";

test.describe("Accessibility", () => {
  test("login page should not have accessibility violations", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### Performance Testing

```typescript
// e2e/specs/performance.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { ChatPage } from "../pages/chat.page";

test.describe("Performance", () => {
  test("page load time should be acceptable", async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);

    // Define an acceptable threshold
    expect(loadTime).toBeLessThan(3000);
  });

  test("message sending should be responsive", async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");

    const chatPage = new ChatPage(page);
    await chatPage.goto();

    // Measure message sending time
    const startTime = Date.now();

    await chatPage.sendMessage("Hello");

    // Wait for the message to appear
    await chatPage.getMessageByContent("Hello").waitFor();

    const sendTime = Date.now() - startTime;
    console.log(`Message send time: ${sendTime}ms`);

    // Define an acceptable threshold
    expect(sendTime).toBeLessThan(1000);
  });
});
```

## Best Practices

1. **Use the Page Object Model**: Encapsulate page interactions in page classes.
2. **Isolate tests**: Each test should be independent and not rely on other tests.
3. **Use descriptive test names**: Test names should clearly describe what they're testing.
4. **Target stable selectors**: Use data-testid, roles, or labels rather than CSS classes or XPaths.
5. **Avoid sleeps**: Use waitFor methods instead of arbitrary sleeps.
6. **Clean up test data**: Remove any data created during tests.
7. **Test across browsers**: Run tests on multiple browsers to ensure compatibility.
8. **Test responsive behavior**: Verify that the application works on different screen sizes.
9. **Keep tests focused**: Each test should verify one specific aspect of behavior.
10. **Make tests deterministic**: Tests should give the same result every time they're run.

## Common Pitfalls

1. **Flaky tests**: Tests that sometimes pass and sometimes fail can be hard to debug.
2. **Slow tests**: E2E tests can be slow, so optimize them where possible.
3. **Over-testing**: Don't test the same functionality in multiple ways.
4. **Brittle selectors**: Using CSS classes or XPaths can make tests brittle.
5. **Not running headless in CI**: Always run tests headless in CI environments.
6. **Ignoring accessibility**: Ensure your application is accessible to all users.

## Debugging Tips

1. **Use the Playwright Inspector**: The inspector helps debug test failures.
2. **Save screenshots and videos**: Capture visual evidence on test failures.
3. **Check the console logs**: Capture browser console logs for JavaScript errors.
4. **Use trace viewer**: Playwright trace viewer provides detailed insights into test runs.
5. **Run specific tests**: Use test.only to run just the tests you're working on.

## Continuous Integration

Configure Playwright to run in CI/CD pipelines:

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Build the application
        run: npm run build
      - name: Start the application
        run: npm run start &
      - name: Run Playwright tests
        run: npx playwright test
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Mobile Testing

For testing on mobile devices:

```typescript
// e2e/specs/mobile.spec.ts
import { test, devices, expect } from "@playwright/test";
import { ChatPage } from "../pages/chat.page";
import { LoginPage } from "../pages/login.page";

// Use iPhone 12 device settings
test.use({ ...devices["iPhone 12"] });

test.describe("Mobile Experience", () => {
  test("should adapt UI for mobile", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");

    const chatPage = new ChatPage(page);
    await chatPage.goto();

    // Verify mobile-specific elements
    await expect(chatPage.menuButton).toBeVisible();
    await expect(chatPage.sidebar).toBeHidden();

    // Test mobile navigation
    await chatPage.menuButton.click();
    await expect(chatPage.sidebar).toBeVisible();
  });

  test("should handle touch interactions", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");

    const chatPage = new ChatPage(page);
    await chatPage.goto();

    // Test swipe to reveal sidebar
    await page.touchscreen.tap(50, 300);
    await page.touchscreen.tap(150, 300);

    // Verify sidebar appears
    await expect(chatPage.sidebar).toBeVisible();
  });
});
```

## Summary

End-to-end testing with Playwright provides confidence that the application works correctly from the user's perspective. By following these guidelines and best practices, you can create robust, maintainable E2E tests that help ensure a high-quality user experience.
