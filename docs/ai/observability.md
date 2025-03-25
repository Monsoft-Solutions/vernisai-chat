# Observability with Langfuse

The `@vernis/ai` package integrates with Langfuse to provide comprehensive monitoring, logging, and observability for all AI components.

## Overview

Observability is critical for AI systems to track performance, detect issues, and understand user interactions. The `@vernis/ai` package uses [Langfuse](https://langfuse.com/) to provide detailed insights into all AI operations, from simple chat messages to complex agent workflows.

## Langfuse Integration

Langfuse is a dedicated observability platform for LLM applications that provides:

- Detailed tracing of all AI interactions
- Performance metrics and cost tracking
- Error monitoring and alerting
- User feedback collection
- Prompt and response analysis

The integration is seamless and requires minimal configuration while providing comprehensive visibility into your AI operations.

## Setup

### Basic Setup

```typescript
import { configureObservability } from "@vernis/ai";

// Configure Langfuse integration
configureObservability({
  provider: "langfuse",
  config: {
    // Langfuse credentials
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    // Optional: custom Langfuse host if self-hosting
    host: process.env.LANGFUSE_HOST || "https://cloud.langfuse.com",
  },
  // Optional: global tags for all traces
  globalTags: {
    environment: process.env.NODE_ENV,
    application: "my-ai-app",
  },
});
```

### Advanced Configuration

```typescript
import { configureObservability, LogLevel } from "@vernis/ai";

// Advanced configuration
configureObservability({
  provider: "langfuse",
  config: {
    // Langfuse credentials
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.LANGFUSE_SECRET_KEY,

    // Custom configuration
    flushAt: 20, // Batch size for sending events
    flushInterval: 5000, // Flush interval in ms

    // Control what gets logged
    logLevel: LogLevel.DEBUG,

    // Specify sensitive information patterns to redact
    redactPatterns: [
      /\b(?:\d[ -]*?){13,16}\b/, // Credit card numbers
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Email addresses
    ],
  },
});
```

## Vercel AI SDK Integration

The `@vernis/ai` package automatically integrates Langfuse with the Vercel AI SDK to track all AI interactions. This is implemented using Vercel's tracing hooks.

### Auto-Traced Components

When using the `@vernis/ai` package with Langfuse configured, these actions are automatically traced:

- All chat completions (messages and responses)
- Model configurations and parameters
- Streaming events
- Token usage and costs
- Error states and retries

### Implementation Example

```typescript
import { createChatAssistant, ModelConfig } from "@vernis/ai";

// Create a chat assistant (Langfuse tracing automatically applied)
const assistant = createChatAssistant({
  model: ModelConfig.SMART,
  systemPrompt: "You are a helpful assistant.",
});

// All interactions will be traced
const response = await assistant.chat({
  messages: [{ role: "user", content: "Tell me about AI observability." }],
});
```

Behind the scenes, the integration works by using Vercel AI SDK's tracing hooks:

```typescript
// This happens internally within the @vernis/ai package
import { StreamingTextResponse, experimental_StreamingReactResponse } from "ai";
import { langfuse } from "langfuse-js";

// Create Langfuse tracer for Vercel AI SDK
const tracer = new LangfuseTracer({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
});

// Apply tracing to streaming responses
const streamingResponse = new StreamingTextResponse(
  stream,
  {},
  {
    tracer, // Automatically traces all stream events
  },
);
```

## Manual Tracing

In addition to automatic tracing, you can add custom tracing:

```typescript
import { trace, createChatAssistant } from "@vernis/ai";

// Create a custom trace
const customTrace = trace.createTrace({
  name: "customer-support-session",
  userId: "user-123",
  metadata: {
    topic: "billing-issue",
    priority: "high",
  },
});

// Record a span within the trace
const searchSpan = customTrace.createSpan({
  name: "knowledge-base-search",
  input: { query: "billing refund policy" },
});

// Perform the actual search
const searchResults = await knowledgeBase.search("billing refund policy");

// Complete the span with results
searchSpan.end({
  output: searchResults,
  metadata: {
    resultCount: searchResults.length,
    executionTime: 350, // ms
  },
});

// Use the assistant within the trace context
const assistant = createChatAssistant({
  model: ModelConfig.SMART,
  traceId: customTrace.id, // Link assistant activity to this trace
});

// Later, complete the trace
customTrace.end({
  metadata: {
    resolved: true,
    resolutionTime: 245000, // ms
  },
});
```

## Agent Workflow Tracing

For agents with multi-step workflows, Langfuse provides detailed tracing of each step:

```typescript
import { createAgent, defineWorkflow } from "@vernis/ai";

// Define a workflow (tracing is automatically integrated)
const workflow = defineWorkflow({
  steps: [
    {
      name: "search",
      tool: "search",
      // ...
    },
    {
      name: "analyze",
      tool: "content-analysis",
      // ...
    },
  ],
});

// Create and execute the agent
const agent = createAgent({
  workflow,
  // ...
});

// Execute (all steps will be traced automatically)
const result = await agent.execute({
  task: "Research market trends",
});
```

In the Langfuse UI, you'll see:

- The full agent execution trace
- Individual spans for each workflow step
- Inputs and outputs for each step
- Execution time and token usage
- Any errors or retries

## Feedback Collection

Collect user feedback on AI responses:

```typescript
import { recordFeedback } from "@vernis/ai";

// After receiving a response from the assistant
const response = await assistant.chat({
  messages: [{ role: "user", content: "Generate a marketing plan." }],
});

// Later, record user feedback
await recordFeedback({
  traceId: response.traceId,
  score: 0.8, // 0.0 to 1.0
  comment: "Good plan but missed social media strategy",
  tags: ["marketing", "business-plan"],
});
```

## Custom Events

Record custom events for specific monitoring needs:

```typescript
import { recordEvent } from "@vernis/ai";

// Record a custom event
await recordEvent({
  name: "user-converted",
  traceId: currentTraceId,
  metadata: {
    conversionType: "premium-subscription",
    value: 99.99,
  },
});
```

## Accessing the Dashboard

Once configured, you can view all traces, metrics, and analytics in the Langfuse dashboard:

1. Visit your Langfuse instance (cloud or self-hosted)
2. Log in with your credentials
3. Navigate through traces, sessions, and analytics

The dashboard provides:

- Real-time monitoring of AI activities
- Detailed trace views with all steps and spans
- Cost and performance analytics
- Error reporting and alerting
- User feedback collection and analysis

## Best Practices

1. **Use Consistent Naming**: Adopt a consistent naming convention for traces and spans
2. **Add Context**: Include relevant metadata with traces to enable better filtering
3. **Tag Production vs. Development**: Always tag traces with the environment
4. **Track User Context**: When possible, include anonymized user identifiers to track user experiences
5. **Monitor Costs**: Use Langfuse analytics to track and optimize token usage and costs

## Related Documentation

- [Official Langfuse Vercel AI SDK Integration Documentation](https://langfuse.com/docs/integrations/vercel-ai-sdk)
- [Langfuse Homepage](https://langfuse.com/)
- [Chat Assistant](./chat-assistant.md)
- [Agent Framework](./agent-framework.md)
