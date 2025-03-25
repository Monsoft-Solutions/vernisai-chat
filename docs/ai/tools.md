# Tools

The `@vernis/ai` package includes a comprehensive tools system that allows agents to interact with external services and perform specialized tasks.

## Overview

Tools represent capabilities that agents can use during their workflows. Each tool is a discrete function with defined inputs and outputs that can be invoked by an agent during execution. The `@vernis/ai` package supports both built-in tools and custom tools, along with integration with external tool providers via the Model Context Protocol (MCP).

## Tool Architecture

Tools in the `@vernis/ai` package follow a standardized architecture:

1. **Tool Definition**: Specifies the tool's capabilities, parameters, and execution logic
2. **Tool Registry**: A central registry for discovering and accessing available tools
3. **Tool Execution**: The actual invocation of a tool with parameters and returning results
4. **Tool Authentication**: Management of credentials for tools that require authentication

## Built-in Tools

The package includes several built-in tools ready for immediate use:

### Information Retrieval

```typescript
import { createAgent, BuiltInTools } from "@vernis/ai";

const agent = createAgent({
  // ...other configuration
  tools: [
    BuiltInTools.SEARCH, // Web search capability
    BuiltInTools.DOCUMENT_QUERY, // Query documents in knowledge base
    BuiltInTools.NEWS_SEARCH, // Search recent news articles
  ],
});
```

### Content Processing

```typescript
import { createAgent, BuiltInTools } from "@vernis/ai";

const agent = createAgent({
  // ...other configuration
  tools: [
    BuiltInTools.SUMMARIZE, // Generate summaries of longer content
    BuiltInTools.CONTENT_ANALYZE, // Extract insights from text content
    BuiltInTools.TRANSLATE, // Translate content between languages
  ],
});
```

### Content Generation

```typescript
import { createAgent, BuiltInTools } from "@vernis/ai";

const agent = createAgent({
  // ...other configuration
  tools: [
    BuiltInTools.EMAIL_COMPOSER, // Compose email messages
    BuiltInTools.SOCIAL_MEDIA_POST, // Create social media content
    BuiltInTools.BLOG_POST_GENERATOR, // Generate blog post drafts
    BuiltInTools.IMAGE_GENERATOR, // Generate images from text descriptions
  ],
});
```

### Integration Tools

```typescript
import { createAgent, BuiltInTools } from "@vernis/ai";

const agent = createAgent({
  // ...other configuration
  tools: [
    BuiltInTools.EMAIL_SENDER, // Send emails via configured providers
    BuiltInTools.CALENDAR_MANAGER, // Manage calendar events
    BuiltInTools.SMS_SENDER, // Send SMS messages
    BuiltInTools.SLACK_MESSENGER, // Post messages to Slack
  ],
});
```

## Custom Tool Development

You can create custom tools for your specific needs:

```typescript
import { createTool, ToolDefinition } from "@vernis/ai";

// Define a custom database query tool
const databaseQueryTool: ToolDefinition = {
  name: "database-query",
  description: "Executes a SQL query against the company database",
  parameters: {
    query: {
      type: "string",
      description: "SQL query to execute (SELECT only)",
      required: true,
    },
    database: {
      type: "string",
      enum: ["customers", "orders", "products"],
      description: "Database to query",
      required: true,
    },
    maxRows: {
      type: "number",
      description: "Maximum number of rows to return",
      default: 100,
      required: false,
    },
  },
  execute: async ({ query, database, maxRows }) => {
    // Implementation to execute database query
    // This is where you'd connect to your database and run the query
    const results = await executeDbQuery(query, database, maxRows);
    return results;
  },
  // Optional: Configure authentication requirements
  authConfig: {
    requires: "database-credentials",
    scopes: ["read"],
  },
};

// Register the tool
const DatabaseQueryTool = createTool(databaseQueryTool);

// Use the custom tool
const agent = createAgent({
  // ...other configuration
  tools: [BuiltInTools.SUMMARIZE, DatabaseQueryTool],
});
```

## Model Context Protocol (MCP) Integration

The `@vernis/ai` package supports the Model Context Protocol (MCP) for standardized integration with external tool providers.

### Using MCP Tools

```typescript
import { createAgent, loadMcpTools } from "@vernis/ai";

// Load tools from an MCP-compatible provider
const mcpTools = await loadMcpTools({
  providerUrl: "https://mcp-provider.example.com",
  toolNames: ["weather", "stocks", "news"],
  // Authentication if required
  authToken: process.env.MCP_PROVIDER_TOKEN,
});

// Create an agent with MCP tools
const agent = createAgent({
  // ...other configuration
  tools: [...mcpTools, BuiltInTools.SUMMARIZE],
});
```

### Creating MCP-Compatible Tools

You can also expose your custom tools as MCP-compatible endpoints:

```typescript
import { createMcpServer, registerTool } from "@vernis/ai/mcp";

// Register your tools with the MCP server
registerTool(DatabaseQueryTool);
registerTool(WeatherTool);

// Start the MCP server
const mcpServer = createMcpServer({
  port: 3000,
  authStrategy: "api-key", // Options: 'none', 'api-key', 'oauth'
  corsOrigins: ["https://allowed-origin.com"],
});

mcpServer.start();
```

## Tool Authentication

Many tools require authentication to external services. The `@vernis/ai` package provides a comprehensive credential management system:

```typescript
import { createAgent, BuiltInTools, configureToolAuth } from "@vernis/ai";

// Configure authentication for a tool
configureToolAuth({
  toolName: "email-sender",
  provider: "gmail",
  credentials: {
    // Option 1: API key or service account
    apiKey: process.env.GMAIL_API_KEY,

    // Option 2: OAuth
    oauth: {
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      redirectUri: "https://yourapp.com/oauth/callback",
      scopes: ["https://www.googleapis.com/auth/gmail.send"],
    },
  },
});

// The agent will now be able to use the authenticated tool
const agent = createAgent({
  // ...other configuration
  tools: [BuiltInTools.EMAIL_SENDER],
});
```

For more details on authentication, see the [Auth documentation](./auth.md).

## Tool Response Handling

Tools return structured responses that can be processed by agents:

```typescript
// Example tool response structure
{
  status: 'success', // or 'error', 'partial'
  data: {
    // Tool-specific response data
  },
  metadata: {
    executionTime: 235, // ms
    rateLimit: {
      remaining: 95,
      reset: 1621459200000
    }
  },
  error: null // Error information if status is 'error'
}
```

Agents can access this information during workflow execution:

```typescript
const workflow = defineWorkflow({
  steps: [
    {
      name: "search-step",
      tool: "search",
      inputMapping: {
        query: "{{task}}",
      },
    },
    {
      name: "process-results",
      tool: "summarize",
      inputMapping: {
        // Access previous step's response data
        content: "{{search-step.data.results}}",
        // Conditionally adjust behavior based on metadata
        length: '{{search-step.metadata.resultCount > 10 ? "long" : "short"}}',
      },
    },
  ],
});
```

## Tool Policies and Safeguards

The `@vernis/ai` package includes configurable policies to ensure safe tool usage:

```typescript
import { createAgent, ToolPolicies } from "@vernis/ai";

// Create an agent with tool usage policies
const agent = createAgent({
  // ...other configuration
  toolPolicies: {
    // Restrict sensitive tools
    emailSender: ToolPolicies.REQUIRE_CONFIRMATION,
    databaseQuery: ToolPolicies.RESTRICT_PARAMETERS({
      query: {
        pattern: /^SELECT\s+(?!.*(?:DROP|DELETE|UPDATE|INSERT))/i,
        errorMessage: "Only SELECT queries are allowed",
      },
    }),
    // Apply general policies
    rateLimit: {
      windowMs: 60000, // 1 minute
      maxRequests: 10,
    },
    logging: {
      level: "info",
      sensitiveParams: ["apiKey", "password", "token"],
    },
  },
});
```

## Related Documentation

- [Agent Framework](./agent-framework.md)
- [Auth](./auth.md)
- [Knowledge Base](./knowledge-base.md)
