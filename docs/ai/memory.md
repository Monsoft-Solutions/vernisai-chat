# Memory Management

This document details the memory management strategies available in the `@vernis/ai` package for handling conversation history and context.

## Overview

Effective memory management is crucial for AI assistants to maintain context across multiple conversation turns. The `@vernis/ai` package provides several strategies for managing conversation history, optimizing for both context retention and token efficiency.

## Memory Strategies

### Sliding Window

The default memory strategy uses a sliding window approach to maintain the most recent conversation history while respecting token limits.

```typescript
import { createChatAssistant, ModelConfig, MemoryStrategy } from "@vernis/ai";

const assistant = createChatAssistant({
  model: ModelConfig.SMART,
  memoryStrategy: MemoryStrategy.SLIDING_WINDOW,
  // Optional: Configure window size (defaults to model's context limit)
  slidingWindowSize: 4000,
});
```

**How it works:**

1. Maintains a fixed-size window of the most recent messages
2. When the window fills up, older messages are dropped first
3. Prioritizes maintaining complete recent exchanges over partial older ones

**Best for:**

- General-purpose conversations
- When recency of information is most important

### Summarization

This strategy periodically summarizes older parts of the conversation to compress them while retaining key information.

```typescript
import { createChatAssistant, ModelConfig, MemoryStrategy } from "@vernis/ai";

const assistant = createChatAssistant({
  model: ModelConfig.GENIUS,
  memoryStrategy: MemoryStrategy.SUMMARIZATION,
  // Optional: Configure when summarization triggers
  summarizationThreshold: 6000,
});
```

**How it works:**

1. When conversation history exceeds a threshold, older messages are summarized
2. The summary replaces the original messages, reducing token count
3. The most recent messages remain intact for full context

**Best for:**

- Long, information-dense conversations
- When historical context is important but complete verbatim history isn't needed

### Key Points Extraction

This strategy focuses on extracting and retaining only the most salient information from the conversation.

```typescript
import { createChatAssistant, ModelConfig, MemoryStrategy } from "@vernis/ai";

const assistant = createChatAssistant({
  model: ModelConfig.SMART,
  memoryStrategy: MemoryStrategy.KEY_POINTS,
  // Optional: Configure maximum number of key points to retain
  maxKeyPoints: 15,
});
```

**How it works:**

1. Analyzes conversation to identify key points, facts, and decisions
2. Maintains a running list of these key points
3. Uses less token space than full conversation history
4. Prioritizes important information over conversation flow

**Best for:**

- Task-oriented conversations where facts and decisions matter more than exact dialogue
- When token efficiency is critical

### Episodic Memory

This advanced strategy categorizes conversation segments into "episodes" and maintains a hierarchical memory structure.

```typescript
import { createChatAssistant, ModelConfig, MemoryStrategy } from "@vernis/ai";

const assistant = createChatAssistant({
  model: ModelConfig.GENIUS,
  memoryStrategy: MemoryStrategy.EPISODIC,
});
```

**How it works:**

1. Segments conversation into topical "episodes"
2. Maintains short summaries of each episode
3. Keeps full details of the current episode
4. Dynamically retrieves relevant past episodes when needed

**Best for:**

- Complex conversations that span multiple topics
- Interactions that may return to previous subjects

## Custom Memory Strategy

You can also implement a custom memory strategy by extending the `MemoryManager` interface:

```typescript
import { createChatAssistant, MemoryManager } from "@vernis/ai";

class CustomMemoryStrategy implements MemoryManager {
  constructor(private maxTokens: number) {}

  addMessage(message: Message): void {
    // Custom logic to add a message
  }

  getContextMessages(): Message[] {
    // Custom logic to retrieve messages for context
  }

  clear(): void {
    // Custom logic to clear memory
  }
}

const myMemory = new CustomMemoryStrategy(4000);

const assistant = createChatAssistant({
  model: ModelConfig.SMART,
  memoryStrategy: myMemory,
});
```

## Token Management

All memory strategies are aware of token limits and implement techniques to stay within the model's context window:

- **Token Counting**: Messages are tokenized to accurately track token usage
- **Prioritization**: Important messages (like system prompts) are preserved
- **Adaptive Compression**: Memory strategies adjust based on conversation length and model limits

## Persistent Storage

For applications that require conversation persistence across sessions:

```typescript
import {
  createChatAssistant,
  ModelConfig,
  createPersistentMemory,
} from "@vernis/ai";

// Create a persistent memory store (requires a storage adapter)
const persistentMemory = createPersistentMemory({
  strategy: MemoryStrategy.SLIDING_WINDOW,
  storageAdapter: new DatabaseStorageAdapter({
    // Database configuration
  }),
});

const assistant = createChatAssistant({
  model: ModelConfig.SMART,
  memoryStrategy: persistentMemory,
});

// Later, retrieve the conversation using an ID
const conversation = await assistant.loadConversation("conversation-id-123");
```

## Memory Strategy Selection

When choosing a memory strategy, consider:

1. **Conversation Length**: How long are typical conversations?
2. **Information Density**: How important is each detail in the conversation?
3. **Context Requirements**: Do later turns need full details of earlier ones?
4. **Token Efficiency**: How concerned are you with token usage costs?

## Related Documentation

- [Chat Assistant](./chat-assistant.md)
- [Model Configuration](./model-config.md)
- [Agent Framework](./agent-framework.md)
