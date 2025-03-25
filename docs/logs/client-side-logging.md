# Client-Side Logging with Sentry

This document outlines the client-side logging strategy for VernisAI Chat application using Sentry.

## Overview

Client-side logging captures errors and performance metrics from the user's browser, providing valuable insights into:

- Front-end errors and exceptions
- User interactions and activity flows
- Application performance metrics
- Feature usage patterns
- Browser and device compatibility issues

## Integration with @vernisai/logger

The client-side Sentry implementation complements the server-side `@vernisai/logger` package to provide end-to-end observability across the entire application stack. The two systems work together by:

- Using consistent request IDs to correlate client and server events
- Tracking user context across both systems
- Providing comprehensive error tracking from browser to backend
- Enabling holistic performance monitoring throughout the request lifecycle

### Request Correlation

To correlate client-side events with server-side logs:

```typescript
// When sending API requests from the client
import * as Sentry from "@sentry/react";
import { v4 as uuidv4 } from "uuid";

// Generate or reuse a request ID
const requestId = uuidv4();

// Add to Sentry breadcrumb
Sentry.addBreadcrumb({
  category: "api.request",
  message: "Sending API request",
  data: {
    endpoint: "/api/data",
    requestId,
  },
});

// Include in API request headers
fetch("/api/data", {
  headers: {
    "X-Request-ID": requestId,
  },
});

// The server's @vernisai/logger will extract this ID and include it in all related logs
```

## Setup and Configuration

### Installation

```bash
npm install @sentry/react @sentry/tracing
```

### Initialization

Add the following code to your application entry point:

```typescript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN", // Will be replaced with actual DSN in .env file
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 for development, lower for production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

  // Capture errors in all environments except local development
  // enabled: process.env.NODE_ENV !== "development",

  // Set environment
  environment: process.env.NODE_ENV,
});
```

### Environment Variables

Add to your `.env` file:

```
# Sentry configuration
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_SENTRY_ENVIRONMENT=development|staging|production
```

### User Context

Track user-specific information to connect errors with specific users:

```typescript
// Add when user logs in or session starts
Sentry.setUser({
  id: "user-id",
  email: "user@example.com", // optional
  username: "username", // optional
});

// Clear when user logs out
Sentry.configureScope((scope) => scope.setUser(null));
```

## Usage Guidelines

### Error Tracking

Errors are automatically captured, but you can also manually report errors:

```typescript
try {
  // risky operation
} catch (error) {
  Sentry.captureException(error);
}
```

### Custom Events

Log specific user actions or application events:

```typescript
// Log custom events with additional context
Sentry.captureEvent({
  message: "User performed a specific action",
  level: "info",
  extra: {
    actionType: "buttonClick",
    elementId: "submit-form",
  },
});
```

### Performance Monitoring

Track performance of specific operations:

```typescript
// Create custom transaction
const transaction = Sentry.startTransaction({
  name: "Process Form Submission",
  op: "task",
});

// Set transaction as current
Sentry.configureScope((scope) => scope.setSpan(transaction));

try {
  // Perform operation
} finally {
  transaction.finish();
}
```

### Breadcrumbs

Add contextual information to help debug issues:

```typescript
// Add custom breadcrumbs for better debugging context
Sentry.addBreadcrumb({
  category: "ui.click",
  message: "User clicked on submit button",
  level: "info",
  data: {
    formId: "registration",
    formState: {
      /* form data */
    },
  },
});
```

### React Error Boundary

Wrap components with Sentry's error boundary:

```tsx
import { ErrorBoundary } from "@sentry/react";

function FallbackComponent({ error, componentStack, resetError }) {
  return (
    <div>
      <h2>Something went wrong:</h2>
      <p>{error.toString()}</p>
      <button onClick={resetError}>Try again</button>
    </div>
  );
}

function MyApp() {
  return (
    <ErrorBoundary fallback={FallbackComponent}>
      <App />
    </ErrorBoundary>
  );
}
```

## Security and Privacy Considerations

### Data Protection

- Never log sensitive user information (passwords, tokens, etc.)
- Configure Sentry to scrub PII data from error reports
- Implement IP address anonymization if needed

### PII Filtering

Configure Sentry to filter sensitive data:

```typescript
Sentry.init({
  // ... other configuration
  beforeSend(event) {
    // Remove user IP address
    if (event.request && event.request.ip_address) {
      delete event.request.ip_address;
    }
    return event;
  },

  // Configure sensitive fields to scrub
  denyUrls: [
    // Add URLs that should never send events
    /\/api\/auth/i,
  ],
  ignoreErrors: [
    // Add error messages that should be ignored
    /Custom error that should be ignored/i,
  ],
});
```

## Advanced Features

### Monitoring tRPC Client Requests

To monitor tRPC client requests from the frontend:

```typescript
import { createTRPCReact } from "@trpc/react-query";
import * as Sentry from "@sentry/react";

// Create a wrapper for the tRPC client
export function createTRPCClientWithSentry<
  T extends ReturnType<typeof createTRPCReact>,
>(client: T) {
  // Create a proxy that captures client errors and performance
  return new Proxy(client, {
    get(target, prop) {
      const value = target[prop];

      if (typeof value === "function") {
        // Intercept query and mutation calls
        return new Proxy(value, {
          apply(target, thisArg, args) {
            const procedureName = String(prop);

            // Start transaction for performance tracking
            const transaction = Sentry.startTransaction({
              name: `tRPC ${procedureName}`,
              op: "trpc.client",
            });

            // Add breadcrumb for the request
            Sentry.addBreadcrumb({
              category: "trpc.request",
              message: `tRPC request: ${procedureName}`,
              data: { args: args[0] },
            });

            // Call the original method
            const result = target.apply(thisArg, args);

            // Handle promises
            if (result && typeof result.then === "function") {
              return result
                .then((data) => {
                  transaction.setStatus("ok");
                  transaction.finish();
                  return data;
                })
                .catch((error) => {
                  transaction.setStatus("error");
                  transaction.finish();

                  // Capture the error
                  Sentry.captureException(error, {
                    tags: { procedureName },
                    extra: { args: args[0] },
                  });

                  throw error;
                });
            }

            transaction.finish();
            return result;
          },
        });
      }

      return value;
    },
  });
}
```

### Custom Logging to Match @vernisai/logger Format

For consistent logging format between client and server:

```typescript
import * as Sentry from "@sentry/react";

// Define log levels that match the server
export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

// Create a client logger with similar API to server logger
export const clientLogger = {
  error(message: string, context?: Record<string, any>) {
    console.error(message, context);
    Sentry.captureMessage(message, {
      level: "error",
      extra: context,
    });
  },

  warn(message: string, context?: Record<string, any>) {
    console.warn(message, context);
    Sentry.captureMessage(message, {
      level: "warning",
      extra: context,
    });
  },

  info(message: string, context?: Record<string, any>) {
    console.info(message, context);
    if (process.env.NODE_ENV !== "production") {
      Sentry.captureMessage(message, {
        level: "info",
        extra: context,
      });
    }
  },

  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(message, context);
    }
  },
};
```

## Best Practices

1. **Implement Breadcrumbs**: Add breadcrumbs before operations that might fail to provide context
2. **Use Custom User Context**: Track user information for better error attribution
3. **Monitor Performance**: Set up transactions for key user interactions
4. **Add Metadata**: Include browser, device, and application version with errors
5. **Handle Network Errors**: Specifically capture and classify connectivity issues
6. **Avoid Noisy Alerts**: Filter out expected errors and focus on actionable issues
7. **Tagged Releases**: Tag Sentry releases with version numbers for source mapping
8. **Scope Management**: Create scopes for different parts of your application

## Sentry Dashboard Configuration

After setting up client-side logging, configure your Sentry dashboard:

1. **Create Alert Rules**: Set up alerts for critical errors
2. **Configure Issue Grouping**: Organize similar errors together
3. **Set Up Integrations**: Connect Sentry to Slack, Teams, or Email for notifications
4. **Add Team Members**: Invite team members and assign roles
5. **Define On-Call Schedule**: Create on-call schedules for urgent issues

## Implementation Checklist

- [ ] Create Sentry account and project
- [ ] Add Sentry SDK to dependencies
- [ ] Configure environment variables
- [ ] Initialize Sentry in application
- [ ] Set up error boundaries in React components
- [ ] Configure PII filtering
- [ ] Set up release tracking
- [ ] Test error reporting
- [ ] Implement user consent management if required
