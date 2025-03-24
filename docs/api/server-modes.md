# Server Mode Configuration

## Feature Overview

The VernisAI API is designed to operate in two distinct modes:

1. **Serverless Mode**: Optimized for deployment to serverless environments like AWS Lambda or Vercel Functions
2. **Server Mode**: Traditional Express server setup for local development or dedicated server deployment

This dual-mode architecture provides flexibility in deployment options while maintaining the same tRPC-based API across both environments. Developers can choose the mode that best fits their needs, whether for local development, testing, or production deployment.

## Architecture Overview

The API architecture has been extended to support both serverless and traditional server environments through a modular adapter system. The core tRPC implementation remains consistent across both modes, with adapters handling the environment-specific concerns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      API Configuration                      │
│          (Environment variables, feature flags)             │
│                                                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                        Core tRPC API                        │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │             │    │             │    │                 │  │
│  │    Router   │◄───┤  Procedures │◄───┤    Services     │  │
│  │             │    │             │    │                 │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│                                                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Deployment Adapters                     │
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│   │             │    │             │    │                 │ │
│   │    Vercel   │    │ AWS Lambda  │    │     Express     │ │
│   │             │    │             │    │                 │ │
│   └─────────────┘    └─────────────┘    └─────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Key Components and Modules

### 1. Environment Configuration

The system uses environment variables to determine the server mode and other configuration settings:

- `API_SERVER_MODE`: Controls whether the API runs in "serverless" or "server" mode
- Other configuration options like database connection strings, authentication settings, etc.

### 2. Core tRPC Implementation

The core tRPC implementation remains unchanged and includes:

- **Routers**: Define the API endpoints and their handlers
- **Procedures**: Define the input/output types and business logic
- **Context Creation**: Sets up the request context with authentication and other data

### 3. Deployment Adapters

Adapters handle the environment-specific concerns:

- **Vercel Adapter**: Handles Next.js API routes on Vercel
- **AWS Lambda Adapter**: Handles AWS API Gateway events
- **Express Adapter**: Provides a traditional Express server setup

## Implementation Details

### Environment Configuration

```typescript
// src/config.ts
export const config = {
  serverMode: process.env.API_SERVER_MODE || "server",
  port: process.env.API_PORT || 3001,
  // ... other configuration options
};
```

### Express Adapter Implementation

```typescript
// src/adapters/express.ts
import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../router";
import { createExpressContext } from "../trpc";
import { config } from "../config";

/**
 * Create an Express application with tRPC middleware
 */
export const createExpressApp = () => {
  const app = express();

  // Middleware
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

### Context Factory for Express

```typescript
// Extension to src/trpc.ts
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * Creates context for Express requests
 */
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

### Server Entry Point

```typescript
// src/server.ts
import { config } from "./config";
import { startExpressServer } from "./adapters/express";

if (config.serverMode === "server") {
  // Start Express server when running in server mode
  startExpressServer();
}
```

## Integration and Testing Strategy

### Local Development Setup

For local development, follow these steps:

1. Set the environment variable:

   ```
   API_SERVER_MODE=server
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Access the API at `http://localhost:3001/api/trpc`.

### Testing

The API can be tested in both modes:

1. **Unit Tests**: Test individual procedures and routers
2. **Integration Tests**:

   - Test with Express adapter for server mode
   - Test with serverless adapters for serverless mode

3. **End-to-End Tests**: Test the complete API flow in both modes

## Impact on Existing Architecture

The introduction of server mode has minimal impact on the existing architecture:

1. **No changes to existing serverless deployments**
2. **New Express adapter** for server mode
3. **Environment-based configuration** to determine the mode
4. **Consistent API behavior** across both modes

## Future Considerations

1. **Additional Server Options**: Support for other server frameworks like Fastify or Koa
2. **Containerization**: Docker configuration for server mode deployments
3. **Clustering**: Support for running multiple server instances for better scalability
4. **Middleware Enhancements**: Additional middleware options for Express mode
5. **Production Monitoring**: Integration with monitoring tools for server mode
