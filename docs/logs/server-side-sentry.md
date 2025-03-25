# Server-Side Error Monitoring with Sentry

This document outlines the server-side error monitoring strategy for VernisAI Chat application using Sentry.

## Overview

Server-side error monitoring with Sentry provides:

- Real-time error tracking and alerting
- Detailed error context and stack traces
- Performance monitoring with transactions and spans
- Distributed tracing across services
- Release tracking and deployment monitoring
- Structured event data for better debugging

## Setup and Configuration

### Installation

```bash
npm install @sentry/node @sentry/profiling-node
```

### Initialization

Create a dedicated Sentry initialization module:

```typescript
// utils/sentry-server.ts
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

export function initSentry(): void {
  const dsn = process.env.SENTRY_SERVER_DSN;
  const environment = process.env.NODE_ENV || "development";
  const enabled = Boolean(dsn) && environment !== "development";

  if (enabled) {
    Sentry.init({
      dsn,
      integrations: [
        // Add Node Profiling integration for performance insights
        nodeProfilingIntegration(),
      ],

      // Set tracesSampleRate to 1.0 for development, lower for production
      tracesSampleRate: environment === "production" ? 0.2 : 1.0,

      // Profile up to 20% of transactions in production, 100% in other environments
      profilesSampleRate: environment === "production" ? 0.2 : 1.0,

      // Set environment
      environment,

      // Release tracking - helps identify which release caused an error
      release: `vernisai-api@${process.env.npm_package_version}`,

      // Customize error sampling
      beforeSend(event) {
        // Remove sensitive data if needed
        if (event.request && event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }

        return event;
      },
    });

    console.info(`Sentry server initialized in ${environment} environment`);
  } else {
    console.info(
      "Sentry server disabled: No DSN provided or running in development mode",
    );
  }
}
```

### Express Integration

For Express applications, add Sentry middleware:

```typescript
// server.ts or app.ts
import express from "express";
import * as Sentry from "@sentry/node";
import { initSentry } from "./utils/sentry-server";

// Initialize Sentry BEFORE initializing your app
initSentry();

const app = express();

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// Your routes and other middleware here
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallback error handler
app.use((err, req, res, next) => {
  // Your custom error handling logic
  res.status(500).json({
    error: "Internal Server Error",
    // Include the Sentry event ID so users can reference it when reporting issues
    eventId: res.sentry,
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```

### TRPC Integration

For TRPC applications, add Sentry error capture:

```typescript
// trpc/server.ts
import { initTRPC, TRPCError } from "@trpc/server";
import * as Sentry from "@sentry/node";
import { initSentry } from "../utils/sentry-server";

// Initialize Sentry before setting up TRPC
initSentry();

// Create TRPC instance
const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    // Report all internal errors to Sentry
    if (error.code === "INTERNAL_SERVER_ERROR") {
      Sentry.captureException(error.cause || error);
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        // Add Sentry event ID for reference
        sentryId: Sentry.lastEventId(),
      },
    };
  },
});

// Middleware to handle errors and trace transactions
export const sentryMiddleware = t.middleware(async ({ path, type, next }) => {
  // Start a transaction
  const transaction = Sentry.startTransaction({
    op: "trpc",
    name: `TRPC ${type} ${path}`,
  });

  Sentry.configureScope((scope) => {
    scope.setSpan(transaction);
    scope.setTags({
      "trpc.type": type,
      "trpc.path": path,
    });
  });

  try {
    // Execute the request
    const result = await next();

    // Finish transaction with status
    transaction.setStatus(result.ok ? "ok" : "failed");
    transaction.finish();

    return result;
  } catch (error) {
    // Capture exception and finish transaction with error status
    Sentry.captureException(error);
    transaction.setStatus("internal_error");
    transaction.finish();

    throw error;
  }
});

// Use middleware in your router
export const router = t.router;
export const publicProcedure = t.procedure.use(sentryMiddleware);
```

### Environment Variables

Add to your `.env` file:

```
# Sentry configuration for server-side monitoring
SENTRY_SERVER_DSN=your_server_dsn_here
```

Note that the server DSN must be different from the client DSN to keep the projects separate in your Sentry account.

## Usage Guidelines

### Manual Error Capturing

```typescript
import * as Sentry from "@sentry/node";

// Capture exceptions with context
try {
  // Some code that might throw
  await processData();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      component: "data-processor",
    },
    extra: {
      dataId: id,
      processingStage: "validation",
    },
  });

  // Rethrow or handle as needed
  throw error;
}

// Capture custom events
Sentry.captureEvent({
  message: "Database connection warning",
  level: "warning",
  extra: {
    connectionTime: 350,
    retryCount: 2,
  },
});

// Add breadcrumbs for debugging context
Sentry.addBreadcrumb({
  category: "auth",
  message: "User authentication attempt",
  level: "info",
  data: {
    method: "password",
    userId: user.id,
  },
});
```

### Setting User Context

```typescript
// After user authentication
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
  // Add any other relevant user data
});

// Clear user data when session ends
Sentry.setUser(null);
```

### Performance Monitoring

```typescript
// Measure function performance
const transaction = Sentry.startTransaction({
  op: "function",
  name: "processUserData",
});

try {
  // Span for specific operations within the transaction
  const span = transaction.startChild({
    op: "db.query",
    description: "Fetch user preferences",
  });

  const data = await fetchUserPreferences(userId);

  // Finish the span
  span.finish();

  // Another span
  const processingSpan = transaction.startChild({
    op: "process",
    description: "Process user data",
  });

  const result = processData(data);

  processingSpan.finish();

  return result;
} finally {
  // Always finish the transaction
  transaction.finish();
}
```

### Serverless Functions Integration

For serverless environments:

```typescript
// serverless.ts
import * as Sentry from "@sentry/node";
import { initSentry } from "./utils/sentry-server";

// Initialize once outside handler for better performance
initSentry();

export const handler = Sentry.wrapHandler(async (event, context) => {
  // Your lambda function code
  try {
    return await processEvent(event);
  } catch (error) {
    console.error("Error processing event:", error);
    throw error; // Sentry will catch this
  }
});
```

## Source Maps

For proper stack trace resolution, upload source maps to Sentry:

### Manual Setup with CLI

1. Install the Sentry CLI:

   ```bash
   npm install @sentry/cli --save-dev
   ```

2. Add a release script in `package.json`:

   ```json
   "scripts": {
     "build": "tsc",
     "sentry:sourcemaps": "sentry-cli sourcemaps inject --org your-org --project your-project ./dist && sentry-cli sourcemaps upload --org your-org --project your-project ./dist"
   }
   ```

3. Create `.sentryclirc` file:

   ```ini
   [auth]
   token=your_auth_token

   [defaults]
   org=your-org-slug
   project=your-project-slug
   ```

### Webpack/Rollup/ESBuild Integration

Alternatively, use Sentry's build plugins for your bundler.

Example for Webpack:

```javascript
// webpack.config.js
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

module.exports = {
  // ... other config
  devtool: "source-map",
  plugins: [
    sentryWebpackPlugin({
      org: "your-org",
      project: "your-project",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
};
```

## Sentry Dashboard Features

### Issue Grouping

Sentry will group similar errors to prevent notification fatigue:

1. View grouped issues in the "Issues" tab of your Sentry project
2. Add custom fingerprinting to control how errors are grouped
3. Merge related issues manually in the dashboard

### Alert Rules

Create custom alert rules in the Sentry dashboard:

1. Go to **Alerts** → **Rules**
2. Create conditions like "when a new issue is seen" or "when an issue affects more than X users"
3. Configure notification actions via email, Slack, Discord, etc.

### Performance Monitoring

1. View transaction performance in the **Performance** tab
2. Analyze key metrics like Apdex score, throughput, and p95 response time
3. Identify slow database queries or API calls

### Release Tracking

1. Go to **Releases** to view error rates by release
2. See which commits are associated with each release
3. Track adoption and session data for new versions

## Security Considerations

### PII Data Handling

Configure PII data scrubbing in your Sentry initialization:

```typescript
Sentry.init({
  // ... other options
  beforeSend(event) {
    // Scrub PII from various event locations
    if (event.request && event.request.headers) {
      // Remove authorization data
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
    }

    if (event.user) {
      // Only keep essential user info
      delete event.user.ip_address;
      // Keep user ID but remove email if needed
      delete event.user.email;
    }

    return event;
  },
  // Automatically scrub data based on patterns
  denyUrls: [
    // Add URLs that should never send events
    /\/api\/auth/i,
  ],
  // Ignore specific errors
  ignoreErrors: [
    // Add errors that should not be reported
    /User declined to share location/i,
  ],
});
```

### Sensitive Data in Breadcrumbs

Be careful not to log sensitive information in breadcrumbs:

```typescript
// BAD: Includes sensitive info
Sentry.addBreadcrumb({
  message: `User ${user.email} entered credit card ${cardNumber}`,
});

// GOOD: No sensitive info
Sentry.addBreadcrumb({
  message: "User entered payment information",
  data: {
    userId: user.id,
    hasPaymentMethod: true,
  },
});
```

## Implementation Checklist

- [ ] Create Sentry server project separate from client project
- [ ] Install required packages
- [ ] Create sentry-server initialization module
- [ ] Update environment variables to include server DSN
- [ ] Integrate with Express or TRPC framework
- [ ] Set up source map uploading
- [ ] Configure error handlers to capture exceptions
- [ ] Add user context to errors after authentication
- [ ] Set up performance monitoring for critical paths
- [ ] Configure PII scrubbing for privacy
- [ ] Set up alerts in Sentry dashboard
