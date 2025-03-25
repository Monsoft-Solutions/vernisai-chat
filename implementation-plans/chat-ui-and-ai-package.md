# Implementation Plan: Chat UI and AI Package Integration

This implementation plan outlines the steps required to enhance the existing `@vernis/ai` package and implement a chat interface with Vercel AI SDK compatibility. The plan prioritizes early UI integration with a simpler initial implementation that can scale as needed.

## 1. Overview

### Goals

- Implement a working chat UI as early as possible using Vercel AI SDK
- Extend the existing AI package with basic message generation first, then add memory later
- Follow Vercel AI SDK's message persistence approach for storing conversations
- Scale features incrementally to ensure continuous value delivery

### Architecture

- **Client UI**: React components using Vercel AI SDK's useChat hook
- **AI Package**: Enhanced with Vercel AI SDK compatibility
- **API Layer**: tRPC endpoints that work with Vercel AI SDK's streaming protocol
- **Storage**: Simple file-based storage initially, with database integration later
- **Cache Layer**: Added after basic functionality is working

## 2. Implementation Phases

### Phase 1: Core Message Generation & Simple UI (Initial Launch)

#### 1.1. Basic Message API Compatibility

- [ ] **Implement AI SDK message types in `packages/ai/src/types/message.ts`**

  - Add support for Vercel AI SDK's Message interface
  - Create conversion utilities between internal and AI SDK formats
  - Define simple message structure with id, role, content and timestamps
  - **Reference:** https://sdk.vercel.ai/docs/reference/ai-sdk-core/core-message

- [ ] **Create simple AI completion endpoint in `packages/api/src/router/chat.ts`**
  - Implement basic streaming text endpoint using Vercel AI SDK's `streamText`
  - Support the minimal API needed for useChat hook
  - Add proper error handling and content-type headers
  - **REference:**
    - https://sdk.vercel.ai/cookbook/rsc/stream-text
    - https://sdk.vercel.ai/cookbook/rsc/stream-text-with-chat-prompt

#### 1.2. Simple UI Implementation

- [ ] **Create chat UI hook in `apps/web/src/hooks/useVernisChat.ts`**

  - Implement a wrapper around Vercel AI SDK's useChat hook
  - Configure the hook to work with our API endpoints
  - Add basic error handling and loading states
  - https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot

- [ ] **Update chat components in `packages/ui/src/components/chat`**
  - Enhance ChatInput to work with the useChat hook
  - Update MessageList to render streaming messages
  - Implement simple chat interface without persistence initially

#### 1.3. Simple Message Persistence

- [ ] **Implement message persistence following AI SDK pattern**
  - Create simple file-based storage initially (as shown in AI SDK docs)
  - Use the `saveChat` and `loadChat` pattern from AI SDK examples
  - Implement the `onFinish` callback to store complete conversations

### Phase 2: Conversation Management & Basic Memory

#### 2.1. Conversation Management

- [ ] **Create conversation management APIs**

  - Implement conversation creation and listing endpoints
  - Add message history retrieval endpoint
  - Create chat ID generation and management utilities

- [ ] **Enhance UI with conversation management**
  - Add conversation switching in the UI
  - Implement conversation history sidebar
  - Add new chat creation functionality

#### 2.2. Basic Memory Implementation

- [ ] **Implement simple memory interface in `packages/ai/src/memory/types.ts`**

  - Create basic MemoryManager interface
  - Implement simple storage adapter for retrieving conversation history
  - Add memory initialization with conversation ID

- [ ] **Create basic chat assistant with memory in `packages/ai/src/chat.ts`**
  - Implement createChatAssistant with memory integration
  - Add proper message history retrieval from storage
  - Make sure it works with streaming responses

### Phase 3: Enhanced Features & Scaling

#### 3.1. Enhanced Memory Features

- [ ] **Implement sliding window memory in `packages/ai/src/memory/sliding-window.ts`**

  - Add token-aware message tracking
  - Implement window size management
  - Create serialization methods for storage

- [ ] **Add cache integration in `packages/ai/src/memory/cache.ts`**
  - Implement cache-manager integration
  - Create efficient key generation
  - Add TTL management

#### 3.2. Prompt Management

- [ ] **Implement prompt system in `packages/ai/src/prompts`**
  - Create prompt registry with categorization
  - Add template engine with variable substitution
  - Implement built-in system prompts

#### 3.3. Database Integration

- [ ] **Migrate from file-based storage to database**
  - Create proper database schema for conversations and messages
  - Implement database storage adapter
  - Migrate existing file-based conversations to database

## 3. Implementation Details

### 3.1. AI SDK Message Compatibility

We'll follow the Vercel AI SDK message format for consistency:

```typescript
// packages/ai/src/types/message.ts
import { Message } from "ai";

// Extend the AI SDK Message type with our additional fields
export interface VernisMessage extends Message {
  conversationId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// We'll use AI SDK's appendResponseMessages and appendClientMessage helpers
// for consistent message management
```

### 3.2. Simple Message Persistence

Following the Vercel AI SDK documentation, we'll implement simple message persistence:

```typescript
// packages/api/src/utils/chat-store.ts
import { Message } from "ai";
import { appendResponseMessages } from "ai";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { generateId } from "ai";

// Get the path to the chat file
function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), ".chats");
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.json`);
}

// Create a new chat and return the ID
export async function createChat(): Promise<string> {
  const id = generateId();
  await writeFile(getChatFile(id), "[]");
  return id;
}

// Load a chat by ID
export async function loadChat(id: string): Promise<Message[]> {
  return JSON.parse(await readFile(getChatFile(id), "utf8"));
}

// Save a chat with its messages
export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(id), content);
}
```

### 3.3. API Endpoint Implementation

We'll implement the API endpoint using Vercel AI SDK's `streamText` function:

```typescript
// packages/api/src/router/chat.ts
import { streamText, appendResponseMessages } from "ai";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { openai } from "@vernis/ai/models";
import { saveChat, loadChat } from "../utils/chat-store";

export const chatRouter = createTRPCRouter({
  streamMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().optional(),
        message: z.string(),
        messages: z.array(z.any()).optional(),
      }),
    )
    .subscription(async ({ input, ctx }) => {
      const { conversationId, message, messages = [] } = input;

      // Generate ID if not provided
      const id = conversationId || generateId();

      // Load previous messages if conversationId provided
      const previousMessages = conversationId
        ? await loadChat(conversationId)
        : [];

      // Combine previous messages with new message
      const allMessages = [
        ...previousMessages,
        { id: generateId(), role: "user", content: message },
      ];

      // Stream response
      const result = streamText({
        model: openai("gpt-4"),
        messages: allMessages,
        async onFinish({ response }) {
          // Save the complete conversation
          await saveChat({
            id,
            messages: appendResponseMessages({
              messages: allMessages,
              responseMessages: response.messages,
            }),
          });
        },
      });

      // Consume the stream to ensure it completes even if client disconnects
      result.consumeStream();

      return result.toTRPCSubscription();
    }),

  getConversations: protectedProcedure.query(async ({ ctx }) => {
    // Implementation to list available conversations
  }),

  getConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return loadChat(input.conversationId);
    }),
});
```

### 3.4. UI Implementation with useChat

We'll create a simple wrapper around useChat:

```tsx
// apps/web/src/hooks/useVernisChat.ts
import { useChat as useAISDKChat } from "ai/react";
import { useState, useCallback } from "react";

export function useVernisChat({
  conversationId,
  onError,
}: {
  conversationId?: string;
  onError?: (error: Error) => void;
} = {}) {
  const [chatId, setChatId] = useState<string | undefined>(conversationId);

  const chatHook = useAISDKChat({
    api: "/api/chat",
    id: chatId,
    body: chatId ? { conversationId: chatId } : undefined,
    onError,
    onResponse: (response) => {
      // Extract conversation ID from response if new
      if (!chatId) {
        const id = response.headers.get("x-conversation-id");
        if (id) setChatId(id);
      }
    },
  });

  const startNewChat = useCallback(() => {
    setChatId(undefined);
    chatHook.reload();
  }, [chatHook]);

  return {
    ...chatHook,
    chatId,
    startNewChat,
  };
}
```

## 4. Implementation Strategy

To deliver value early, we'll follow this order of implementation:

1. **Basic AI SDK message compatibility** - Create the minimal necessary types
2. **Simple API endpoint with streaming** - Implement a basic streaming API
3. **UI integration with useChat** - Get the chat UI working with streaming
4. **Simple message persistence** - Add file-based storage following AI SDK pattern
5. **Conversation management** - Add ability to create and switch conversations
6. **Basic memory implementation** - Add simple message history recall
7. **Enhance with advanced features** - Add caching, sliding window, etc.

## 5. Initial Implementation Checklist (MVP)

For the minimum viable product to demonstrate value:

- [ ] Create AI SDK compatible message types
- [ ] Implement basic streaming API endpoint
- [ ] Set up useChat hook integration
- [ ] Update UI components to work with streaming messages
- [ ] Implement simple file-based message persistence
- [ ] Add conversation creation and listing
- [ ] Create simple conversation switching in UI

This MVP provides immediate value with:

- Working chat interface with streaming responses
- Conversation persistence between sessions
- Ability to manage multiple conversations

## 6. Conclusion

This implementation plan prioritizes getting a working chat UI as quickly as possible while following Vercel AI SDK patterns. By starting with a simple implementation and scaling incrementally, we can deliver value early and continuously improve the system. The approach takes advantage of Vercel AI SDK's useChat hook and message persistence patterns to ensure a modern, efficient implementation that follows industry best practices.
