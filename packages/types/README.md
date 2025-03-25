# @vernisai/types

Shared TypeScript type definitions for VernisAI application.

## Overview

This package contains domain models and shared type definitions used across the VernisAI platform. It serves as the central source of truth for data structures, ensuring consistency between client, server, and database layers.

## Installation

```bash
npm install @vernisai/types
```

## Usage

Import types from the package:

```typescript
import { ChatSession, Message, Tool } from "@vernisai/types";
```

Or import from specific domains:

```typescript
import { Message, MessageSender } from "@vernisai/types/chat";
import { Agent, Model } from "@vernisai/types/dashboard";
import { PaginationParams } from "@vernisai/types/common";
```

## Structure

The package is organized by domain:

- `chat/`: Chat-related types
  - `message.ts`: Message types
  - `session.ts`: Chat session types
  - `tool.ts`: Tool definitions
- `dashboard/`: Dashboard-related types
  - `agent.ts`: Agent definitions
  - `organization.ts`: Organization info
  - `usage.ts`: Usage metrics and analytics
- `user/`: User-related types
- `common/`: Shared utility types

## API

### Chat Types

- `MessageSender`: "user" | "assistant" | "system"
- `MessageStatus`: "sending" | "sent" | "error" | "generating"
- `Message`: Chat message
- `ToolUsage`: Tool usage in messages
- `ChatSession`: Complete chat session
- `Conversation`: Alternative term for chat session

### Dashboard Types

- `Agent`: AI assistant agent
- `Model`: LLM model definition
- `OrganizationInfo`: Organization details
- `UsageData`: Usage statistics
- `UsageMetrics`: Usage metrics with time period

### Common Types

- `PaginationParams`: Request pagination parameters
- `PaginationMeta`: Response pagination metadata
- `PaginatedResponse`: Generic paginated response

## Documentation

For detailed migration guide, see [MIGRATION.md](./MIGRATION.md).

For usage examples, see [EXAMPLES.md](./EXAMPLES.md).
