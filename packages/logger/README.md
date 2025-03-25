# @vernisai/logger

A unified logging solution for VernisAI applications.

## Features

- Structured logging with Winston
- Async context tracking for request-scoped logging
- Sanitization of sensitive data
- Performance metrics collection
- Express and tRPC middleware
- Logtail integration

## Installation

```bash
npm install @vernisai/logger
```

## Basic Usage

```typescript
import logger from "@vernisai/logger";

// Log at different levels
logger.info("Application started", { version: "1.0.0" });
logger.error("Something went wrong", { error: new Error("Failed") });
logger.debug("Debug information", { data: { foo: "bar" } });

// Log HTTP requests
logger.http("Incoming request", { method: "GET", path: "/api/users" });
```

## Configuration

```typescript
import { createLogger } from "@vernisai/logger";

const logger = createLogger({
  serviceName: "my-service",
  environment: "development",
  level: "debug",
  transports: {
    console: true,
    logtail: true,
    metrics: false,
  },
  logtail: {
    sourceToken: "your-logtail-token",
  },
  sensitiveFields: ["password", "token", "apiKey"],
});
```

## Express Middleware

```typescript
import express from "express";
import logger, { setupRequestLogging } from "@vernisai/logger";

const app = express();

setupRequestLogging(app, logger, {
  skipPaths: ["/health", "/metrics"],
  logBody: true,
  logHeaders: false,
});
```

## tRPC Middleware

```typescript
import { initTRPC } from "@trpc/server";
import { createTRPCLoggerMiddleware } from "@vernisai/logger";

const t = initTRPC.create();

const loggerMiddleware = t.middleware(
  createTRPCLoggerMiddleware(logger, {
    logParams: true,
    excludeFields: ["password"],
  }),
);

const publicProcedure = t.procedure.use(loggerMiddleware);
```

## Context Tracking

```typescript
import { contextManager } from "@vernisai/logger";

// Run code with context
contextManager.runWithContext({ requestId: "123", userId: "user-456" }, () => {
  // All logs inside this function will include the context
  logger.info("User action", { action: "login" });
});

// Update context
contextManager.updateContext({ organizationId: "org-789" });
```

## License

MIT
