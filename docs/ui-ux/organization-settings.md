# Organization Settings Implementation

## Overview

The Organization Settings screen provides administrative controls for managing users, subscription plans, billing information, API access, and integrations. It is designed for organization administrators to manage their team's access and usage of the AI Chatbot platform.

## Screen Components

```ascii
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo]  Dashboard  Conversations  Agents  Settings  [User Menu]     │
├────────────────────┬────────────────────────────────────────────────┤
│                    │                                                │
│  Settings          │  Organization Settings                         │
│  ┌──────────────┐  │                                                │
│  │ Organization │  │  ┌────────────────────────────────────────────┐│
│  └──────────────┘  │  │ Organization Details                       ││
│  ┌──────────────┐  │  │ ┌──────────────┐  ┌──────────────┐         ││
│  │ Users        │  │  │ │ Name         │  │ Logo         │         ││
│  └──────────────┘  │  │ └──────────────┘  └──────────────┘         ││
│  ┌──────────────┐  │  │                                            ││
│  │ Billing      │  │  └────────────────────────────────────────────┘│
│  └──────────────┘  │                                                │
│  ┌──────────────┐  │  ┌────────────────────────────────────────────┐│
│  │ API Access   │  │  │ Users                                      ││
│  └──────────────┘  │  │ ┌────────────┬─────────────┬─────────────┐ ││
│  ┌──────────────┐  │  │ │ User       │ Email       │ Role        │ ││
│  │ Integrations │  │  │ ├────────────┼─────────────┼─────────────┤ ││
│  └──────────────┘  │  │ │ User 1     │ user1@...   │ Owner       │ ││
│                    │  │ ├────────────┼─────────────┼─────────────┤ ││
│                    │  │ │ User 2     │ user2@...   │ Admin       │ ││
│                    │  │ ├────────────┼─────────────┼─────────────┤ ││
│                    │  │ │ User 3     │ user3@...   │ Member      │ ││
│                    │  │ └────────────┴─────────────┴─────────────┘ ││
│                    │  │                                            ││
│                    │  │ [+ Invite User]                            ││
│                    │  └────────────────────────────────────────────┘│
│                    │                                                │
│                    │  ┌────────────────────────────────────────────┐│
│                    │  │ Subscription                               ││
│                    │  │                                            ││
│                    │  │ Current Plan: Team Plan                    ││
│                    │  │ Status: Active                             ││
│                    │  │ Renewal Date: Nov 15, 2023                 ││
│                    │  │                                            ││
│                    │  │ [Change Plan] [Manage Payment]             ││
│                    │  └────────────────────────────────────────────┘│
└────────────────────┴────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Navigation and Layout

- **Components**:
  - `SettingsLayout`: Two-column layout for settings
  - `SettingsSidebar`: Navigation sidebar for settings sections
  - `SettingsContent`: Main content area for selected settings

### 2. Organization Details Section

- **Purpose**: Manage basic organization information
- **Components**:
  - `OrganizationForm`: Form for organization details
  - `NameInput`: Text input for organization name
  - `LogoUploader`: Component for uploading and cropping logo
  - `DomainSettings`: Domain configuration for SSO

### 3. Users Management Section

- **Purpose**: Manage organization members and permissions
- **Components**:
  - `UserTable`: Table listing all organization members
  - `UserTableRow`: Individual user row with actions
  - `RoleSelector`: Dropdown for selecting user roles
  - `InviteUserDialog`: Modal for inviting new users
  - `UserBulkActions`: Actions for multiple selected users

### 4. Subscription Section

- **Purpose**: Manage subscription plan and billing
- **Components**:
  - `SubscriptionCard`: Summary of current subscription
  - `PlanSelector`: Interface for changing subscription plan
  - `BillingHistory`: Table of past invoices
  - `PaymentMethodForm`: Form for managing payment methods

### 5. API Access Section

- **Purpose**: Manage API keys and access
- **Components**:
  - `ApiKeyManager`: Interface for creating and managing API keys
  - `ApiKeyRow`: Individual API key with usage information
  - `ApiUsageChart`: Chart showing API usage over time
  - `ApiRateLimits`: Display of current rate limits

### 6. Integrations Section

- **Purpose**: Configure third-party integrations
- **Components**:
  - `IntegrationsList`: List of available integrations
  - `IntegrationCard`: Card for individual integration
  - `IntegrationSetupFlow`: Wizard for configuring integrations
  - `OAuthConnector`: Component for handling OAuth connections

## Implementation Roadmap

### Phase 1: Core Settings Structure

1. Implement settings layout with navigation
2. Create organization details form
3. Set up users table with basic functionality

### Phase 2: User Management

1. Implement invite user workflow
2. Create role management system
3. Add bulk actions for user management

### Phase 3: Subscription and Billing

1. Implement subscription plan display
2. Create plan selection and upgrade flow
3. Develop billing history and payment methods

### Phase 4: Advanced Settings

1. Implement API key management
2. Create usage statistics visualizations
3. Develop integration configuration interfaces

## UI Component Implementation Details

### UserTable Component

```tsx
// To be implemented in packages/ui/components/organizations/UserTable.tsx
import { Table, Badge, Avatar, DropdownMenu } from "@vernisai/ui";

type User = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "guest";
  avatarUrl?: string;
  lastActive?: Date;
};

type UserTableProps = {
  users: User[];
  onRoleChange: (userId: string, newRole: User["role"]) => Promise<void>;
  onRemoveUser: (userId: string) => Promise<void>;
  onResendInvite?: (userId: string) => Promise<void>;
  isLoading?: boolean;
  canManageUsers?: boolean;
};

// Implementation details
```

### SubscriptionCard Component

```tsx
// To be implemented in packages/ui/components/organizations/SubscriptionCard.tsx
import { Card, Badge, Button, Progress } from "@vernisai/ui";

type SubscriptionCardProps = {
  plan: {
    name: string;
    status: "active" | "canceled" | "past_due";
    renewalDate?: Date;
    features: string[];
  };
  usage: {
    users: {
      current: number;
      limit: number;
    };
    storage: {
      current: number;
      limit: number;
    };
    requests: {
      current: number;
      limit: number;
    };
  };
  onChangePlan: () => void;
  onManagePayment: () => void;
};

// Implementation details
```

### ApiKeyManager Component

```tsx
// To be implemented in packages/ui/components/organizations/ApiKeyManager.tsx
import { Card, Button, Table, CopyButton, AlertDialog } from "@vernisai/ui";

type ApiKey = {
  id: string;
  name: string;
  lastCharacters: string;
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
};

type ApiKeyManagerProps = {
  apiKeys: ApiKey[];
  onCreateKey: (name: string) => Promise<{ key: string }>;
  onRevokeKey: (keyId: string) => Promise<void>;
  maxKeys?: number;
};

// Implementation details
```

### IntegrationCard Component

```tsx
// To be implemented in packages/ui/components/organizations/IntegrationCard.tsx
import { Card, Switch, Button, Icon } from "@vernisai/ui";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isEnabled: boolean;
  isConfigured: boolean;
  requiredPermissions?: string[];
};

type IntegrationCardProps = {
  integration: Integration;
  onToggle: (integrationId: string, enabled: boolean) => Promise<void>;
  onConfigure: (integrationId: string) => void;
};

// Implementation details
```

## Role-Based Access Control

The Organization Settings implements role-based access control:

- **Owner**: Full access to all settings, can transfer ownership
- **Admin**: Can manage users, subscription, and integrations
- **Member**: Limited access to organization settings
- **Guest**: No access to organization settings

The UI adapts dynamically based on the user's role:

```tsx
// Example of role-based rendering
const canManageUsers = userRole === "owner" || userRole === "admin";
const canManageBilling = userRole === "owner";

return (
  <SettingsLayout>
    <SettingsSidebar>
      <SidebarItem>Organization</SidebarItem>
      {canManageUsers && <SidebarItem>Users</SidebarItem>}
      {canManageBilling && <SidebarItem>Billing</SidebarItem>}
      {/* Other menu items */}
    </SettingsSidebar>

    <SettingsContent>
      {/* Conditional rendering of content based on role */}
    </SettingsContent>
  </SettingsLayout>
);
```

## Multi-Step Workflows

The settings UI handles several complex workflows:

### User Invitation Flow

1. Admin enters email and selects role
2. System sends invitation email
3. UI shows pending invitation status
4. When user accepts, status updates automatically

### Subscription Change Flow

1. Admin selects new plan
2. System calculates prorated cost
3. Admin confirms and provides payment if needed
4. UI updates to reflect new plan immediately

### API Key Creation Flow

1. Admin requests new API key
2. System generates key and shows one-time display
3. Admin copies key and names it
4. UI shows key with masked characters afterward

## Responsive Considerations

- **Desktop**: Two-column layout with persistent sidebar
- **Tablet**:
  - Collapsible sidebar that overlays when expanded
  - Full-width content area
- **Mobile**:
  - Bottom navigation for settings sections
  - Simplified tables with expandable rows
  - Stack forms and inputs vertically

## Data Management

The settings screens implement efficient data handling:

- **Optimistic Updates**: UI updates immediately before API confirmation
- **Concurrent Editing**: Handles multiple admins editing settings simultaneously
- **Error Recovery**: Clear error states with retry options
- **Change Auditing**: Logs all settings changes with user attribution

## Security Considerations

- **Sensitive Actions**: Require confirmation with password for sensitive changes
- **Session Validation**: Verify user session for all privileged operations
- **Data Encryption**: Encrypt sensitive data in transit and at rest
- **Audit Logging**: Record all administrative actions for security review

## Next Steps

1. Create the settings layout components in packages/ui directory
2. Implement organization details form with validation
3. Develop user management table with role controls
4. Create subscription management interface
5. Implement API key management tools
