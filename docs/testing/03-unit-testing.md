# Unit Testing

This document provides guidelines and best practices for writing unit tests across all packages in the VernisAI Chat monorepo.

## What to Unit Test

Unit tests should focus on:

1. **Individual functions and methods**: Testing the smallest units of code
2. **React components**: Testing component rendering and behavior
3. **Utility functions**: Testing helper functions and utilities
4. **Business logic**: Testing the core logic of the application

## Test Structure

### Directory Structure

Unit tests should be located in a `tests/unit` directory within each package:

```
packages/package-name/
├── src/
│   ├── module/
│   │   ├── component.tsx
│   │   └── utils.ts
└── tests/
    └── unit/
        ├── module/
        │   ├── component.test.ts
        │   └── utils.test.ts
```

### Test File Naming

- Test files should use the same name as the file being tested with `.test.ts` or `.test.tsx` appended
- For TypeScript files, use `.test.ts`
- For React components, use `.test.tsx`

### Test Structure

Each test file should follow this structure:

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { functionUnderTest } from "../../src/path/to/file";

describe("Module or Component Name", () => {
  // Setup code if needed
  beforeEach(() => {
    // Setup for each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe("functionUnderTest", () => {
    it("should handle the happy path", () => {
      // Arrange
      const input = "test";

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe("expected value");
    });

    it("should handle edge cases", () => {
      // Arrange
      const input = "";

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe("default value");
    });

    it("should throw for invalid input", () => {
      // Arrange
      const input = null;

      // Act & Assert
      expect(() => functionUnderTest(input)).toThrow();
    });
  });
});
```

## Testing Pure Functions

For pure functions, focus on testing:

1. Expected outputs for various inputs
2. Edge cases (empty arrays, null values, etc.)
3. Error handling

Example:

```typescript
// src/utils/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// tests/unit/utils/math.test.ts
import { describe, it, expect } from "vitest";
import { add } from "../../../src/utils/math";

describe("math utilities", () => {
  describe("add", () => {
    it("should add two positive numbers", () => {
      expect(add(1, 2)).toBe(3);
    });

    it("should handle negative numbers", () => {
      expect(add(-1, -2)).toBe(-3);
      expect(add(-1, 2)).toBe(1);
    });

    it("should handle zero", () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
      expect(add(0, 0)).toBe(0);
    });
  });
});
```

## Testing React Components

When testing React components, focus on:

1. Component rendering
2. User interactions
3. State changes
4. Props handling
5. Conditional rendering

Use React Testing Library from the base testing package:

```typescript
// tests/unit/components/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@vernisai/testing/react';
import { Button } from '../../../src/components/Button';

describe('Button component', () => {
  it('should render with the correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Mocking Dependencies

Use the mocking utilities from the base testing package:

```typescript
import { describe, it, expect, vi } from "vitest";
import { mockDatabase } from "@vernisai/testing/mocks";
import { UserService } from "../../../src/services/UserService";

describe("UserService", () => {
  it("should get user by id", async () => {
    // Arrange
    const mockDb = mockDatabase({
      users: [{ id: "1", name: "Test User" }],
    });
    const userService = new UserService(mockDb);

    // Act
    const user = await userService.getUser("1");

    // Assert
    expect(user).toEqual({ id: "1", name: "Test User" });
  });

  it("should throw when user not found", async () => {
    // Arrange
    const mockDb = mockDatabase({
      users: [],
    });
    const userService = new UserService(mockDb);

    // Act & Assert
    await expect(userService.getUser("1")).rejects.toThrow("User not found");
  });
});
```

## API Client Testing

When testing API clients, use Mock Service Worker (MSW) from the base testing package:

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { ApiClient } from "../../../src/clients/ApiClient";

describe("ApiClient", () => {
  const server = setupServer(
    rest.get("https://api.example.com/users/1", (req, res, ctx) => {
      return res(ctx.json({ id: "1", name: "Test User" }));
    }),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should fetch user data", async () => {
    const client = new ApiClient();
    const user = await client.getUser("1");

    expect(user).toEqual({ id: "1", name: "Test User" });
  });

  it("should handle API errors", async () => {
    server.use(
      rest.get("https://api.example.com/users/1", (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    const client = new ApiClient();

    await expect(client.getUser("1")).rejects.toThrow();
  });
});
```

## Testing Hooks

For testing React hooks, use the `renderHook` utility:

```typescript
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@vernisai/testing/react";
import { useCounter } from "../../../src/hooks/useCounter";

describe("useCounter", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it("should initialize with provided value", () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);
  });

  it("should increment the counter", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should decrement the counter", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });
});
```

## Testing Asynchronous Code

For asynchronous code, use async/await syntax:

```typescript
import { describe, it, expect } from "vitest";
import { fetchData } from "../../../src/utils/api";
import { mockFetch } from "@vernisai/testing/mocks";

describe("fetchData", () => {
  it("should resolve with data on successful fetch", async () => {
    mockFetch({
      status: 200,
      json: { data: "test data" },
    });

    const result = await fetchData("/api/data");

    expect(result).toEqual({ data: "test data" });
  });

  it("should reject on fetch error", async () => {
    mockFetch({
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchData("/api/data")).rejects.toThrow(
      "Internal Server Error",
    );
  });
});
```

## Code Coverage

We aim for high code coverage, but quality tests are more important than hitting coverage targets. As a guideline:

- **Minimum Coverage**: 80% for all packages
- **Target Coverage**: 90% for critical packages (API, database)

To check coverage, run:

```bash
npm run test -- --coverage
```

## Best Practices

1. **Isolate tests**: Each test should be independent of others
2. **Test behavior, not implementation**: Focus on what the code does, not how it does it
3. **Keep tests simple**: Each test should verify one aspect of behavior
4. **Use meaningful assertions**: Assert exactly what you're testing
5. **Descriptive test names**: Test names should describe the expected behavior
6. **Avoid test duplication**: Use parameterized tests for similar test cases
7. **Mock external dependencies**: Don't rely on external services for unit tests
8. **Clean up after tests**: Reset any global state or mocks after each test

## Common Pitfalls

1. **Testing implementation details**: Avoid testing internal mechanics that could change
2. **Brittle tests**: Don't rely on specific ordering or timing
3. **Incomplete assertions**: Be sure to check all relevant aspects of the result
4. **Over-mocking**: Only mock what's necessary for isolation
5. **Slow tests**: Unit tests should be fast; move slow tests to integration suite

## Example Test

A complete example showing good practices:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@vernisai/testing/react';
import { UserList } from '../../../src/components/UserList';
import { mockApiClient } from '@vernisai/testing/mocks';

describe('UserList component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should render a list of users when data is loaded', async () => {
    // Arrange
    const users = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ];

    mockApiClient.getUsers.mockResolvedValue(users);

    // Act
    render(<UserList />);

    // Assert - check loading state first
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check that users are rendered
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should show error message when API fails', async () => {
    // Arrange
    mockApiClient.getUsers.mockRejectedValue(new Error('Failed to fetch'));

    // Act
    render(<UserList />);

    // Wait for error to be shown
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });
  });

  it('should reload data when refresh button is clicked', async () => {
    // Arrange
    const users = [{ id: '1', name: 'Alice' }];
    mockApiClient.getUsers.mockResolvedValueOnce(users);

    // Act - initial render
    render(<UserList />);

    // Wait for initial data
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    // Setup mock for second call
    const updatedUsers = [
      { id: '1', name: 'Alice' },
      { id: '3', name: 'Charlie' }
    ];
    mockApiClient.getUsers.mockResolvedValueOnce(updatedUsers);

    // Act - click refresh
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    expect(mockApiClient.getUsers).toHaveBeenCalledTimes(2);
  });
});
```
