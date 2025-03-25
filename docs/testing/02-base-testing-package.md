# Base Testing Package

The `@vernisai/testing` package serves as the foundation for all testing in our monorepo. It provides shared utilities, configurations, and helper functions to ensure consistent, high-quality tests across all packages.

## Package Structure

```
packages/testing/
├── src/
│   ├── config/       # Test configuration factories
│   ├── fixtures/     # Test data and fixtures
│   ├── mocks/        # Mock implementations
│   ├── utils/        # Testing utilities
│   └── index.ts      # Public API
├── package.json
└── tsconfig.json
```

## Installation

The testing package is available to all packages in the monorepo. To use it in a package:

```json
{
  "devDependencies": {
    "@vernisai/testing": "workspace:*"
  }
}
```

## Vitest Configuration

The testing package exports factory functions to create consistent Vitest configurations:

```typescript
// packages/package-name/vitest.config.ts
import { defineConfig } from "vitest/config";
import { createBaseVitestConfig } from "@vernisai/testing";

export default defineConfig(
  createBaseVitestConfig({
    // Package-specific overrides here
    testDir: "./tests",
  }),
);
```

### Base Configuration Features

The base Vitest configuration includes:

- TypeScript support with path aliasing
- Code coverage configuration
- Snapshot serializers
- Environment setup (jsdom/node)
- Global test setup and teardown
- Sensible defaults for timeouts and retries

## Mock Implementations

The testing package provides mock implementations for common services and dependencies:

```typescript
import { mockDatabase, mockAuth, mockApi } from "@vernisai/testing/mocks";

test("user service", async () => {
  // Use a consistent database mock across all tests
  const db = mockDatabase({
    users: [{ id: "1", name: "Test User" }],
  });

  const userService = createUserService(db);
  const user = await userService.getUser("1");

  expect(user.name).toBe("Test User");
});
```

Available mocks include:

- Database mocks (Drizzle)
- Authentication mocks
- API client mocks
- External service mocks
- Environment configuration mocks

## Test Fixtures

The package provides reusable test fixtures for common scenarios:

```typescript
import { fixtures } from "@vernisai/testing";

test("conversation flow", () => {
  const { users, conversations, messages } = fixtures.createChatScenario();

  // Test with consistent test data
});
```

Available fixtures include:

- User data
- Organization data
- Conversation scenarios
- Message threads
- Agent configurations

## Testing Utilities

The package includes utilities to simplify common testing tasks:

```typescript
import { waitFor, createWrapper, createEvent } from '@vernisai/testing/utils';

test('async component', async () => {
  const wrapper = createWrapper(<MyComponent />);

  // Wait for condition to be true
  await waitFor(() => wrapper.getByText('Loaded'));

  // Create a synthetic event
  const event = createEvent.click(wrapper.getByRole('button'));

  // ...rest of test
});
```

Utility categories include:

- Async testing helpers
- DOM testing utilities
- Event creation helpers
- Result assertions
- Test data generators

## Custom Matchers

The package extends Vitest's expect with custom matchers:

```typescript
import "@vernisai/testing/matchers";

test("custom matchers", () => {
  expect(response).toBeSuccessful();
  expect(component).toHaveAttribute("data-testid");
  expect(date).toBeWithinDaysOf(new Date(), 2);
});
```

## Type Definitions

The package provides TypeScript type definitions for testing:

```typescript
import { TestContext, MockOptions, Fixture } from "@vernisai/testing/types";

function createTest(context: TestContext) {
  // Type-safe test creation
}
```

## Best Practices

When using the testing package:

1. **Import only what you need** to keep tests fast and focused
2. **Extend rather than replace** configurations when possible
3. **Contribute common patterns** back to the testing package
4. **Keep package-specific test utilities** in their respective packages
5. **Ensure mock implementations** reflect the actual behavior of the system

## Maintenance

The testing package should evolve alongside the application. When adding new features or packages:

1. Consider if new test utilities would be beneficial
2. Add mock implementations for new services
3. Update fixtures to cover new scenarios
4. Enhance the test configuration as needed
