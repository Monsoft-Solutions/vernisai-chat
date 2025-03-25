# Chat Assistant

The Chat Assistant module provides a ChatGPT-like conversational interface with comprehensive conversation history management and short-term memory capabilities.

## Overview

This module offers a streamlined way to create AI-powered chat experiences with persistent context management. It handles:

- Conversation state management
- Short-term memory for improved contextual understanding
- Integration with various AI models (via model configurations)
- Streaming responses for real-time interaction

## Usage

### Basic Usage

```typescript
import { createChatAssistant, ModelConfig } from "@vernis/ai";

// Create a chat assistant with default configuration
const assistant = createChatAssistant({
  model: ModelConfig.SMART,
  systemPrompt: "You are a helpful assistant.",
});

// Get a response from the assistant
const response = await assistant.chat({
  messages: [{ role: "user", content: "What is the capital of France?" }],
});

console.log(response.content);
```

### Streaming Response

```typescript
import { createChatAssistant, ModelConfig } from "@vernis/ai";

const assistant = createChatAssistant({
  model: ModelConfig.SMART,
  systemPrompt: "You are a helpful assistant.",
});

// Stream the response
const stream = await assistant.chatStream({
  messages: [{ role: "user", content: "Tell me a long story about a dragon." }],
});

for await (const chunk of stream) {
  console.log(chunk.content);
}
```

### With Conversation History

```typescript
import { createChatAssistant, ModelConfig } from "@vernis/ai";

const assistant = createChatAssistant({
  model: ModelConfig.GENIUS,
  systemPrompt: "You are a helpful assistant.",
});

// Initialize a conversation
const conversation = assistant.createConversation();

// First message
await conversation.sendMessage("Hello, who are you?");

// Follow-up message (with conversation history maintained)
const response = await conversation.sendMessage("What can you do for me?");
console.log(response.content);
```

## API Reference

### `createChatAssistant(options)`

Creates a new chat assistant with the provided configuration.

#### Options

- `model`: The model configuration to use (from `ModelConfig`)
- `systemPrompt`: The system prompt that defines the assistant's behavior
- `temperature`: Controls randomness (0.0 to 1.0, default: 0.7)
- `maxTokens`: Maximum number of tokens to generate (default: varies by model)
- `memoryStrategy`: Memory management strategy (default: `'sliding-window'`)

#### Returns

Returns a `ChatAssistant` instance with the following methods:

- `chat({ messages }): Promise<ChatResponse>` - Get a single response
- `chatStream({ messages }): AsyncIterable<ChatChunk>` - Stream a response
- `createConversation(): Conversation` - Create a stateful conversation

### `Conversation` Class

Manages an ongoing conversation with history.

#### Methods

- `sendMessage(content: string): Promise<ChatResponse>` - Send a message and get response
- `sendMessageStream(content: string): AsyncIterable<ChatChunk>` - Send a message and stream response
- `getHistory(): Message[]` - Get the full conversation history
- `clearHistory(): void` - Clear conversation history

## Memory Management

By default, the chat assistant uses a sliding window approach to manage conversation history, retaining the most recent messages within the token limit.

For more details on memory management, see the [Memory Management](./memory.md) documentation.

## Related Documentation

- [Model Configuration](./model-config.md)
- [Memory Management](./memory.md)
- [Observability](./observability.md)
