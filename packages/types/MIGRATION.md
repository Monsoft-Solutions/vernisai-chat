# Types Migration Guide

This document outlines the steps required to migrate from component-specific types to the shared `@vernisai/types` package.

## Overview

The `@vernisai/types` package contains shared TypeScript type definitions used across the VernisAI application. This centralization:

1. Eliminates type duplication
2. Ensures consistency between client and server
3. Promotes proper separation of concerns
4. Simplifies database integration

## Types Structure

The package is organized into domains:

- `chat`: Chat-related types (messages, sessions, tools)
- `dashboard`: Dashboard-related types (agents, usage stats, organization info)
- `user`: User-related types (profiles, permissions)
- `common`: Shared utility types (pagination, responses)

## Migration Steps

### 1. Update Package Dependencies

Add the types package as a dependency in UI, API, and web packages:

```bash
npm install @vernisai/types --workspace=@vernisai/ui
npm install @vernisai/types --workspace=@vernisai/api
npm install @vernisai/types --workspace=web
```

### 2. UI Package Migration

1. Remove types from `packages/ui/src/components/chat/types.ts`
2. Import types from the shared package instead:

```typescript
// Before
import { ChatSession, Message } from "../chat/types";

// After
import { ChatSession, Message } from "@vernisai/types";
```

3. If UI-specific properties are needed, extend the base types:

```typescript
import type { ChatSession as BaseChatSession } from "@vernisai/types";

// Add UI-specific properties
export type ChatSessionProps = BaseChatSession & {
  isActive?: boolean;
};
```

### 3. API Package Migration

1. Update imports in API routers:

```typescript
// Before
import type { ChatSession, Tool } from "@vernisai/ui";

// After
import type { ChatSession, Tool } from "@vernisai/types";
```

2. For API-specific DTOs, extend the base types:

```typescript
import type { ChatSession } from "@vernisai/types";

export type ChatSessionResponse = Omit<ChatSession, "messages"> & {
  messageCount: number;
};
```

### 4. Web App Migration

1. Update imports in component and page files:

```typescript
// Before
import type { ChatSession } from "@vernisai/ui";

// After
import type { ChatSession } from "@vernisai/types";
```

### 5. Database Integration

1. Map database schemas to shared types:

```typescript
import type { ChatSession } from "@vernisai/types";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const chatSessionsTable = pgTable("chat_sessions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  // ... other fields mapped to ChatSession type
});

// Utility to convert DB rows to domain type
export function toChatSession(
  row: typeof chatSessionsTable.$inferSelect,
): ChatSession {
  return {
    id: row.id,
    name: row.name,
    // ... map other fields
  };
}
```

## Type Definitions to Migrate

### From UI Package

- `MessageSender`
- `MessageStatus`
- `ToolUsage`
- `Message`
- `Conversation`
- `Agent`
- `Reference`
- `ChatSession`
- `Tool`

### From API Package

- `OrganizationInfo`
- `UsageData`
- `Agent`
- `Tool`
- `Model`

## Post-Migration Verification

1. Run TypeScript compilation to ensure type compatibility:

   ```bash
   npm run build
   ```

2. Verify test coverage for affected components:
   ```bash
   npm run test
   ```
