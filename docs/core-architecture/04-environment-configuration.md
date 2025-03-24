# Environment Configuration

VernisAI Chat uses a centralized environment configuration system that powers all packages and applications in the monorepo. This document outlines how environment variables are managed, validated, and accessed across the project.

## Overview

The environment configuration is implemented in the `@monsoft/vernisai-config` package, which uses [Zod](https://github.com/colinhacks/zod) for runtime validation and type safety. This approach provides:

- Centralized configuration with a single source of truth
- Strong type safety with Zod validation
- Automatic validation of environment variables
- Descriptive error messages when configuration is invalid
- Sensible defaults for non-critical configuration options

## Configuration Structure

The configuration is organized into logical groups:

- **Database**: Database connection settings
- **API**: API server configuration (serverless/server mode, port, CORS, etc.)
- **Supabase**: Optional Supabase integration configuration
- **LangFuse**: Optional LangFuse observability configuration

## Environment Variables

The following environment variables can be set in your `.env.local` file:

| Variable              | Description                                     | Required | Default      |
| --------------------- | ----------------------------------------------- | :------: | ------------ |
| `DATABASE_URL`        | PostgreSQL connection string                    |    ✅    | -            |
| `API_SERVER_MODE`     | Server mode: `serverless` or `server`           |    ❌    | `serverless` |
| `API_PORT`            | Port number for server mode                     |    ❌    | `3001`       |
| `API_CORS_ORIGIN`     | CORS origin setting                             |    ❌    | `*`          |
| `API_TRPC_ENDPOINT`   | tRPC endpoint path                              |    ❌    | `/api/trpc`  |
| `LOG_LEVEL`           | Logging level: `debug`, `info`, `warn`, `error` |    ❌    | `info`       |
| `SUPABASE_URL`        | Supabase URL                                    |    ❌    | -            |
| `SUPABASE_KEY`        | Supabase API key                                |    ❌    | -            |
| `LANGFUSE_SECRET_KEY` | LangFuse secret key                             |    ❌    | -            |
| `LANGFUSE_PUBLIC_KEY` | LangFuse public key                             |    ❌    | -            |
| `LANGFUSE_HOST`       | LangFuse host URL                               |    ❌    | -            |

## Using Environment Configuration

### In API and Database Packages

The API and database packages use the environment configuration system automatically:

```typescript
// In packages/api/src/config.ts
import { env } from "@monsoft/vernisai-config";

export const config = env.api;
```

```typescript
// In packages/database/src/client.ts
import { env } from "@monsoft/vernisai-config";

// The validated database connection string
const connectionString = env.database.url;
```

### In Your Own Code

You can access the environment configuration from any part of the application:

```typescript
import { env } from "@monsoft/vernisai-config";

// Access database configuration
console.log(`Connected to database: ${env.database.url}`);

// Access API configuration
const serverMode = env.api.serverMode; // 'serverless' or 'server'
const port = env.api.port; // default: 3001

// Check for optional configurations
if (env.supabase) {
  // Supabase is configured
  const { url, key } = env.supabase;
}
```

## Environment Loading

The system automatically loads environment variables from:

1. `.env` file in the project root
2. `.env.local` file in the project root (overrides `.env`)
3. Environment variables set in the system (highest priority)

## Validation

All environment variables are validated against a Zod schema when the application starts. If required variables are missing or variables have incorrect formats, the application will fail to start with a detailed error message:

```
❌ Invalid environment variables:
{
  "database": {
    "url": [
      {
        "code": "too_small",
        "minimum": 1,
        "type": "string",
        "inclusive": true,
        "exact": false,
        "message": "DATABASE_URL is required",
        "path": []
      }
    ]
  }
}
```

## Adding New Environment Variables

To add new environment variables:

1. Update the types in `packages/config/src/types.ts`
2. Update the schema in `packages/config/src/schema.ts`
3. Update the environment mapping in `packages/config/src/index.ts`
4. Update `.env.local.example` with the new variable

## For Development and Testing

During development, you can use a local PostgreSQL database:

```
DATABASE_URL=postgresql://username:password@localhost:5432/vernisai_dev
```

For testing, you may want to use a separate test database:

```
DATABASE_URL=postgresql://username:password@localhost:5432/vernisai_test
```

## API Server Modes

The API can run in two modes:

### Serverless Mode

Suitable for deployment to platforms like Vercel or AWS Lambda:

```
API_SERVER_MODE=serverless
```

### Server Mode

Runs as a standalone Express server:

```
API_SERVER_MODE=server
API_PORT=3001
```

See [API Server Modes](./03-trpc-implementation.md) for more details on the differences between these modes.

## Advanced: Custom Environment Loading

For special cases such as testing, you can load environment variables from a specific file:

```typescript
import { loadEnv } from "@monsoft/vernisai-config";

// Load environment from .env.test file
const env = loadEnv(".env.test");
```
