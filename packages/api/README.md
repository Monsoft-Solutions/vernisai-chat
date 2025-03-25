# @vernisai/api

This package contains the tRPC API implementation for the VernisAI application. It provides a type-safe API layer that can be deployed to serverless environments like Vercel or AWS Lambda.

## Features

- Type-safe API endpoints using tRPC
- Automatic TypeScript type generation for clients
- OpenAPI documentation generation
- Multi-tenant organization support
- Serverless adapters for Vercel and AWS Lambda
- Comprehensive logging with Winston and Better Stack integration

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Building

```bash
npm run build
```

### Generating OpenAPI Documentation

```bash
npm run generate:openapi
```

## Logging System

The API includes a robust logging system based on Winston with Better Stack integration:

### Configuration

Configure logging through environment variables:

```bash
# Logging configuration
LOG_LEVEL=info                                  # Log levels: error, warn, info, http, verbose, debug
LOGTAIL_SOURCE_TOKEN=your_better_stack_token    # Token from Better Stack dashboard
```

### Usage

```typescript
import logger from "./utils/logger";

// Use different log levels
logger.error("Error occurred", { errorDetails });
logger.warn("Warning situation", { details });
logger.info("Information", { data });
logger.http("HTTP request details", { request });
logger.debug("Debug information", { debugData });
```

### Features

- Request/response logging for Express
- Error tracking with stack traces
- Performance metrics
- TRPC request logging
- Context tracking across async operations
- Sanitization of sensitive data

## API Structure

The API is organized into the following routers:

- **Users**: User management and authentication
- **Organizations**: Organization management and settings
- **Conversations**: Chat conversation management
- **Messages**: Message handling and AI responses
- **Agents**: Agent definition and execution
- **Billing**: Subscription and usage management

## Serverless Deployment

### Vercel

For deployment to Vercel, use the included Vercel adapter in your API routes:

```typescript
// pages/api/trpc/[trpc].ts
import { nextApiHandler } from "@vernisai/api";

export default nextApiHandler;
```

### AWS Lambda

For deployment to AWS Lambda, use the included Lambda adapter:

```typescript
// lambda/api.ts
import { lambdaHandler } from "@vernisai/api";

export { lambdaHandler };
```

## Client Usage

Clients can consume the API using the generated TypeScript types:

```typescript
import { createTRPCClient } from "@trpc/client";
import type { AppRouter } from "@vernisai/api";

const client = createTRPCClient<AppRouter>({
  url: "https://app.vernis.ai/api/trpc",
});

// Type-safe API calls
client.users.getCurrentUser.query();
```
