# Dashboard Screen Implementation

## Overview

The Dashboard serves as the main entry point for the application, providing an overview of recent conversations, available agents, and organization statistics. It is designed to give users quick access to their most important information and actions.

## Screen Components

```ascii
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]  Dashboard  Conversations  Agents  Settings  [User Menu] │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────────┐ │
│ │                 │ │                                         │ │
│ │  Organization   │ │  Recent Conversations                   │ │
│ │  Information    │ │  ┌─────────────────┐ ┌─────────────────┐│ │
│ │                 │ │  │ Conversation 1  │ │ Conversation 2  ││ │
│ │  - Users        │ │  └─────────────────┘ └─────────────────┘│ │
│ │  - Subscription │ │  ┌─────────────────┐ ┌─────────────────┐│ │
│ │  - Usage Stats  │ │  │ Conversation 3  │ │ Conversation 4  ││ │
│ │                 │ │  └─────────────────┘ └─────────────────┘│ │
│ └─────────────────┘ └─────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │                             │ │                             │ │
│ │  Available Agents           │ │  Usage Statistics           │ │
│ │                             │ │                             │ │
│ │  [Agent Cards with Quick    │ │  [Charts showing message    │ │
│ │   Action Buttons]           │ │   and agent usage over time]│ │
│ │                             │ │                             │ │
│ └─────────────────────────────┘ └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Navigation Bar

- **Header Component**: Logo, navigation links, user menu
- **Components**:
  - `Navbar`: Top navigation with responsive mobile menu
  - `NavItem`: Individual navigation links
  - `UserMenu`: Dropdown with user options

### 2. Organization Information Card

- **Purpose**: Display key organization information
- **Components**:
  - `OrgInfoCard`: Container for organization information
  - `UserCounter`: Shows number of active users
  - `SubscriptionBadge`: Displays current subscription plan
  - `UsageIndicator`: Visual indicator of usage against limits

### 3. Recent Conversations Grid

- **Purpose**: Quick access to recent conversations
- **Components**:
  - `ConversationsGrid`: Responsive grid of conversation cards
  - `ConversationCard`: Individual conversation summary
    - Shows title, timestamp, model used, and a snippet

### 4. Available Agents Section

- **Purpose**: Display and provide quick access to agents
- **Components**:
  - `AgentsGrid`: Responsive grid of agent cards
  - `AgentCard`: Shows agent name, description, and actions
  - `QuickActionButton`: For starting a conversation with an agent

### 5. Usage Statistics Section

- **Purpose**: Visualize usage metrics
- **Components**:
  - `StatsCard`: Container for statistics visualizations
  - `UsageChart`: Line chart showing usage over time
  - `UsageSummary`: Text summary of current usage

## Implementation Roadmap

### Phase 1: Core Structure

1. Implement basic layout structure with Navbar and main content area
2. Create responsive grid system for dashboard cards
3. Set up basic card components with placeholder content

### Phase 2: Data Components

1. Implement organization information card with real data connections
2. Create conversation cards with data fetching logic
3. Build agent cards with filtering and sorting capabilities

### Phase 3: Charts and Visualizations

1. Implement usage charts using a charting library (Recharts recommended)
2. Create dynamic data connections for real-time stats
3. Add interactive elements to charts (tooltips, filtering)

### Phase 4: Interactions and Refinement

1. Add all interactive elements (hover states, clicks, etc.)
2. Implement loading and error states for all data components
3. Optimize performance for large data sets

## UI Component Implementation Details

### Navbar Component

```tsx
// To be implemented in packages/ui/components/navigation/Navbar.tsx
import { Logo, UserMenu, MobileMenu } from "@vernisai/ui";

type NavbarProps = {
  activeItem?: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
};

// Implementation details with responsive behavior
```

### ConversationCard Component

```tsx
// To be implemented in packages/ui/components/conversations/ConversationCard.tsx
import { Card, Badge, IconButton } from "@vernisai/ui";

type ConversationCardProps = {
  id: string;
  title: string;
  lastMessageAt: Date;
  model: string;
  snippet: string;
  onClick?: () => void;
};

// Implementation details
```

### AgentCard Component

```tsx
// To be implemented in packages/ui/components/agents/AgentCard.tsx
import { Card, Avatar, Badge, Button } from "@vernisai/ui";

type AgentCardProps = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatarUrl?: string;
  onStartConversation?: () => void;
};

// Implementation details
```

### UsageChart Component

```tsx
// To be implemented in packages/ui/components/charts/UsageChart.tsx
import { AreaChart, Tooltip } from "@vernisai/ui";

type UsageChartProps = {
  data: {
    date: string;
    value: number;
  }[];
  timeRange: "day" | "week" | "month";
  title: string;
};

// Implementation details
```

## Responsive Considerations

- **Desktop**: Full grid layout with all components visible
- **Tablet**: Stacked grid with 2 columns
- **Mobile**: Single column layout with prioritized content:
  1. Recent Conversations
  2. Available Agents
  3. Organization Information
  4. Usage Statistics

## Accessibility Requirements

- **Focus Management**: Proper tab order for all interactive elements
- **Screen Reader Support**: ARIA labels for all dynamic content
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Color Contrast**: Minimum 4.5:1 ratio for all text content

## State Management

- Use React Query for server state management
- Use Context or Zustand for UI state management
- Implement optimistic updates for a responsive feel

## Next Steps

1. Create UI component skeletons in the packages/ui directory
2. Implement responsive layout for the dashboard
3. Create data fetching hooks and connections
4. Implement charts and visualizations
5. Add interactions and polish
