# Model Configuration

This document outlines the different model configurations available in the `@vernis/ai` package and how to use them effectively.

## Overview

The `@vernis/ai` package provides four pre-configured model options, each optimized for different use cases:

1. **Speed** - Optimized for fast response times
2. **Smart** - Balanced performance for general-purpose use
3. **Genius** - Enhanced capabilities for complex tasks
4. **Reasoning** - Specialized for logical reasoning and problem solving

Each configuration automatically selects the appropriate underlying model (from OpenAI or Anthropic) and sets optimal parameters for the intended use case.

## Model Options

### Speed

The `Speed` configuration prioritizes response time over depth and complexity, making it ideal for:

- Quick factual answers
- Short-form content generation
- Real-time chatbots with high throughput requirements

```typescript
import { createChatAssistant, ModelConfig } from "@vernis/ai";

const assistant = createChatAssistant({
  model: ModelConfig.SPEED,
  systemPrompt: "You provide quick, concise answers.",
});
```

**Technical Details:**

- Model: OpenAI GPT-3.5 Turbo
- Temperature: 0.7
- Token Context: 4,000 tokens
- Response Time: Very fast

### Smart

The `Smart` configuration balances speed and capability, making it suitable for:

- General-purpose assistance
- Content generation with moderate complexity
- Multi-turn conversations with context retention

```typescript
import { createChatAssistant, ModelConfig } from "@vernis/ai";

const assistant = createChatAssistant({
  model: ModelConfig.SMART,
  systemPrompt: "You are a helpful assistant.",
});
```

**Technical Details:**

- Model: OpenAI GPT-4 Turbo (or equivalent)
- Temperature: 0.7
- Token Context: 8,000 tokens
- Response Time: Moderate

### Genius

The `Genius` configuration prioritizes advanced capabilities and deeper reasoning:

- Complex problem solving
- In-depth research assistance
- Creative content generation
- Code generation and analysis

```typescript
import { createChatAssistant, ModelConfig } from "@vernis/ai";

const assistant = createChatAssistant({
  model: ModelConfig.GENIUS,
  systemPrompt: "You provide thoughtful, comprehensive answers.",
});
```

**Technical Details:**

- Model: Anthropic Claude 3.7 Sonnet (or equivalent)
- Temperature: 0.7
- Token Context: 32,000 tokens
- Response Time: Slower

### Reasoning

The `Reasoning` configuration specializes in logical reasoning and structured problem solving:

- Step-by-step problem decomposition
- Decision making with explicit reasoning
- Mathematical and logical analyses
- Detailed explanations of complex concepts

```typescript
import { createChatAssistant, ModelConfig } from "@vernis/ai";

const assistant = createChatAssistant({
  model: ModelConfig.REASONING,
  systemPrompt: "You solve problems step-by-step with clear reasoning.",
});
```

**Technical Details:**

- Model: Anthropic Claude 3 Sonnet with specialized reasoning prompts
- Temperature: 0.3 (lower for more deterministic outputs)
- Token Context: 16,000 tokens
- Response Time: Moderate to slow

## Custom Configuration

While the pre-configured options cover most use cases, you can also create custom configurations:

```typescript
import { createChatAssistant, createModelConfig } from "@vernis/ai";

const customModel = createModelConfig({
  provider: "openai",
  modelName: "gpt-4-turbo",
  temperature: 0.5,
  maxTokens: 1000,
  contextWindow: 8000,
});

const assistant = createChatAssistant({
  model: customModel,
  systemPrompt: "Custom assistant configuration.",
});
```

## Model Selection Guidelines

When choosing a model configuration, consider:

1. **Response Time Requirements**: Is real-time interaction essential?
2. **Task Complexity**: How nuanced and complex is the task?
3. **Content Quality Expectations**: Is depth and accuracy more important than speed?
4. **Cost Considerations**: More powerful models typically cost more per API call.

## Related Documentation

- [Chat Assistant](./chat-assistant.md)
- [Memory Management](./memory.md)
- [Observability](./observability.md)
