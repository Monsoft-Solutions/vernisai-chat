# Web Testing

This document provides specific guidelines and best practices for testing the web package in the VernisAI Chat monorepo.

## Overview

The web package contains the React frontend application. Testing this package thoroughly ensures a high-quality user experience and prevents regressions in the UI.

## Test Structure

Web tests should be organized in the following structure:

```
apps/web/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── ...
└── tests/
    ├── unit/
    │   ├── components/
    │   │   ├── Button.test.tsx
    │   │   └── ...
    │   ├── hooks/
    │   │   ├── useConversation.test.ts
    │   │   └── ...
    │   └── utils/
    │       ├── formatting.test.ts
    │       └── ...
    └── integration/
        ├── pages/
        │   ├── ChatPage.test.tsx
        │   └── ...
        └── flows/
            ├── authentication.test.ts
            └── ...
```

## Unit Testing React Components

### Basic Component Testing

React components should be tested using React Testing Library:

```typescript
// tests/unit/components/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@vernisai/testing/react';
import { Button } from '../../../src/components/Button';

describe('Button Component', () => {
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

  it('should render the correct variant', () => {
    render(<Button variant="primary">Primary Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });
});
```

### Testing Components with Context

For components that use React context:

```typescript
// tests/unit/components/ConversationList.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@vernisai/testing/react';
import { ConversationList } from '../../../src/components/ConversationList';
import { ConversationProvider } from '../../../src/contexts/ConversationContext';

const mockConversations = [
  { id: '1', title: 'Conversation 1', updatedAt: new Date().toISOString() },
  { id: '2', title: 'Conversation 2', updatedAt: new Date().toISOString() }
];

describe('ConversationList Component', () => {
  it('should render a list of conversations', () => {
    render(
      <ConversationProvider initialConversations={mockConversations}>
        <ConversationList />
      </ConversationProvider>
    );

    expect(screen.getByText('Conversation 1')).toBeInTheDocument();
    expect(screen.getByText('Conversation 2')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should show a message when no conversations exist', () => {
    render(
      <ConversationProvider initialConversations={[]}>
        <ConversationList />
      </ConversationProvider>
    );

    expect(screen.getByText('No conversations yet')).toBeInTheDocument();
  });
});
```

### Testing Asynchronous Components

For components that perform asynchronous operations:

```typescript
// tests/unit/components/UserProfile.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@vernisai/testing/react';
import { UserProfile } from '../../../src/components/UserProfile';
import { mockApiClient } from '@vernisai/testing/mocks';

// Mock the API client
vi.mock('../../../src/utils/api', () => ({
  apiClient: mockApiClient
}));

describe('UserProfile Component', () => {
  it('should load and display user data', async () => {
    // Mock the API response
    mockApiClient.getUser.mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    });

    render(<UserProfile userId="1" />);

    // Initially shows loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Verify the user data is displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should handle error states', async () => {
    // Mock an API error
    mockApiClient.getUser.mockRejectedValue(new Error('Failed to fetch user'));

    render(<UserProfile userId="1" />);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch user')).toBeInTheDocument();
    });
  });
});
```

## Testing Hooks

### Basic Hook Testing

React hooks should be tested using the `renderHook` utility:

```typescript
// tests/unit/hooks/useCounter.test.ts
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@vernisai/testing/react";
import { useCounter } from "../../../src/hooks/useCounter";

describe("useCounter Hook", () => {
  it("should initialize with the default value", () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it("should initialize with the provided value", () => {
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

### Testing Hooks with API Calls

For hooks that make API calls:

```typescript
// tests/unit/hooks/useUser.test.ts
import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@vernisai/testing/react";
import { useUser } from "../../../src/hooks/useUser";
import { mockApiClient } from "@vernisai/testing/mocks";

// Mock the API client
vi.mock("../../../src/utils/api", () => ({
  apiClient: mockApiClient,
}));

describe("useUser Hook", () => {
  it("should fetch user data", async () => {
    // Mock the API response
    mockApiClient.getUser.mockResolvedValue({
      id: "1",
      name: "Test User",
      email: "test@example.com",
    });

    const { result } = renderHook(() => useUser("1"));

    // Initially in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();

    // Wait for the data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the user data is loaded
    expect(result.current.user).toEqual({
      id: "1",
      name: "Test User",
      email: "test@example.com",
    });
    expect(result.current.error).toBeNull();
  });

  it("should handle API errors", async () => {
    // Mock an API error
    mockApiClient.getUser.mockRejectedValue(new Error("Failed to fetch user"));

    const { result } = renderHook(() => useUser("1"));

    // Wait for the error to be set
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the error is captured
    expect(result.current.user).toBeNull();
    expect(result.current.error).toEqual(new Error("Failed to fetch user"));
  });
});
```

## Testing Utility Functions

Utility functions should be tested with standard unit tests:

```typescript
// tests/unit/utils/formatting.test.ts
import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatNumber,
  truncateText,
} from "../../../src/utils/formatting";

describe("Formatting Utilities", () => {
  describe("formatDate", () => {
    it("should format dates correctly", () => {
      const date = new Date("2023-01-15T12:30:00Z");

      expect(formatDate(date, "short")).toBe("1/15/23");
      expect(formatDate(date, "long")).toBe("January 15, 2023");
    });

    it("should handle invalid dates", () => {
      expect(formatDate(null, "short")).toBe("Invalid date");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with commas", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1000000)).toBe("1,000,000");
    });

    it("should handle decimals", () => {
      expect(formatNumber(1000.5)).toBe("1,000.5");
    });
  });

  describe("truncateText", () => {
    it("should truncate text longer than the limit", () => {
      const text = "This is a long piece of text that needs to be truncated";

      expect(truncateText(text, 20)).toBe("This is a long piece...");
    });

    it("should not truncate text shorter than the limit", () => {
      const text = "Short text";

      expect(truncateText(text, 20)).toBe("Short text");
    });
  });
});
```

## Testing Store (Redux, Zustand, etc.)

If your application uses a state management library like Redux or Zustand:

```typescript
// tests/unit/store/conversationSlice.test.ts
import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import {
  conversationReducer,
  addConversation,
  setActiveConversation,
} from "../../../src/store/conversationSlice";

describe("Conversation Slice", () => {
  it("should add a conversation", () => {
    const initialState = {
      conversations: [],
      activeConversationId: null,
    };

    const conversation = {
      id: "1",
      title: "New Conversation",
      messages: [],
    };

    const nextState = conversationReducer(
      initialState,
      addConversation(conversation),
    );

    expect(nextState.conversations).toHaveLength(1);
    expect(nextState.conversations[0]).toEqual(conversation);
  });

  it("should set the active conversation", () => {
    const initialState = {
      conversations: [
        { id: "1", title: "Conversation 1", messages: [] },
        { id: "2", title: "Conversation 2", messages: [] },
      ],
      activeConversationId: null,
    };

    const nextState = conversationReducer(
      initialState,
      setActiveConversation("2"),
    );

    expect(nextState.activeConversationId).toBe("2");
  });
});
```

## Integration Testing

Integration tests should test how multiple components work together:

```typescript
// tests/integration/pages/ChatPage.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@vernisai/testing/react';
import { ChatPage } from '../../../src/pages/ChatPage';
import { mockApiClient } from '@vernisai/testing/mocks';

// Mock the API client
vi.mock('../../../src/utils/api', () => ({
  apiClient: mockApiClient
}));

describe('ChatPage Integration', () => {
  it('should load conversations and select one', async () => {
    // Mock the API responses
    mockApiClient.listConversations.mockResolvedValue([
      { id: '1', title: 'Conversation 1', updatedAt: new Date().toISOString() },
      { id: '2', title: 'Conversation 2', updatedAt: new Date().toISOString() }
    ]);

    mockApiClient.getMessages.mockResolvedValue([
      { id: '101', conversationId: '1', content: 'Hello', role: 'user' },
      { id: '102', conversationId: '1', content: 'Hi there!', role: 'assistant' }
    ]);

    render(<ChatPage />);

    // Wait for conversations to load
    await waitFor(() => {
      expect(screen.getByText('Conversation 1')).toBeInTheDocument();
    });

    // Click on a conversation
    fireEvent.click(screen.getByText('Conversation 1'));

    // Wait for messages to load
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
  });

  it('should send a new message', async () => {
    // Mock the API responses
    mockApiClient.listConversations.mockResolvedValue([
      { id: '1', title: 'Conversation 1', updatedAt: new Date().toISOString() }
    ]);

    mockApiClient.getMessages.mockResolvedValue([]);

    mockApiClient.sendMessage.mockImplementation(async ({ content }) => {
      return {
        id: '201',
        conversationId: '1',
        content,
        role: 'user'
      };
    });

    render(<ChatPage />);

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Conversation 1')).toBeInTheDocument();
    });

    // Click on the conversation
    fireEvent.click(screen.getByText('Conversation 1'));

    // Type a message
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'New message' } });

    // Send the message
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // Wait for the message to be sent and displayed
    await waitFor(() => {
      expect(screen.getByText('New message')).toBeInTheDocument();
    });

    // Verify that the API was called
    expect(mockApiClient.sendMessage).toHaveBeenCalledWith({
      conversationId: '1',
      content: 'New message'
    });
  });
});
```

## Testing Router Integration

For applications using React Router or TanStack Router:

```typescript
// tests/integration/routing/navigation.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@vernisai/testing/router';
import { App } from '../../../src/App';

describe('Navigation', () => {
  it('should navigate to the dashboard page', async () => {
    render(<App />, { initialRoute: '/' });

    // Click the dashboard link
    fireEvent.click(screen.getByRole('link', { name: /dashboard/i }));

    // Check that we navigated to the dashboard
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('should navigate to a conversation page', async () => {
    render(<App />, { initialRoute: '/dashboard' });

    // Mock API call for conversations
    vi.mocked(mockApiClient.listConversations).mockResolvedValue([
      { id: '1', title: 'Conversation 1', updatedAt: new Date().toISOString() }
    ]);

    // Wait for the conversations to load
    await waitFor(() => {
      expect(screen.getByText('Conversation 1')).toBeInTheDocument();
    });

    // Click on a conversation
    fireEvent.click(screen.getByText('Conversation 1'));

    // Check that we navigated to the conversation page
    expect(window.location.pathname).toBe('/conversations/1');
  });
});
```

## Testing Form Validation

For forms with validation:

```typescript
// tests/unit/components/LoginForm.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@vernisai/testing/react';
import { LoginForm } from '../../../src/components/LoginForm';

describe('LoginForm Component', () => {
  it('should validate email format', async () => {
    const handleSubmit = vi.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    // Fill in an invalid email
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    // Fill in a password
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for validation message
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();

    // Verify the form was not submitted
    expect(handleSubmit).not.toHaveBeenCalled();

    // Fix the email
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });

    // Submit again
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Verify the form was submitted
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'valid@example.com',
      password: 'password123'
    });
  });

  it('should validate password length', async () => {
    const handleSubmit = vi.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    // Fill in a valid email
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });

    // Fill in a short password
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for validation message
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();

    // Verify the form was not submitted
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
```

## Testing Accessibility

Accessibility tests ensure your components are usable by everyone:

```typescript
// tests/unit/components/AccessibilityTest.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@vernisai/testing/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../../../src/components/Button';

// Add the custom matcher
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('Button should not have accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <div role="dialog" aria-labelledby="dialog-title">
        <h2 id="dialog-title">Dialog Title</h2>
        <p>Dialog content</p>
        <Button aria-label="Close dialog">X</Button>
      </div>
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'dialog-title');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
  });
});
```

## Testing Error Boundaries

Error boundaries catch JavaScript errors in UI components:

```typescript
// tests/unit/components/ErrorBoundary.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@vernisai/testing/react';
import { ErrorBoundary } from '../../../src/components/ErrorBoundary';

// A component that throws an error
const BuggyComponent = () => {
  throw new Error('Test error');
  return <div>This will not render</div>;
};

describe('ErrorBoundary Component', () => {
  it('should catch errors and display fallback UI', () => {
    // Suppress React's error logging
    const originalConsoleError = console.error;
    console.error = vi.fn();

    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    // Check that the fallback UI is displayed
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/test error/i)).toBeInTheDocument();

    // Restore console.error
    console.error = originalConsoleError;
  });

  it('should render children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test behaviors, not implementation**: Focus on what the component does, not how it's implemented.
2. **Use data-testid sparingly**: Prefer using accessible roles and labels for element selection.
3. **Mock external dependencies**: Mock API calls, routers, and other external dependencies.
4. **Test error states**: Don't just test the happy path; test error handling as well.
5. **Keep tests focused**: Each test should verify one specific aspect of behavior.
6. **Use the right queries**: Use the React Testing Library query priority: getByRole > getByLabelText > getByPlaceholderText > getByText > getByDisplayValue > getByAltText > getByTitle > getByTestId.
7. **Write accessible components**: Use accessibility testing to ensure components are usable by everyone.
8. **Test user interactions**: Verify that components respond correctly to user interactions.

## Common Pitfalls

1. **Testing implementation details**: Testing component internals can lead to brittle tests.
2. **Not waiting for async operations**: Always wait for asynchronous operations to complete.
3. **Using snapshot testing excessively**: Snapshot tests can be brittle; use them sparingly.
4. **Not testing responsive behavior**: Ensure components work correctly at different screen sizes.
5. **Hardcoding test data**: Use factories or fixtures for consistent test data.

## Testing Tools

The `@vernisai/testing` package provides several utilities for web testing:

- `render`, `screen`, `fireEvent`: React Testing Library utilities
- `renderHook`: Testing React hooks
- `mockRouter`: Mocking router functionality
- `createMockApiClient`: Creating mock API clients
- `axe`: Accessibility testing utilities
- `mockResponsive`: Testing responsive behavior
