# VernisAI Config Package

This package provides centralized environment configuration management for all VernisAI packages and applications. It uses Zod for schema validation to ensure that required environment variables are present and correctly formatted.

## Features

- Automatically loads environment variables from `.env` and `.env.local` files
- Validates environment variables against a Zod schema
- Provides TypeScript types for environment configuration
- Throws helpful errors when required variables are missing or invalid
- Automatically finds the root directory of the project

## Installation

The package is included as a workspace dependency. You can add it to any package or app in the monorepo:

```bash
npm install @monsoft/vernisai-config
```

## Usage

### Basic Usage

Import the `env` object from the package to access validated environment configuration:

```typescript
import { env } from "@monsoft/vernisai-config";

// Access environment variables
const databaseUrl = env.database.url;
const apiPort = env.api.port;

// Use in your application
console.log(`Starting server on port ${apiPort}`);
```

### Using with TypeScript

The package includes TypeScript types for the environment configuration:

```typescript
import { Environment } from "@monsoft/vernisai-config";

// Use the Environment type in your functions
function initializeDatabase(config: Environment["database"]) {
  const { url } = config;
  // Connect to database using the URL
}
```

### Loading Custom Environment Files

You can load custom environment files with the `loadEnv` function:

```typescript
import { loadEnv } from "@monsoft/vernisai-config";

// Load environment from a custom file
const env = loadEnv(".env.test");
```

## Environment Variables

| Variable              | Description                                      | Required | Default      |
| --------------------- | ------------------------------------------------ | -------- | ------------ |
| `DATABASE_URL`        | PostgreSQL connection string                     | Yes      | -            |
| `API_SERVER_MODE`     | Server mode (`serverless` or `server`)           | No       | `serverless` |
| `API_PORT`            | Port number for server mode                      | No       | `3001`       |
| `API_CORS_ORIGIN`     | CORS origin setting                              | No       | `*`          |
| `API_TRPC_ENDPOINT`   | tRPC endpoint path                               | No       | `/api/trpc`  |
| `LOG_LEVEL`           | Logging level (`debug`, `info`, `warn`, `error`) | No       | `info`       |
| `SUPABASE_URL`        | Supabase URL                                     | No       | -            |
| `SUPABASE_KEY`        | Supabase API key                                 | No       | -            |
| `LANGFUSE_SECRET_KEY` | LangFuse secret key                              | No       | -            |
| `LANGFUSE_PUBLIC_KEY` | LangFuse public key                              | No       | -            |
| `LANGFUSE_HOST`       | LangFuse host URL                                | No       | -            |

## Configuration Schema

The package validates the environment variables against a schema defined using Zod. The schema ensures that:

- Required variables are present
- Variables have the correct format and type
- Default values are applied when variables are not provided

## Error Handling

If the environment variables don't match the schema, the package will throw a detailed error message:

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
