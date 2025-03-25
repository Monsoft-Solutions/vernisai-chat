# Authentication

The `@vernis/ai` package includes a robust authentication system that allows tools to securely interact with external services requiring authentication.

## Overview

Many tools in the agent framework need to access external services that require authentication. The authentication module provides:

- Support for multiple authentication methods (API keys, OAuth, etc.)
- Secure credential storage
- Multi-account support for each service
- Automatic token refresh and management
- Simplified integration with tools

## Authentication Methods

### API Key Authentication

The simplest form of authentication using API keys or tokens:

```typescript
import { configureAuth, createAgent, BuiltInTools } from "@vernis/ai";

// Configure API key authentication
configureAuth({
  service: "openai",
  type: "api-key",
  credentials: {
    apiKey: process.env.OPENAI_API_KEY,
  },
});

// Use tools that require this authentication
const agent = createAgent({
  name: "Content Assistant",
  tools: [BuiltInTools.IMAGE_GENERATOR],
});
```

### Basic Authentication

For services that use username/password authentication:

```typescript
import { configureAuth } from "@vernis/ai";

configureAuth({
  service: "internal-api",
  type: "basic",
  credentials: {
    username: process.env.API_USERNAME,
    password: process.env.API_PASSWORD,
  },
});
```

### OAuth 2.0 Authentication

For services that use OAuth 2.0:

```typescript
import { configureAuth, OAuthFlowType } from "@vernis/ai";

// Configure OAuth 2.0
configureAuth({
  service: "google",
  type: "oauth2",
  credentials: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: "https://yourapp.com/oauth/callback",
    scopes: [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/calendar",
    ],
  },
  flowType: OAuthFlowType.AUTHORIZATION_CODE,
});
```

## Multi-Account Support

A key feature of the authentication system is support for multiple accounts per service:

```typescript
import { configureAuth, createAgent, BuiltInTools } from "@vernis/ai";

// Configure multiple accounts for the same service
configureAuth({
  service: "twitter",
  accountId: "company-account", // A unique identifier for this account
  type: "oauth2",
  credentials: {
    // OAuth credentials for company account
  },
});

configureAuth({
  service: "twitter",
  accountId: "personal-account",
  type: "oauth2",
  credentials: {
    // OAuth credentials for personal account
  },
});

// Specify which account to use when creating an agent
const marketingAgent = createAgent({
  name: "Marketing Assistant",
  tools: [BuiltInTools.SOCIAL_MEDIA_POST],
  defaultServiceAccounts: {
    twitter: "company-account",
  },
});

// Or specify at the workflow or step level
const workflow = defineWorkflow({
  steps: [
    {
      name: "post-announcement",
      tool: "social-media-post",
      serviceAccount: "twitter:company-account",
      inputMapping: {
        content: "{{generated-post}}",
      },
    },
    {
      name: "post-personal",
      tool: "social-media-post",
      serviceAccount: "twitter:personal-account",
      inputMapping: {
        content: "{{personal-message}}",
      },
    },
  ],
});
```

## User Authentication Flow

For applications that need to authenticate users' accounts:

```typescript
import { initiateUserAuth, completeUserAuth } from "@vernis/ai";

// Initiate OAuth flow for a user
const authUrl = await initiateUserAuth({
  service: "google",
  userId: "user-123", // Your system's user identifier
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
  redirectUri: "https://yourapp.com/oauth/callback",
});

// Redirect the user to authUrl to grant permissions

// When the user is redirected back to your application:
const result = await completeUserAuth({
  service: "google",
  userId: "user-123",
  code: "authorization-code-from-callback",
  redirectUri: "https://yourapp.com/oauth/callback",
});

// Now the user's account is authenticated and can be used by agents
```

## Credential Storage

By default, credentials are stored encrypted in memory, but for production use, you should configure a persistent storage adapter:

```typescript
import { configureAuthStorage, DatabaseStorageAdapter } from "@vernis/ai";

// Configure credential storage
configureAuthStorage({
  adapter: new DatabaseStorageAdapter({
    // Database connection details
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    // Encryption key for storing sensitive data
    encryptionKey: process.env.ENCRYPTION_KEY,
  }),
});
```

## Token Refresh and Management

OAuth tokens are automatically refreshed when they expire:

```typescript
import { configureAuth } from "@vernis/ai";

configureAuth({
  service: "microsoft",
  type: "oauth2",
  credentials: {
    // OAuth credentials
  },
  // Configure token refresh behavior
  tokenRefresh: {
    // Refresh when less than 10 minutes remain
    refreshThreshold: 10 * 60,
    // Maximum retry attempts
    maxRetries: 3,
    // Retry delay in milliseconds
    retryDelay: 1000,
  },
});
```

## Integration with Tools

Tools can specify their authentication requirements:

```typescript
import { createTool, ToolDefinition } from "@vernis/ai";

// Define a tool with authentication requirements
const emailTool: ToolDefinition = {
  name: "email-sender",
  // ... other tool properties

  // Authentication requirements
  authConfig: {
    // Required service
    service: "google",

    // Required scopes (for OAuth)
    scopes: ["https://www.googleapis.com/auth/gmail.send"],

    // Optional: fallback behavior if auth is missing
    missingAuthBehavior: "error", // or 'prompt', 'skip'
  },
};
```

When an agent uses this tool, the framework automatically ensures the appropriate credentials are available and applies them to the tool execution.

## Handling Authentication Errors

The framework provides tools for handling authentication issues:

```typescript
import { createAgent, AuthErrorHandling } from "@vernis/ai";

const agent = createAgent({
  // ...other configuration
  authErrorHandling: AuthErrorHandling.PROMPT_USER,
});

// Custom error handler
configureAuthErrorHandler((error, context) => {
  if (error.type === "token-expired") {
    // Custom handling for expired tokens
    return promptUserForReauthentication(context.service, context.accountId);
  }

  // Default handling for other errors
  return AuthErrorHandling.DEFAULT.handle(error, context);
});
```

## Security Considerations

The authentication system is designed with security in mind:

- Credentials are encrypted at rest
- Access tokens are never exposed in logs
- Sensitive values are redacted in error messages
- OAuth implementations follow security best practices
- Regular security audits and updates

## Related Documentation

- [Tools](./tools.md)
- [Agent Framework](./agent-framework.md)
