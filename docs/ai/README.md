# @vernis/ai

## Overview

The `@vernis/ai` package is a comprehensive AI library designed to power VernisAI's intelligent assistants and agent-based workflows. It provides a modular architecture for building conversational AI systems with both simple chat interfaces and complex, multi-step agent workflows.

## Key Features

- **Chat Assistant**: Conversational UI with context retention and short-term memory
- **Model Selection**: Pre-configured AI models optimized for different use cases (Speed, Smart, Genius, Reasoning)
- **Agent Framework**: Flexible workflow engine for creating specialized AI agents
- **Tool Integration**: Built-in tools and extensible architecture for custom tool development
- **Knowledge Base**: Integration with external data sources to provide context to AI assistants
- **Authentication**: OAuth-based credential management for third-party integrations
- **Observability**: Comprehensive logging and monitoring via Langfuse

## Architecture

This package is built on top of Vercel's [ai-sdk](https://sdk.vercel.ai/docs) and integrates with models from OpenAI and Anthropic. It also supports the Model Context Protocol (MCP) for standardized tool integration.

## Installation

```bash
npm install @vernis/ai
```

## Quick Start

```typescript
import { createChatAssistant, ModelConfig } from "@vernis/ai";

// Create a chat assistant with a specific model configuration
const assistant = createChatAssistant({
  model: ModelConfig.SMART,
  systemPrompt:
    "You are a helpful assistant that provides accurate information.",
});

// Start a conversation
const response = await assistant.chat({
  messages: [{ role: "user", content: "Hello, can you help me?" }],
});

console.log(response.content);
```

## Documentation

For detailed documentation, refer to the following guides:

- [Chat Assistant](./chat-assistant.md) - Building conversational interfaces
- [Model Configuration](./model-config.md) - Understanding model selection options
- [Memory Management](./memory.md) - Working with conversation context
- [Agent Framework](./agent-framework.md) - Creating multi-step workflows
- [Tools](./tools.md) - Integrating external tools and services
- [Authentication](./auth.md) - Managing credentials for external services
- [Knowledge Base](./knowledge-base.md) - Adding external context
- [Natural Agent Builder](./natural-agent-builder.md) - Creating agents with natural language
- [Observability](./observability.md) - Monitoring and logging

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this package.

## License

MIT
