# System Logging Implementation

This document outlines the logging strategy for VernisAI Chat application, covering both client-side and server-side implementations.

## Overview

A comprehensive logging system is essential for:

- Tracking and debugging errors
- Monitoring system performance
- Understanding user behavior
- Ensuring system security
- Supporting compliance requirements

## Documentation Structure

For detailed implementation guides, refer to the following documentation:

1. [Client-Side Logging with Sentry](./client-side-logging.md)
2. [Server-Side Logging with Winston and Better Stack](./server-side-logging.md)

## Architecture Overview

The VernisAI Chat logging system consists of two main components:

1. **Client-Side Logging**: Implemented using Sentry to track front-end errors, performance issues, and user interactions in the browser.

2. **Server-Side Logging**: Implemented using the `@vernisai/logger` package with Winston integration and Better Stack transport for structured logging, centralized collection, and real-time monitoring.

## Unified Logger Package

The `@vernisai/logger` package provides a unified logging solution for all VernisAI applications. Key features include:

- **Transport Agnostic**: Built on Winston with a flexible transport system
- **Type Safety**: Comprehensive TypeScript typing for all interfaces
- **Context Management**: Request-scoped logging context using AsyncLocalStorage
- **Middleware Support**: Express and tRPC middleware for request/response logging
- **Security Features**: PII detection and data sanitization
- **Performance Monitoring**: Request latency tracking and error rate monitoring
- **Extensible Architecture**: Easy integration with additional log destinations

## Extending to Other Platforms

The `@vernisai/logger` package is designed to be easily extended to logging platforms beyond Better Stack (Logtail). To add a new logging destination:

1. **Create a Custom Transport**:

   ```typescript
   // Example of a custom transport for Elasticsearch
   import { ElasticsearchTransport } from "winston-elasticsearch";
   import { logger } from "@vernisai/logger";

   // Configure the transport
   const elasticsearchTransport = new ElasticsearchTransport({
     level: "info",
     clientOpts: { node: "http://localhost:9200" },
     indexPrefix: "vernisai-logs",
   });

   // Add the transport to the logger
   logger.addTransport(elasticsearchTransport);
   ```

2. **Configure Environment Variables**:

   ```
   # Add platform-specific variables to .env
   ELASTICSEARCH_URL=http://localhost:9200
   ELASTICSEARCH_INDEX_PREFIX=vernisai-logs
   ```

3. **Create a Transport Factory** (for reusable implementations):

   ```typescript
   // In your application's logger setup
   import { createLogger, addCustomTransports } from "@vernisai/logger";
   import { createElasticsearchTransport } from "./transports/elasticsearch";

   // Create the logger with default transports
   const logger = createLogger({
     service: "my-service",
     level: process.env.LOG_LEVEL || "info",
   });

   // Add custom transport if configured
   if (process.env.ELASTICSEARCH_URL) {
     const elasticsearchTransport = createElasticsearchTransport({
       url: process.env.ELASTICSEARCH_URL,
       indexPrefix: process.env.ELASTICSEARCH_INDEX_PREFIX,
     });
     logger.addTransport(elasticsearchTransport);
   }
   ```

### Supported Transport Integrations

The logger package can be extended to work with many popular logging platforms:

| Platform       | Transport Package             | Documentation Link                                                   |
| -------------- | ----------------------------- | -------------------------------------------------------------------- |
| Elasticsearch  | winston-elasticsearch         | [GitHub](https://github.com/vanthome/winston-elasticsearch)          |
| Datadog        | winston-datadog               | [GitHub](https://github.com/fireboy1919/winston-datadog)             |
| Splunk         | winston-splunk-httplogger     | [GitHub](https://github.com/adrianhesketh/winston-splunk-httplogger) |
| AWS CloudWatch | winston-cloudwatch            | [GitHub](https://github.com/lazywithclass/winston-cloudwatch)        |
| Google Cloud   | @google-cloud/logging-winston | [GitHub](https://github.com/googleapis/nodejs-logging-winston)       |
| MongoDB        | winston-mongodb               | [GitHub](https://github.com/winstonjs/winston-mongodb)               |
| Redis          | winston-redis                 | [GitHub](https://github.com/winstonjs/winston-redis)                 |
| Logstash       | winston-logstash              | [GitHub](https://github.com/vanthome/winston-logstash)               |

## Implementation Comparison

| Aspect             | Client-Side (Sentry)        | Server-Side (@vernisai/logger)        |
| ------------------ | --------------------------- | ------------------------------------- |
| Focus              | Browser errors, performance | API requests, application events      |
| Data Capture       | Stack traces, breadcrumbs   | Structured JSON logs with context     |
| User Context       | Browser, device, user info  | Session, auth context, request data   |
| Storage            | Sentry Cloud                | Better Stack Cloud (extensible)       |
| Retention          | Configurable in Sentry      | Configurable in Better Stack          |
| Analysis           | Sentry UI/Dashboard         | Better Stack UI/Dashboard             |
| Extensibility      | Sentry plugins              | Winston transports, custom formatters |
| Performance Impact | Minimal with sampling       | Configurable with async processing    |
| Security Features  | PII filtering               | Data sanitization, IP anonymization   |
| Middleware         | React error boundaries      | Express, tRPC middlewares             |

## Implementation Status

The logging system implementation is actively being enhanced:

- ✅ Client-side Sentry integration
- ✅ Server-side Winston logging
- ✅ Better Stack integration
- ✅ Express middleware for request logging
- ✅ tRPC middleware for API endpoint logging
- ✅ Unified logger package with configuration
- ✅ Context tracking with AsyncLocalStorage
- ✅ Basic PII detection and sanitization
- ⏳ Advanced security features (encryption, audit logging)
- ⏳ Comprehensive testing suite
- ⏳ Advanced log management features

See the [logger package implementation plan](../../implementation-plans/logger-package-and-improvements.md) for detailed status.
