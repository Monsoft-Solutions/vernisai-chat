# Implementation Guide: Adding Express Server Support

This guide provides step-by-step instructions for implementing Express server support for the VernisAI API, allowing it to run in either serverless or server mode.

## Prerequisites

- Node.js 18+ installed
- Familiarity with tRPC and Express
- Understanding of the existing VernisAI API structure

## Implementation Steps

### 1. Install Required Dependencies

Add Express and related packages to the API package:

```bash
cd packages/api
npm install express cors @trpc/server@10.44.1
npm install --save-dev @types/express @types/cors
```

### 2. Create Configuration Module

Create a configuration module to handle environment-based settings:

```typescript
// packages/api/src/config.ts

/**
 * API configuration options
 */
export interface ApiConfig {
  serverMode: "serverless" | "server";
  port: number;
  // Add other configuration options as needed
}

/**
 * Load and validate configuration from environment variables
 */
export const loadConfig = (): ApiConfig => {
  return {
    serverMode: (process.env.API_SERVER_MODE || "serverless") as
      | "serverless"
      | "server",
    port: parseInt(process.env.API_PORT || "3001", 10),
    // Load other configuration options as needed
  };
};

/**
 * Export config singleton
 */
export const config = loadConfig();
```

### 3. Create Express Adapter

Implement the Express adapter for server mode:

```typescript
// packages/api/src/adapters/express.ts

import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../router";
import { createTRPCContext, createInnerTRPCContext } from "../trpc";
import { config } from "../config";

/**
 * Create Express context for tRPC
 */
export const createExpressContext = (opts: any) => {
  const { req, res } = opts;

  // Extract authentication information
  const session = req.headers.authorization
    ? { userId: "extract-from-token" } // Replace with actual auth logic
    : null;

  // Extract organization ID from headers
  const organizationId = req.headers["x-organization-id"] as string | undefined;

  return createInnerTRPCContext({
    session,
    organizationId,
  });
};

/**
 * Create an Express application with tRPC middleware
 */
export const createExpressApp = () => {
  const app = express();

  // Apply middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // tRPC middleware
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: createExpressContext,
    }),
  );

  return app;
};

/**
 * Start the Express server
 */
export const startExpressServer = () => {
  const app = createExpressApp();
  const port = config.port;

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });

  return app;
};
```

### 4. Update tRPC Context

Extend the tRPC context types to support Express:

```typescript
// packages/api/src/trpc.ts

// Add imports
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

// Add export for Express context
export const createExpressContext = ({
  req,
  res,
}: CreateExpressContextOptions) => {
  // Extract authorization information from headers
  const session = req.headers.authorization
    ? { userId: "extract-from-auth-token" } // Replace with actual auth logic
    : null;

  // Extract organization ID from headers
  const organizationId = req.headers["x-organization-id"] as string | undefined;

  return createInnerTRPCContext({
    session,
    organizationId,
  });
};
```

### 5. Create Server Entry Point

Create a server entry point for running in server mode:

```typescript
// packages/api/src/server.ts

import { config } from "./config";
import { startExpressServer } from "./adapters/express";

/**
 * Start the server if running in server mode
 */
export const startServer = () => {
  if (config.serverMode === "server") {
    return startExpressServer();
  }
  return null;
};

// Auto-start if this file is executed directly
if (require.main === module) {
  startServer();
}
```

### 6. Update Package Exports

Update the API package exports to include the new server functionality:

```typescript
// packages/api/src/index.ts

/**
 * Export core tRPC components
 */
export * from "./trpc";

/**
 * Export routers
 */
export * from "./router";

/**
 * Export adapters
 */
export * from "./adapters/vercel";
export * from "./adapters/aws-lambda";
export * from "./adapters/express"; // Add Express adapter

/**
 * Export server
 */
export * from "./server";

/**
 * Export config
 */
export * from "./config";

/**
 * Export type for OpenAPI document
 */
export { generateOpenApiDocument } from "trpc-openapi";
```

### 7. Add Development Scripts

Update the package.json scripts to support server mode:

```json
{
  "scripts": {
    "build": "tsup",
    "clean": "rm -rf .turbo && rm -rf node_modules && rm -rf dist",
    "lint": "eslint src/",
    "dev": "tsup --watch",
    "dev:server": "cross-env API_SERVER_MODE=server tsx src/server.ts",
    "start:server": "cross-env API_SERVER_MODE=server node dist/server.js",
    "generate:openapi": "tsx src/scripts/generate-openapi.ts"
  }
}
```

### 8. Configure TypeScript Build

Update the tsup.config.ts file to include the server entry point:

```typescript
// packages/api/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/server.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
```

## Testing the Implementation

### Testing Server Mode

1. Start the API in server mode:

   ```bash
   cd packages/api
   npm run dev:server
   ```

2. Test the API endpoints:
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:3001/api/trpc/users.getCurrentUser
   ```

### Testing Serverless Mode

1. Deploy to Vercel or AWS Lambda as you would normally
2. Ensure the API_SERVER_MODE environment variable is set to 'serverless' or not set

## Conclusion

This implementation allows the VernisAI API to run in either serverless or server mode, providing flexibility for development and deployment. The Express adapter enables local development and testing without requiring a serverless runtime, while the existing serverless adapters continue to work for production deployments.

## Next Steps

1. **Authentication Integration**: Enhance the Express adapter to use the same authentication mechanism as the serverless adapters
2. **Environment-Specific Configuration**: Add more environment-specific configuration options for different deployment scenarios
3. **Docker Support**: Create Docker configuration for running the API in server mode
4. **CI/CD Integration**: Update CI/CD pipelines to test and deploy in both modes
