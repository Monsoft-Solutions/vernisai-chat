# VernisAI API Documentation

Welcome to the VernisAI API documentation. This documentation provides comprehensive information about the API architecture, implementation, and configuration options.

## Overview

The VernisAI API is built on tRPC and supports both serverless and server (Express) deployment modes. This dual-mode architecture provides flexibility for development, testing, and production deployment while maintaining a consistent API interface.

## Quick Links

- [Server Mode Configuration](./server-modes.md) - Overview of the server mode architecture and configuration
- [Implementation Guide](./implementation-guide.md) - Step-by-step guide for implementing Express server support
- [Configuration Reference](./configuration-reference.md) - Detailed reference for API configuration options
- [Server Mode Benefits and Use Cases](./server-mode-benefits.md) - Comparison of serverless and server modes

## Server Mode Architecture

The API is designed to operate in two distinct modes:

1. **Serverless Mode**: Optimized for deployment to serverless environments like AWS Lambda or Vercel Functions
2. **Server Mode**: Traditional Express server setup for local development or dedicated server deployment

This dual-mode architecture is controlled by a simple environment variable (`API_SERVER_MODE`), making it easy to switch between modes based on your development or deployment needs.

## Key Features

- **Type-Safe API**: End-to-end type safety with tRPC
- **Flexible Deployment**: Deploy to serverless environments or traditional servers
- **OpenAPI Integration**: Automatic OpenAPI documentation generation
- **Express Middleware**: Full access to Express middleware in server mode
- **Authentication**: Consistent authentication across both modes
- **Environment-Based Configuration**: Easy configuration through environment variables

## Getting Started

To get started with the VernisAI API, follow these steps:

1. Choose your server mode based on your requirements (see [Server Mode Benefits and Use Cases](./server-mode-benefits.md))
2. Configure your environment variables (see [Configuration Reference](./configuration-reference.md))
3. Implement the necessary changes (see [Implementation Guide](./implementation-guide.md))
4. Start developing with the API

## Example Usage

### Serverless Mode (Vercel)

```typescript
// pages/api/trpc/[trpc].ts
import { nextApiHandler } from "@vernisai/api";

export default nextApiHandler;
```

### Server Mode (Express)

```typescript
// server.ts
import { startServer } from "@vernisai/api";

// Start the Express server
startServer();
```

## Support and Feedback

If you have questions, feedback, or need assistance with the VernisAI API, please:

1. Open an issue in the GitHub repository
2. Contact the development team
3. Refer to the existing documentation

## Future Roadmap

The API will continue to evolve with new features and improvements:

1. **Additional Server Frameworks**: Support for other server frameworks like Fastify
2. **Enhanced Performance Optimization**: Advanced caching and connection pooling
3. **Extended Configuration Options**: More granular control over API behavior
4. **Docker Support**: Simplified containerization for server mode
