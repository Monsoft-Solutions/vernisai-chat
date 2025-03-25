# @vernis/ai

A comprehensive AI library designed to power VernisAI's intelligent assistants and agent-based workflows.

## Features

- **Chat Assistant**: Conversational UI with context retention and short-term memory
- **Model Selection**: Pre-configured AI models optimized for different use cases
- **Agent Framework**: Flexible workflow engine for creating specialized AI agents
- **Tool Integration**: Built-in tools and extensible architecture for custom tool development
- **Knowledge Base**: Integration with external data sources to provide context to AI assistants
- **Authentication**: OAuth-based credential management for third-party integrations
- **Observability**: Comprehensive logging and monitoring via Langfuse

## Installation

```bash
npm install @vernis/ai
```

## Usage

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

For detailed documentation, refer to the documentation in the `docs/ai` directory.

## License

MIT
