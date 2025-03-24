# Configuration Reference

This document provides a reference for configuring the VernisAI API to run in either serverless or server mode.

## Environment Variables

The VernisAI API uses the following environment variables for configuration:

| Variable            | Description                                                      | Default        | Required |
| ------------------- | ---------------------------------------------------------------- | -------------- | -------- |
| `API_SERVER_MODE`   | Determines whether the API runs in "serverless" or "server" mode | `"serverless"` | No       |
| `API_PORT`          | The port on which the Express server listens in server mode      | `3001`         | No       |
| `API_CORS_ORIGIN`   | CORS origin setting for server mode                              | `"*"`          | No       |
| `API_TRPC_ENDPOINT` | The endpoint path for tRPC                                       | `"/api/trpc"`  | No       |
| `LOG_LEVEL`         | Logging level (debug, info, warn, error)                         | `"info"`       | No       |

## Configuration File

You can also provide a configuration file for more advanced settings. Create a file named `api-config.json` in the root of your project:

```json
{
  "serverMode": "server",
  "port": 3001,
  "cors": {
    "origin": ["http://localhost:3000", "https://app.vernisai.com"],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "allowedHeaders": ["Content-Type", "Authorization", "x-organization-id"]
  },
  "logging": {
    "level": "debug",
    "format": "json"
  },
  "openApi": {
    "enabled": true,
    "path": "/api/openapi.json"
  }
}
```

## Server Mode Options

### Serverless Mode

In serverless mode, the API is designed to run in environments like Vercel or AWS Lambda. The following configurations are supported:

- **Vercel**: Uses the Next.js API handler
- **AWS Lambda**: Uses the Lambda handler

Example `.env.local` for serverless mode:

```
API_SERVER_MODE=serverless
```

### Server Mode

In server mode, the API runs as a standalone Express server. This is useful for local development and dedicated server deployment.

Example `.env.local` for server mode:

```
API_SERVER_MODE=server
API_PORT=3001
API_CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

## TypeScript Interface

The configuration is typed using the following TypeScript interface:

```typescript
/**
 * API configuration options
 */
export interface ApiConfig {
  /**
   * Server mode - determines how the API is deployed and run
   */
  serverMode: "serverless" | "server";

  /**
   * Port for Express server when running in server mode
   */
  port: number;

  /**
   * CORS configuration for server mode
   */
  cors: {
    /**
     * Allowed origins
     */
    origin: string | string[];

    /**
     * Allowed HTTP methods
     */
    methods: string[];

    /**
     * Allowed headers
     */
    allowedHeaders: string[];
  };

  /**
   * Logging configuration
   */
  logging: {
    /**
     * Logging level
     */
    level: "debug" | "info" | "warn" | "error";

    /**
     * Logging format
     */
    format: "json" | "pretty";
  };

  /**
   * OpenAPI configuration
   */
  openApi: {
    /**
     * Whether OpenAPI documentation is enabled
     */
    enabled: boolean;

    /**
     * Path to serve OpenAPI JSON
     */
    path: string;
  };
}
```

## Usage Examples

### Setting Configuration Programmatically

If you need to set configuration programmatically, you can use the `ApiConfig` interface and the `config` object:

```typescript
import { config } from "@vernisai/api";

// Override config settings
Object.assign(config, {
  serverMode: "server",
  port: 4000,
  cors: {
    origin: "https://mydomain.com",
  },
});
```

### Using Configuration in Custom Server

If you're implementing a custom server, you can use the configuration as follows:

```typescript
import express from "express";
import { createExpressApp, config } from "@vernisai/api";

const app = createExpressApp();

// Add custom middleware
app.use("/custom", (req, res) => {
  res.json({ message: "Custom endpoint" });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});
```

## Default Configuration

The default configuration values are designed to work out of the box for most use cases:

```typescript
const defaultConfig: ApiConfig = {
  serverMode: "serverless",
  port: 3001,
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-organization-id"],
  },
  logging: {
    level: "info",
    format: "pretty",
  },
  openApi: {
    enabled: true,
    path: "/api/openapi.json",
  },
};
```
