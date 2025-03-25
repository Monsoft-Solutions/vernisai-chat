# Shared Types Usage Examples

This document provides practical examples of how to use the `@vernisai/types` package across different parts of the application.

## UI Component Example

### Before Migration

```tsx
// packages/ui/src/components/chat/ChatList.tsx
import { ChatSession } from "./types";

type ChatListProps = {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
};

export const ChatList = ({
  sessions,
  activeSessionId,
  onSelectSession,
}: ChatListProps) => {
  return (
    <div>
      {sessions.map((session) => (
        <div
          key={session.id}
          className={session.id === activeSessionId ? "active" : ""}
          onClick={() => onSelectSession(session.id)}
        >
          {session.name}
        </div>
      ))}
    </div>
  );
};
```

### After Migration

```tsx
// packages/ui/src/components/chat/ChatList.tsx
import { ChatSession } from "@vernisai/types";

type ChatListProps = {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
};

export const ChatList = ({
  sessions,
  activeSessionId,
  onSelectSession,
}: ChatListProps) => {
  return (
    <div>
      {sessions.map((session) => (
        <div
          key={session.id}
          className={session.id === activeSessionId ? "active" : ""}
          onClick={() => onSelectSession(session.id)}
        >
          {session.name}
        </div>
      ))}
    </div>
  );
};
```

## API Router Example

### Before Migration

```ts
// packages/api/src/router/chat.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// Importing types from UI package
import type { ChatSession, Tool } from "@vernisai/ui";

export const chatRouter = router({
  getSessions: publicProcedure.query(() => {
    try {
      // Return chat sessions
      return mockChatSessions as ChatSession[];
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve chat sessions",
        cause: error,
      });
    }
  }),
});
```

### After Migration

```ts
// packages/api/src/router/chat.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// Importing types from shared types package
import type { ChatSession, Tool } from "@vernisai/types";

export const chatRouter = router({
  getSessions: publicProcedure.query(() => {
    try {
      // Return chat sessions
      return mockChatSessions as ChatSession[];
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve chat sessions",
        cause: error,
      });
    }
  }),
});
```

## Web App Example

### Before Migration

```tsx
// apps/web/src/routes/chat/index.tsx
import { useState, useEffect } from "react";
import { ChatPage, type ChatSession } from "@vernisai/ui";
import { chatClient } from "../../utils/trpc-chat";

function ChatRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // Fetch chat sessions
  useEffect(() => {
    // ...
  }, []);

  return (
    <div className="h-[calc(100vh-120px)]">
      <ChatPage
        sessions={sessions}
        // ...
      />
    </div>
  );
}
```

### After Migration

```tsx
// apps/web/src/routes/chat/index.tsx
import { useState, useEffect } from "react";
// Import ChatSession from types package
import { ChatSession } from "@vernisai/types";
import { ChatPage } from "@vernisai/ui";
import { chatClient } from "../../utils/trpc-chat";

function ChatRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // Fetch chat sessions
  useEffect(() => {
    // ...
  }, []);

  return (
    <div className="h-[calc(100vh-120px)]">
      <ChatPage
        sessions={sessions}
        // ...
      />
    </div>
  );
}
```

## Database Integration Example

```ts
// packages/database/src/schema/chat.ts
import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import type { ChatSession, Message } from "@vernisai/types";

export const chatSessionsTable = pgTable("chat_sessions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  agentName: text("agent_name"),
  agentDescription: text("agent_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => chatSessionsTable.id),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // "user", "assistant", "system"
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status"), // "sending", "sent", "error", "generating"
  toolUsage: jsonb("tool_usage"),
});

// Conversion utility for domain model
export function toChatSession(
  session: typeof chatSessionsTable.$inferSelect,
  messages: (typeof messagesTable.$inferSelect)[],
): ChatSession {
  return {
    id: session.id,
    name: session.name,
    agentName: session.agentName ?? undefined,
    agentDescription: session.agentDescription ?? undefined,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    messages: messages.map(toMessage),
  };
}

function toMessage(message: typeof messagesTable.$inferSelect): Message {
  return {
    id: message.id,
    content: message.content,
    sender: message.sender as "user" | "assistant" | "system",
    timestamp: message.timestamp,
    status: message.status as any,
    toolUsage: message.toolUsage as any,
  };
}
```
