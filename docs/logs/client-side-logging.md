# Client-Side Logging with Sentry

This document outlines the client-side logging strategy for VernisAI Chat application using Sentry.

## Overview

Client-side logging captures errors and performance metrics from the user's browser, providing valuable insights into:

- Front-end errors and exceptions
- User interactions and activity flows
- Application performance metrics
- Feature usage patterns
- Browser and device compatibility issues

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

### Consent Management

For regions with strict privacy laws like GDPR:

```typescript
// Function to check if user has given consent
function userHasGivenConsent() {
  return localStorage.getItem('errorReportingConsent') === 'true';
}

// Initialize Sentry based on consent
Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  enabled: userHasGivenConsent() && process.env.NODE_ENV !== 'development',
  // ... other configuration
});

// Consent management UI
function ErrorReportingConsent() {
  const [consent, setConsent] = useState(userHasGivenConsent());

  const updateConsent = (newConsent) => {
    localStorage.setItem('errorReportingConsent', newConsent);
    setConsent(newConsent);
    // Refresh page to update Sentry initialization
    window.location.reload();
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => updateConsent(e.target.checked)}
        />
        Allow error reporting to improve application quality
      </label>
    </div>
  );
}
```

## Advanced Configuration

### Source Maps

Ensure proper source maps for better error debugging:

```typescript
// In your Vite/Webpack configuration
{
  build: {
    sourcemap: true;
  }
}
```

### Release Tracking

Track which release version an error occurred in:

```typescript
Sentry.init({
  // ... other configuration
  release: "vernisai-chat@" + process.env.npm_package_version,
});
```

### Performance Tracing

Configure default transaction sampling:

```typescript
Sentry.init({
  // ... other configuration
  integrations: [
    new BrowserTracing({
      tracingOrigins: ["localhost", "your-site.com"],
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        history,
        routes,
        matchPath,
      ),
    }),
  ],
  tracesSampleRate: 0.1, // Sample 10% of transactions
});
```

## Sentry Dashboard Usage

1. **Issue Tracking**: Monitor and triage errors by frequency and impact
2. **Performance Monitoring**: Track page load times and other metrics
3. **User Feedback**: Collect user feedback when errors occur
4. **Release Health**: Monitor error rates by release
5. **Alerts**: Set up notifications for critical issues

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
