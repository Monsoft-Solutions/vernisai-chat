# Server-Side Logging with Winston and Better Stack

This document outlines the server-side logging strategy for VernisAI Chat application using Winston with Better Stack integration.

## Overview

Server-side logging captures application events, errors, and performance metrics from the backend services. Effective logging provides:

- Centralized visibility into application behavior
- Real-time error detection and troubleshooting
- Performance and operational insights
- Security monitoring and audit trails
- User activity tracking

## Technology Selection

After evaluating several logging solutions, we selected **Winston** integrated with **Better Stack** for the following reasons:

1. **Winston** provides:

   - Flexible and extensible logging architecture
   - Multiple log levels and transports
   - Structured logging with JSON support
   - High performance with low overhead
   - Widespread adoption and community support

2. **Better Stack** provides:
   - Centralized log aggregation and storage
   - Powerful search and filtering
   - Real-time log streaming
   - Alerting and notification capabilities
   - Team collaboration features
   - Extensive retention options

## Setup and Configuration

### Installation

```bash
npm install winston @logtail/node @logtail/winston
```

### Basic Configuration

Create a dedicated logger module in your project:

```typescript
// utils/logger.ts
import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

// Initialize Logtail with your source token
const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

// Create formatter for development logs
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS",
  }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""}`;
  }),
);

// Create a Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: { service: "vernisai-api" },
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),
    winston.format.json(),
  ),
  transports: [
    // Console transport for local development
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? winston.format.json()
          : devFormat,
    }),
    // Better Stack transport for centralized logging
    new LogtailTransport(logtail),
  ],
});

// Add environment-specific configuration
if (process.env.NODE_ENV !== "production") {
  // More detailed logging for development
  logger.level = "debug";
}

export default logger;
```

### Environment Variables

Add to your `.env` file:

```
# Logging configuration
LOG_LEVEL=info
LOGTAIL_SOURCE_TOKEN=your_source_token_here
```

## Better Stack Setup

### Account and Source Creation

1. Sign up for an account at [Better Stack](https://betterstack.com/)
2. Create a new source by clicking "Add source" in the dashboard
3. Select "Node.js" as the source type
4. Follow the setup instructions to get your source token
5. Add the token to your environment variables

### Transport Configuration

The `LogtailTransport` class handles sending logs to Better Stack:

```typescript
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

// Initialize with options
const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, {
  // Optional configuration
  throttleInterval: 1000, // milliseconds
  batchSize: 100, // max items per batch
  batchInterval: 1000, // milliseconds
  contextProvider: () => ({
    // Add custom context to all logs
    host: process.env.HOSTNAME,
    environment: process.env.NODE_ENV,
  }),
});

// Add to Winston transports
const logger = winston.createLogger({
  // ... other configuration
  transports: [
    // ... other transports
    new LogtailTransport(logtail),
  ],
});
```

## Usage Guidelines

### Basic Logging

```typescript
// Import the logger
import logger from "../utils/logger";

// Use different log levels
logger.error("Error occurred during user authentication", {
  userId: "123",
  error: err.message,
});

logger.warn("Rate limit approaching for API endpoint", {
  endpoint: "/api/messages",
  currentRate: "95/100",
});

logger.info("User successfully authenticated", {
  userId: "123",
  loginMethod: "password",
});

logger.http("Received API request", {
  method: "POST",
  path: "/api/messages",
  contentLength: req.headers["content-length"],
});

logger.debug("Processing message payload", {
  messageId: "msg123",
  payload: messageData,
});

logger.verbose("Detailed operation information", {
  step: "validation",
  details: validationResults,
});
```

### Request Logging with Express

Integrate with Express middleware using Morgan:

```typescript
// middleware/request-logger.ts
import express from "express";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";

// Create a custom Morgan token for request IDs
morgan.token("request-id", (req) => req.id);
morgan.token("user-id", (req) => req.user?.id || "anonymous");

// Create a Winston stream for Morgan
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Export middleware
export function setupRequestLogging(app: express.Application) {
  // Add request ID middleware
  app.use((req, res, next) => {
    req.id = uuidv4();

    // Add response finished logging
    res.on("finish", () => {
      const responseTime = Date.now() - req.startTime;
      logger.http("Response sent", {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime,
        userId: req.user?.id,
      });
    });

    req.startTime = Date.now();
    next();
  });

  // Use Morgan middleware with Winston
  app.use(
    morgan(
      ":method :url :status :response-time ms - :res[content-length] - :user-id - :request-id",
      { stream },
    ),
  );
}
```

### Error Handling

Create a centralized error handler:

```typescript
// middleware/error-handler.ts
import express from "express";
import logger from "../utils/logger";

export function errorHandler(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  // Log the error
  logger.error("Unhandled error", {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    request: {
      id: req.id,
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      body: sanitizeRequestBody(req.body),
      ip: req.ip,
      user: req.user?.id,
    },
  });

  // Send response to client
  res.status(500).json({
    error: "Internal server error",
    requestId: req.id, // Include for support reference
  });
}

// Helper function to remove sensitive data
function sanitizeRequestBody(body: any) {
  if (!body) return {};

  const sanitized = { ...body };

  // Remove sensitive fields
  const sensitiveFields = ["password", "token", "apiKey", "credit_card"];
  sensitiveFields.forEach((field) => {
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]";
    }
  });

  return sanitized;
}
```

### TRPC Integration

For TRPC applications, add logging middleware:

```typescript
// trpc/middleware/logger.ts
import { middleware } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import logger from "../../utils/logger";

export const loggerMiddleware = middleware(
  async ({ path, type, next, ctx }) => {
    const start = Date.now();

    // Log the request
    logger.info(`TRPC ${type} request started`, {
      path,
      type,
      user: ctx.session?.user?.id,
    });

    // Execute the request and catch errors
    const result = await next();

    const durationMs = Date.now() - start;

    if (!result.ok) {
      // Log errors
      const error = result.error;
      const httpCode = getHTTPStatusCodeFromError(error);

      logger.error(`TRPC ${type} request failed`, {
        path,
        type,
        error: {
          code: error.code,
          message: error.message,
          data: error.data,
        },
        httpStatus: httpCode,
        durationMs,
        user: ctx.session?.user?.id,
      });
    } else {
      // Log successful requests
      logger.info(`TRPC ${type} request completed`, {
        path,
        type,
        durationMs,
        user: ctx.session?.user?.id,
      });
    }

    return result;
  },
);
```

## Log Levels and When to Use Them

| Level   | Priority | Usage                                             |
| ------- | -------- | ------------------------------------------------- |
| error   | 0        | Critical errors requiring immediate attention     |
| warn    | 1        | Potentially harmful situations                    |
| info    | 2        | Important business events and flows               |
| http    | 3        | HTTP request/response logging                     |
| verbose | 4        | Detailed information for debugging specific flows |
| debug   | 5        | Debugging information for developers              |
| silly   | 6        | Extremely detailed tracing information            |

## Performance Considerations

### Async Logging

For high-throughput applications, configure Winston to use async logging:

```typescript
import { AsyncLocalStorage } from "async_hooks";

// Create context storage
const asyncLocalStorage = new AsyncLocalStorage();

// Create an async-friendly logger
const logger = winston.createLogger({
  // ... other config
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
    new LogtailTransport(logtail),
  ],
});

// Middleware to set context
app.use((req, res, next) => {
  const store = {
    requestId: req.id,
    userId: req.user?.id,
  };

  asyncLocalStorage.run(store, next);
});

// Custom format that includes context
const formatWithContext = winston.format((info) => {
  const context = asyncLocalStorage.getStore();
  if (context) {
    info.requestId = context.requestId;
    info.userId = context.userId;
  }
  return info;
});

// Add format to logger
logger.format = winston.format.combine(
  formatWithContext(),
  // ... other formats
  winston.format.json(),
);
```

### Log Sampling

For high-volume logs, implement sampling:

```typescript
// Only log a percentage of HTTP requests
app.use((req, res, next) => {
  // Sample 10% of requests for detailed logging
  const shouldLog = Math.random() < 0.1;

  if (shouldLog) {
    // Detailed logging
    req.enableDetailedLogging = true;
  }

  next();
});

// In your logging code
if (req.enableDetailedLogging) {
  logger.verbose("Detailed request information", {
    /* detailed data */
  });
} else {
  logger.http("Basic request information", {
    /* minimal data */
  });
}
```

## Better Stack Features

### Live Tail

Access live logs for real-time debugging:

1. Navigate to the Better Stack dashboard
2. Select your source
3. Click "Live tail" to view real-time logs
4. Apply filters to focus on specific log attributes

### Advanced Search

Query your logs with powerful search capabilities:

```
level:error                        // Search by log level
message:"authentication failed"     // Search in message field
user.id:123                        // Search in nested fields
level:error AND service:api        // Combine conditions
timestamp:>2023-03-24T00:00:00Z    // Time-based filtering
```

### Dashboards

Create custom dashboards to visualize log data:

1. Navigate to "Dashboards" in Better Stack
2. Create a new dashboard
3. Add widgets for different metrics:
   - Error rate over time
   - HTTP status code distribution
   - Request latency
   - API endpoint usage

### Alerts

Set up alerts based on log patterns:

1. Navigate to "Alerts" in Better Stack
2. Create a new alert
3. Define conditions (e.g., "5 errors in 5 minutes")
4. Configure notification channels (email, Slack, etc.)
5. Set severity levels and on-call schedules

## Security Best Practices

### Sensitive Data Handling

- Never log passwords, tokens, or API keys
- Use sanitization functions to clean request bodies
- Configure field masking for sensitive data
- Consider compliance requirements (GDPR, HIPAA, etc.)

### Log Field Sanitization

```typescript
// Sanitize common sensitive fields
function sanitizeLogFields(
  data: any,
  sensitiveFields = ["password", "token", "apiKey"],
) {
  if (!data || typeof data !== "object") return data;

  const result = { ...data };

  for (const [key, value] of Object.entries(result)) {
    if (sensitiveFields.includes(key)) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeLogFields(value, sensitiveFields);
    }
  }

  return result;
}

// Use in logging
logger.info("User updated profile", sanitizeLogFields(userData));
```

## Implementation Roadmap

1. Set up Winston logger with basic configuration
2. Create Better Stack account and obtain source token
3. Integrate Winston with Better Stack transport
4. Implement request logging middleware
5. Add error handling middleware with logging
6. Configure log levels for different environments
7. Set up alerts and dashboards in Better Stack
8. Implement log sanitization for sensitive data
9. Document logging standards for the team
10. Monitor and tune logging performance
