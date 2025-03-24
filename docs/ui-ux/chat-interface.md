# Chat Interface Implementation

## Overview

The Chat Interface serves as the core interaction point for users with the AI agents. It provides a seamless experience for managing conversations, accessing agents, and viewing context.

## Route Structure

The chat interface is implemented using TanStack Router with the following route structure:

```bash
src/routes/
├── __root.tsx           # Root layout with navigation
├── chat/
│   ├── _layout.tsx      # Chat layout with sidebar
│   ├── index.tsx        # Chat home/list view
│   └── $id.tsx          # Dynamic chat session route
```

## Layout Structure

The chat interface consists of several key areas:

1. **Chat Layout** (`packages/ui/src/components/chat/ChatLayout.tsx`)

   - Main container with responsive grid layout
   - Manages sidebar visibility state
   - Handles route transitions

2. **Conversation List** (`packages/ui/src/components/chat/ConversationList.tsx`)

   - List of chat sessions
   - New chat button
   - Search and filter functionality

3. **Agent List** (`packages/ui/src/components/chat/AgentList.tsx`)

   - Available AI agents
   - Agent selection interface
   - Agent status indicators

4. **Chat Messages** (`packages/ui/src/components/chat/ChatMessages.tsx`)

   - Message thread display
   - Message grouping
   - Code block formatting
   - Syntax highlighting

5. **Input Area** (`packages/ui/src/components/chat/ChatInput.tsx`)

   - Message composition
   - File attachments
   - Send button
   - Typing indicators

6. **Context Panel** (`packages/ui/src/components/chat/ContextPanel.tsx`)
   - Current agent info
   - Conversation settings
   - Knowledge base access

## Component Implementation

### Shared Components

All reusable chat components are implemented in `packages/ui/src/components/chat/`:

```typescript
// packages/ui/src/components/chat/types.ts
export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  attachments?: Attachment[];
};

export type ChatSession = {
  id: string;
  title: string;
  lastMessage?: Message;
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Additional type definitions...
```

### Route Components

Route components in `apps/web/src/routes/chat/` handle data loading and state management:

```typescript
// apps/web/src/routes/chat/$id.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ChatLayout } from '@vernisai/ui';

export const Route = createFileRoute('/chat/$id')({
  component: ChatSessionPage,
  loader: ({ params }) => fetchChatSession(params.id),
});

function ChatSessionPage() {
  const { id } = Route.useParams();
  const session = Route.useLoaderData();

  return (
    <ChatLayout>
      {/* Chat components */}
    </ChatLayout>
  );
}
```

## Implementation Phases

### Phase 1: Core Chat Structure

1. Set up route structure with TanStack Router
2. Implement shared UI components in packages/ui
3. Create basic chat layout with responsive design
4. Add navigation between chat sessions

### Phase 2: Message Types and Formatting

1. Implement message display components
2. Add code block formatting
3. Support file attachments
4. Add message timestamps and grouping

### Phase 3: Interactivity and Navigation

1. Implement chat input with validation
2. Add file upload functionality
3. Create agent selection interface
4. Implement context panel

### Phase 4: Advanced Features

1. Add real-time updates
2. Implement search and filtering
3. Add keyboard shortcuts
4. Create loading states and error handling

## Component Details

### ChatLayout

```typescript
// packages/ui/src/components/chat/ChatLayout.tsx
export type ChatLayoutProps = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  contextPanel?: React.ReactNode;
};

export const ChatLayout = ({
  children,
  sidebar,
  contextPanel,
}: ChatLayoutProps) => {
  // Implementation
};
```

### MessageItem

```typescript
// packages/ui/src/components/chat/MessageItem.tsx
export type MessageItemProps = {
  message: Message;
  isLastInGroup?: boolean;
};

export const MessageItem = ({ message, isLastInGroup }: MessageItemProps) => {
  // Implementation
};
```

### ChatInput

```typescript
// packages/ui/src/components/chat/ChatInput.tsx
export type ChatInputProps = {
  onSend: (content: string, attachments?: File[]) => void;
  disabled?: boolean;
};

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  // Implementation
};
```

## Responsive Design

The chat interface adapts to different screen sizes:

- **Desktop**: Full three-column layout
- **Tablet**: Two columns with collapsible panels
- **Mobile**: Single column with modal panels

## Accessibility

- ARIA roles for chat components
- Keyboard navigation support
- Screen reader announcements
- Focus management

## Real-time Features

- WebSocket connection for messages
- Typing indicators
- Online status updates
- Message delivery status

## Testing Strategy

1. Component unit tests
2. Route integration tests
3. Real-time functionality tests
4. Responsive design tests
5. Accessibility tests
