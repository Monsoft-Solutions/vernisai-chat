# @vernis/ai Tools System Implementation Plan

This document outlines the implementation strategy for the tools system in the `@vernis/ai` package. The implementation will follow best practices from Stripe's agent-toolkit and ensure compatibility with Vercel AI SDK.

## Overview

The tools system will enable AI assistants and agents to interact with external services and perform specialized tasks. We'll implement a flexible architecture that supports built-in tools, custom tools, and integration with external tool providers via MCP (Model Context Protocol).

## Inspiration and References

- [Stripe Agent Toolkit](https://github.com/stripe/agent-toolkit/tree/main/typescript/src/shared)
- [Stripe AI SDK Integration](https://github.com/stripe/agent-toolkit/tree/main/typescript/src/ai-sdk)
- [Vercel AI SDK Tools Documentation](https://sdk.vercel.ai/docs/foundations/tools)
- [Vercel AI SDK Core generateText](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-text)

## Implementation Phases

### Phase 1: Core Types and Interfaces

#### Files to Create:

1. `packages/ai/src/tools/types.ts`

   - Define core types for tool definitions using Zod schemas
   - Create interfaces for tool execution and registration
   - Define tool response formats

2. `packages/ai/src/tools/schemas.ts`

   - Implement Zod schema utilities for tool parameter validation
   - Create helper functions for common parameter patterns

3. `packages/ai/src/tools/registry.ts`
   - Implement tool registry for registering and retrieving tools
   - Create global registry singleton

### Phase 2: Tool Creation and Execution Framework

#### Files to Create:

4. `packages/ai/src/tools/createTool.ts`

   - Implement function to create valid tools with Zod schemas
   - Add validation logic for tool definitions
   - Support both synchronous and asynchronous tool execution

5. `packages/ai/src/tools/executor.ts`

   - Create tool execution engine
   - Implement error handling and timeout management
   - Support streaming results for long-running tools

6. `packages/ai/src/tools/index.ts`
   - Export all tool-related functions and types
   - Provide convenient API for tool registration and execution

### Phase 3: AI SDK Integration

#### Files to Create:

7. `packages/ai/src/tools/aiSdkAdapter.ts`

   - Create adapters to convert our tools to AI SDK compatible format
   - Implement function to transform tools for `generateText` and `streamText`
   - Add helper for streaming tool results

8. `packages/ai/src/tools/aisdk.ts`
   - Export functions for easy AI SDK integration
   - Create utility to convert our tool registry to AI SDK tools array

### Phase 4: Built-in Tools Implementation

#### Files to Create:

9. `packages/ai/src/tools/builtins/search.ts`

   - Implement web search tool using a search API
   - Create Zod schema for search parameters

10. `packages/ai/src/tools/builtins/knowledgeBase.ts`

    - Implement tools for querying the knowledge base
    - Add document retrieval functionality

11. `packages/ai/src/tools/builtins/contentGeneration.ts`

    - Implement content generation tools (email, social media posts, etc.)
    - Create schemas for content generation parameters

12. `packages/ai/src/tools/builtins/index.ts`
    - Export all built-in tools
    - Create enum for easy access to built-in tools

### Phase 5: MCP Integration

#### Files to Create:

13. `packages/ai/src/tools/mcp/client.ts`

    - Implement MCP client for accessing external tools
    - Create function to load tools from MCP-compatible servers

14. `packages/ai/src/tools/mcp/server.ts`

    - Create MCP server for exposing our tools to external consumers
    - Implement tool registration and execution endpoints

15. `packages/ai/src/tools/mcp/index.ts`
    - Export MCP-related functionality
    - Provide utilities for working with MCP tools

### Phase 6: Authentication and Security

#### Files to Create:

16. `packages/ai/src/tools/auth/providers.ts`

    - Implement authentication provider interfaces
    - Create basic auth provider implementations (API key, OAuth)

17. `packages/ai/src/tools/auth/credentials.ts`

    - Create secure credential storage utility
    - Implement secure token refresh handling

18. `packages/ai/src/tools/auth/index.ts`
    - Export auth-related functionality
    - Create utility functions for tool authentication

### Phase 7: Testing

#### Files to Create:

19. `packages/ai/tests/tools/createTool.test.ts`

- Test tool creation functionality
- Validate parameter validation works correctly

20. `packages/ai/tests/tools/executor.test.ts`

- Test tool execution flow
- Verify error handling works correctly

21. `packages/ai/tests/tools/aiSdkAdapter.test.ts`

- Test AI SDK integration
- Verify tools are correctly formatted for AI SDK

22. `packages/ai/tests/tools/builtins.test.ts`

- Test built-in tools functionality
- Mock external services for deterministic testing

### Files to Modify:

1. `packages/ai/src/index.ts`

   - Export tools functionality from the package

2. `packages/ai/src/types/tool.ts`

   - Update to use or reference Zod schemas
   - Modify existing tool types for compatibility

3. `packages/ai/package.json`
   - Add Zod as a dependency

## Detailed Implementation Approach

### 1. Core Tools Implementation

We'll begin by implementing the core tool types and interfaces. Our approach will:

- Use Zod for parameter validation to maintain type safety
- Define clear interfaces for tool creation and registration
- Create a central registry for tool discovery

```typescript
// Example of tool definition with Zod
import { z } from "zod";
import { createTool } from "@vernis/ai";

const searchTool = createTool({
  name: "search",
  description: "Search the web for information",
  parameters: z.object({
    query: z.string().describe("The search query"),
    numResults: z
      .number()
      .optional()
      .default(5)
      .describe("Number of results to return"),
  }),
  execute: async ({ query, numResults }) => {
    // Implementation of search functionality
    const results = await searchWebForResults(query, numResults);
    return results;
  },
});
```

### 2. AI SDK Integration

We'll ensure seamless integration with Vercel's AI SDK by:

- Creating adapter functions that convert our tools to AI SDK format
- Supporting both `generateText` and `streamText` functions
- Implementing proper error handling for AI SDK integration

```typescript
// Example of AI SDK integration
import { streamText } from "ai";
import { adaptToolsForAiSdk } from "@vernis/ai";

const tools = adaptToolsForAiSdk([searchTool, emailTool]);

const response = await streamText({
  model: "openai:gpt-4",
  messages: [
    { role: "user", content: "Search for information about AI tools" },
  ],
  tools,
});
```

### 3. MCP Integration

To support the Model Context Protocol (MCP), we'll:

- Implement client functionality to consume external MCP tools
- Create server capabilities to expose our tools as MCP endpoints
- Support authentication and security for MCP interactions

```typescript
// Example of MCP client usage
import { loadMcpTools } from "@vernis/ai";

const externalTools = await loadMcpTools({
  endpoint: "https://tools-provider.com/mcp",
  toolNames: ["weather", "calendar", "email"],
  authentication: {
    type: "apiKey",
    key: process.env.MCP_API_KEY,
  },
});

// Use these tools with our agents
const agent = createAgent({
  tools: [...builtInTools, ...externalTools],
  // other configuration
});
```

## Timeline and Dependencies

The implementation will be phased to allow for incremental testing and integration:

1. **Phase 1 (Core Types)**: 2 days

   - Dependencies: None

2. **Phase 2 (Creation Framework)**: 3 days

   - Dependencies: Phase 1

3. **Phase 3 (AI SDK Integration)**: 2 days

   - Dependencies: Phase 2

4. **Phase 4 (Built-in Tools)**: 3 days

   - Dependencies: Phase 2

5. **Phase 5 (MCP Integration)**: 3 days

   - Dependencies: Phase 2, Phase 3

6. **Phase 6 (Authentication)**: 2 days

   - Dependencies: Phase 2

7. **Phase 7 (Testing)**: 3 days
   - Dependencies: All previous phases

Total estimated time: ~18 days of development effort.

## Conclusion

This implementation plan provides a structured approach to developing a comprehensive tools system for the `@vernis/ai` package. By following industry best practices and ensuring compatibility with Vercel AI SDK, we'll create a flexible, extensible system that supports a wide range of AI assistant and agent capabilities.
