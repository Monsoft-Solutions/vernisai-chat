# Server-Side Logging with @vernisai/logger

This document outlines the server-side logging strategy for VernisAI Chat application using the unified `@vernisai/logger` package with Winston and Better Stack integration.

## Overview

Server-side logging captures application events, errors, and performance metrics from the backend services. Effective logging provides:

- Centralized visibility into application behavior
- Real-time error detection and troubleshooting
- Performance and operational insights
- Security monitoring and audit trails
- User activity tracking

## Technology Selection

After evaluating several logging solutions, we implemented a unified `@vernisai/logger` package that leverages **Winston** integrated with **Better Stack** for the following reasons:

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

## @vernisai/logger Package

The `@vernisai/logger` package provides a unified logging solution for all VernisAI applications. It was created to:

- Standardize logging across all services and packages
- Provide type-safe interfaces for logging
- Implement consistent context tracking
- Support multiple transports with a uniform API
- Incorporate security best practices
- Offer middleware for Express and tRPC integrations

### Package Structure

```
packages/
  └── logger/
      ├── package.json
      ├── tsconfig.json
      ├── src/
      │   ├── index.ts           # Main exports
      │   ├── types/
      │   │   ├── logger.types.ts     # Core logger types
      │   │   ├── context.types.ts    # Context types
      │   │   ├── transport.types.ts  # Transport types
      │   │   └── metrics.types.ts    # Metrics types
      │   ├── core/
      │   │   ├── logger.ts      # Core logger implementation
      │   │   ├── context.ts     # Async context management
      │   │   └── metrics.ts     # Performance metrics tracking
      │   ├── transports/
      │   │   ├── logtail.ts     # Logtail transport
      │   │   ├── console.ts     # Console transport
      │   │   └── metrics.ts     # Metrics transport
      │   ├── middleware/
      │   │   ├── express.ts     # Express middleware
      │   │   └── trpc.ts        # tRPC middleware
      │   └── utils/
      │       ├── sanitizer.ts   # Data sanitization
      │       ├── formatters.ts  # Log formatting
      │       └── security.ts    # Security utilities
```

## Setup and Configuration

### Installation

```bash
# If installing outside the monorepo:
npm install @vernisai/logger winston @logtail/node @logtail/winston

# Within the monorepo, just add as a dependency in your package.json
```

### Basic Configuration

```typescript
// In your application initialization
import { createLogger, LogLevel } from "@vernisai/logger";

// Create a logger instance with default configuration
const logger = createLogger({
  service: "my-service-name",
  level: process.env.LOG_LEVEL || LogLevel.INFO,
  logtailToken: process.env.LOGTAIL_SOURCE_TOKEN,
  consoleOutput: true,
  environment: process.env.NODE_ENV || "development",
  // Optional configuration options
  defaultMeta: {
    version: process.env.APP_VERSION,
  },
  sanitize: true, // Enable PII sanitization
});

// Export the logger for use in your application
export default logger;
```

### Environment Variables

Add to your `.env` file:

```
# Logging configuration
LOG_LEVEL=info                          # debug, info, warn, error
LOGTAIL_SOURCE_TOKEN=your_token_here    # Better Stack token
LOG_SANITIZE=true                       # Enable PII sanitization
LOG_FORMAT=json                         # json or pretty (for development)
```

## Using the Logger

### Basic Logging

```typescript
// Import the logger
import logger from "./logger";

// Use different log levels
logger.error("User authentication failed", {
  userId: "123",
  error: "Invalid credentials",
  statusCode: 401,
});

logger.warn("Rate limit approaching", {
  endpoint: "/api/messages",
  currentRate: "95/100",
});

logger.info("User authenticated successfully", {
  userId: "123",
  loginMethod: "password",
});

logger.debug("Processing request payload", {
  requestId: "req-123",
  payload: {
    /* request data */
  },
});
```

### Context Management

The logger uses AsyncLocalStorage to maintain context across asynchronous operations:

```typescript
import { withLogContext, getLogContext, setLogContext } from "@vernisai/logger";

// Set context that will be included in all logs within this async scope
await withLogContext({ requestId: "req-123", userId: "user-456" }, async () => {
  // This log will automatically include the context
  logger.info("Processing request");

  // Context persists across async operations
  await someAsyncOperation();

  // Access context if needed
  const context = getLogContext();

  // Update context for nested operations
  setLogContext({ ...context, step: "validation" });

  logger.info("Validation complete");
});
```

### Express Middleware

```typescript
import express from "express";
import { createExpressMiddleware } from "@vernisai/logger";
import logger from "./logger";

const app = express();

// Add request logging middleware
app.use(
  createExpressMiddleware({
    logger,
    includeRequestBody: true,
    includeResponseBody: false,
    excludePaths: ["/health", "/metrics"],
    generateRequestId: true,
  }),
);

// Your routes will now have automatic logging
app.get("/api/users", (req, res) => {
  // Logs are automatically generated with request context
  res.json({ users: [] });
});

// Error handler with automatic error logging
app.use((err, req, res, next) => {
  // Error is automatically logged with full context
  res.status(500).json({ error: "Server error" });
});
```

### tRPC Middleware

```typescript
import { initTRPC } from "@trpc/server";
import { createTRPCMiddleware } from "@vernisai/logger";
import logger from "./logger";

const t = initTRPC.create();

// Create a logger middleware for tRPC
const loggerMiddleware = createTRPCMiddleware({
  logger,
  logInput: true,
  logOutput: true,
  sanitizeInput: true,
  sanitizeOutput: true,
});

// Add the middleware to your tRPC router
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure.use(loggerMiddleware);
```

## Extending with Custom Transports

The `@vernisai/logger` package is designed to be easily extended with additional transports beyond the default Better Stack and console transports.

### Adding a Custom Transport

```typescript
import { createLogger, LogLevel } from "@vernisai/logger";
import { ElasticsearchTransport } from "winston-elasticsearch";

// Create your custom transport
const elasticsearchTransport = new ElasticsearchTransport({
  level: "info",
  clientOpts: { node: process.env.ELASTICSEARCH_URL },
  indexPrefix: "vernisai-logs",
});

// Create logger with the custom transport
const logger = createLogger({
  service: "my-service",
  level: LogLevel.INFO,
  // Include standard transports
  logtailToken: process.env.LOGTAIL_SOURCE_TOKEN,
  consoleOutput: true,
  // Add custom transports
  additionalTransports: [elasticsearchTransport],
});
```

### Implementing a Custom Transport Factory

For reusable transport integrations, create a transport factory:

```typescript
// transports/elasticsearch.ts
import { Transport } from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";

export interface ElasticsearchTransportOptions {
  url: string;
  indexPrefix?: string;
  level?: string;
}

export function createElasticsearchTransport(
  options: ElasticsearchTransportOptions,
): Transport {
  return new ElasticsearchTransport({
    level: options.level || "info",
    clientOpts: { node: options.url },
    indexPrefix: options.indexPrefix || "logs",
    bufferLimit: 100,
    flushInterval: 5000,
  });
}

// In your application initialization
import { createLogger } from "@vernisai/logger";
import { createElasticsearchTransport } from "./transports/elasticsearch";

const esTransport = createElasticsearchTransport({
  url: process.env.ELASTICSEARCH_URL,
  indexPrefix: "api-logs",
});

const logger = createLogger({
  // ... standard configuration
  additionalTransports: [esTransport],
});
```

### Supported Transports

Winston supports many transports that can be integrated with the `@vernisai/logger` package:

| Transport      | Package                       | Use Case                                 |
| -------------- | ----------------------------- | ---------------------------------------- |
| Elasticsearch  | winston-elasticsearch         | Centralized logging with powerful search |
| AWS CloudWatch | winston-cloudwatch            | AWS infrastructure integration           |
| Google Cloud   | @google-cloud/logging-winston | Google Cloud infrastructure integration  |
| MongoDB        | winston-mongodb               | Log persistence in MongoDB               |
| Redis          | winston-redis                 | High-performance logging buffer          |
| Logstash       | winston-logstash              | ELK stack integration                    |
| Datadog        | winston-datadog               | Monitoring and analytics platform        |
| Splunk         | winston-splunk-httplogger     | Enterprise logging and monitoring        |
| Syslog         | winston-syslog                | System logging integration               |
| Papertrail     | winston-papertrail            | Cloud log management                     |

## Security Considerations

### Sensitive Data Protection

The logger implements several security features:

1. **Data Sanitization**:

```typescript
// Automatically sanitizes sensitive data when enabled
logger.info("User authenticated", {
  user: {
    id: "user-123",
    email: "user@example.com", // Will be partially redacted
    password: "secret", // Will be completely redacted
    creditCard: "4111111111111111", // Will be redacted except last 4 digits
  },
});
```

2. **IP Anonymization**:

```typescript
import { anonymizeIp } from "@vernisai/logger/utils";

const clientIp = req.ip;
const anonymizedIp = anonymizeIp(clientIp); // Converts 192.168.1.1 to 192.168.1.0

logger.info("Request received", {
  ip: anonymizedIp,
});
```

3. **Custom Sanitization Rules**:

```typescript
import { createLogger, createCustomSanitizer } from "@vernisai/logger";

// Create custom sanitization rules
const customSanitizer = createCustomSanitizer({
  patterns: [
    { pattern: /api-key=([^&]*)/, replacement: "api-key=[REDACTED]" },
    { field: "authToken", replacement: "[REDACTED]" },
  ],
});

// Use custom sanitizer with logger
const logger = createLogger({
  // ... standard configuration
  sanitizer: customSanitizer,
});
```

## Performance Metrics

The logger includes performance tracking features:

```typescript
import { startPerformanceTimer, recordMetric } from "@vernisai/logger";

// Track operation performance
app.get("/api/data", (req, res) => {
  const timer = startPerformanceTimer();

  // Your handler logic
  processRequest(req)
    .then((result) => {
      // Record operation metrics
      const duration = timer.end();
      recordMetric("api_request", {
        path: req.path,
        method: req.method,
        duration,
        statusCode: 200,
      });

      res.json(result);
    })
    .catch((error) => {
      // Also record failures
      const duration = timer.end();
      recordMetric("api_request_error", {
        path: req.path,
        method: req.method,
        duration,
        statusCode: 500,
        errorType: error.name,
      });

      res.status(500).json({ error: "Server error" });
    });
});
```

## Migration Guide

If you're migrating from the previous Winston-based logger directly in the API package:

1. Update your package.json:

   ```diff
   "dependencies": {
   -  "winston": "^3.8.2",
   -  "@logtail/node": "^0.4.0",
   -  "@logtail/winston": "^0.4.0",
   +  "@vernisai/logger": "^0.1.0"
   }
   ```

2. Update your imports:

   ```diff
   - import logger from '../utils/logger';
   + import { createLogger } from '@vernisai/logger';
   +
   + const logger = createLogger({
   +   service: 'api',
   +   logtailToken: process.env.LOGTAIL_SOURCE_TOKEN,
   + });
   ```

3. Replace middleware:

   ```diff
   - import { setupRequestLogging } from '../utils/request-logger';
   + import { createExpressMiddleware } from '@vernisai/logger';

   - setupRequestLogging(app);
   + app.use(createExpressMiddleware({ logger }));
   ```

4. Replace tRPC middleware:

   ```diff
   - import { loggerMiddleware } from '../middlewares/logger.middleware';
   + import { createTRPCMiddleware } from '@vernisai/logger';
   +
   + const loggerMiddleware = createTRPCMiddleware({ logger });

   export const publicProcedure = t.procedure.use(loggerMiddleware);
   ```

## Configuration Reference

### Logger Options

| Option                 | Type        | Description                         | Default       |
| ---------------------- | ----------- | ----------------------------------- | ------------- |
| `service`              | string      | Service name for log identification | 'application' |
| `level`                | LogLevel    | Minimum log level to record         | 'info'        |
| `logtailToken`         | string      | Better Stack source token           | undefined     |
| `consoleOutput`        | boolean     | Enable console transport            | true          |
| `defaultMeta`          | object      | Default metadata for all logs       | {}            |
| `environment`          | string      | Application environment             | 'development' |
| `sanitize`             | boolean     | Enable PII sanitization             | true          |
| `contextProvider`      | function    | Custom context provider function    | getLogContext |
| `additionalTransports` | Transport[] | Additional Winston transports       | []            |
| `format`               | string      | Log format ('json' or 'pretty')     | (auto)        |

### Middleware Options

#### Express Middleware

| Option                | Type     | Description                             | Default        |
| --------------------- | -------- | --------------------------------------- | -------------- |
| `logger`              | Logger   | Logger instance                         | (required)     |
| `includeRequestBody`  | boolean  | Include request body in logs            | false          |
| `includeResponseBody` | boolean  | Include response body in logs           | false          |
| `excludePaths`        | string[] | Paths to exclude from logging           | []             |
| `generateRequestId`   | boolean  | Auto-generate request ID if not present | true           |
| `requestIdHeader`     | string   | Header to look for request ID           | 'x-request-id' |
| `logLevel`            | LogLevel | Log level for request/response logs     | 'http'         |
| `errorLogLevel`       | LogLevel | Log level for error logs                | 'error'        |

#### tRPC Middleware

| Option           | Type     | Description               | Default    |
| ---------------- | -------- | ------------------------- | ---------- |
| `logger`         | Logger   | Logger instance           | (required) |
| `logInput`       | boolean  | Log input parameters      | true       |
| `logOutput`      | boolean  | Log output response       | false      |
| `sanitizeInput`  | boolean  | Sanitize input parameters | true       |
| `sanitizeOutput` | boolean  | Sanitize output response  | true       |
| `logLevel`       | LogLevel | Log level for normal logs | 'info'     |
| `errorLogLevel`  | LogLevel | Log level for error logs  | 'error'    |
