# Agent Builder Implementation

## Overview

The Agent Builder provides a user-friendly interface for creating and configuring custom AI agents. It allows users to define agent behavior, select available tools, and test agents before deployment. The interface is designed to be intuitive for non-technical users while providing advanced options for power users.

## Screen Components

```ascii
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo]  Dashboard  Conversations  Agents  Settings  [User Menu]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Create New Agent                                                   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Basic Information                                               ││
│  │ ┌───────────────────┐ ┌───────────────────┐                     ││
│  │ │ Name              │ │ Description       │                     ││
│  │ └───────────────────┘ └───────────────────┘                     ││
│  │                                                                 ││
│  │ Public Agent  [ ] Make this agent available to all org members  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Capabilities                                                    ││
│  │ ┌─────────────────────────────────────────┐                     ││
│  │ │ System Prompt                           │                     ││
│  │ └─────────────────────────────────────────┘                     ││
│  │                                                                 ││
│  │ Available Tools                           Selected Tools        ││
│  │ ┌─────────────────┐  ┌─────────────┐      ┌─────────────────┐  ││
│  │ │ Search Tool     │  │ Calculator  │  →   │ Web Search      │  ││
│  │ └─────────────────┘  └─────────────┘      └─────────────────┘  ││
│  │ ┌─────────────────┐  ┌─────────────┐      ┌─────────────────┐  ││
│  │ │ Weather Tool    │  │ Code Helper │  →   │ Document Reader │  ││
│  │ └─────────────────┘  └─────────────┘      └─────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Test Your Agent                                                 ││
│  │ ┌─────────────────────────────────────────────────────────────┐ ││
│  │ │ [Test Prompt Input]                                         │ ││
│  │ └─────────────────────────────────────────────────────────────┘ ││
│  │                                                                 ││
│  │ [Test] [Save Draft] [Publish Agent]                             ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Navigation and Header

- **Components**:
  - `Navbar`: Main navigation with breadcrumbs
  - `PageHeader`: Title and primary actions

### 2. Basic Information Section

- **Purpose**: Configure essential agent details
- **Components**:
  - `InfoCard`: Container for basic information
  - `NameInput`: Text input for agent name with validation
  - `DescriptionTextarea`: Textarea for agent description
  - `AvatarUploader`: Upload and crop agent avatar
  - `VisibilityToggle`: Toggle for public/private visibility

### 3. Capabilities Section

- **Purpose**: Define agent behavior and available tools
- **Components**:
  - `CapabilitiesCard`: Container for capabilities configuration
  - `SystemPromptEditor`: Rich text editor for system prompt
  - `ModelSelector`: Dropdown to select AI model
  - `TemperatureSlider`: Slider to adjust model temperature
  - `ToolSelector`: Interface to select and configure tools
    - `AvailableToolsList`: List of all available tools
    - `SelectedToolsList`: List of selected tools
    - `ToolConfigDialog`: Configuration modal for individual tools

### 4. Test Section

- **Purpose**: Test agent before deployment
- **Components**:
  - `TestCard`: Container for testing interface
  - `TestInput`: Input area for test prompts
  - `TestOutput`: Display area for agent responses
  - `TestControls`: Controls for testing (run, stop, clear)

### 5. Action Buttons

- **Purpose**: Primary actions for agent creation
- **Components**:
  - `SaveDraftButton`: Save agent as draft
  - `PublishButton`: Publish agent to organization
  - `DeleteButton`: Delete agent draft

## Implementation Roadmap

### Phase 1: Basic Structure and Information

1. Create the form layout with multiple sections
2. Implement basic information inputs with validation
3. Set up form state management and persistence

### Phase 2: Capabilities Configuration

1. Develop system prompt editor with markdown support
2. Create model selector with performance information
3. Implement tool selector with drag-and-drop functionality

### Phase 3: Testing Interface

1. Create test input and response interface
2. Implement real-time testing against API
3. Develop testing history and examples

### Phase 4: Advanced Features

1. Add template selection for quick setup
2. Implement version history and comparison
3. Create AI-assisted prompt improvement suggestions

## UI Component Implementation Details

### SystemPromptEditor Component

```tsx
// To be implemented in packages/ui/components/agents/SystemPromptEditor.tsx
import { Card, Tabs, MonacoEditor } from "@vernisai/ui";

type SystemPromptEditorProps = {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  onRequestSuggestions?: () => void;
  height?: number;
};

// Implementation details
```

### ToolSelector Component

```tsx
// To be implemented in packages/ui/components/agents/ToolSelector.tsx
import { Card, DragDropContext, Draggable } from "@vernisai/ui";

type Tool = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requiresConfig?: boolean;
  configSchema?: Record<string, unknown>;
};

type ToolSelectorProps = {
  availableTools: Tool[];
  selectedTools: Tool[];
  onSelectTool: (toolId: string) => void;
  onRemoveTool: (toolId: string) => void;
  onReorderTools: (toolIds: string[]) => void;
  onConfigureTool: (toolId: string, config: Record<string, unknown>) => void;
};

// Implementation details
```

### TestInterface Component

```tsx
// To be implemented in packages/ui/components/agents/TestInterface.tsx
import { Card, Button, ChatInput, MessageList } from "@vernisai/ui";

type TestInterfaceProps = {
  agentConfig: {
    name: string;
    systemPrompt: string;
    model: string;
    tools: {
      id: string;
      config?: Record<string, unknown>;
    }[];
  };
  onRunTest: (prompt: string) => Promise<void>;
  isRunning: boolean;
  onStopTest: () => void;
  conversation: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }[];
};

// Implementation details
```

### ModelSelector Component

```tsx
// To be implemented in packages/ui/components/agents/ModelSelector.tsx
import { Select, Badge, Tooltip } from "@vernisai/ui";

type Model = {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextLength: number;
  costPerRequest?: number;
};

type ModelSelectorProps = {
  models: Model[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
};

// Implementation details
```

## Form Validation

The Agent Builder implements comprehensive form validation:

- **Name**: Required, 3-50 characters, unique within organization
- **Description**: Optional, up to 500 characters
- **System Prompt**: Required, 10-4000 characters
- **Model**: Required selection
- **Tools**: Optional, up to 10 tools

## State Management

The Agent Builder uses a multi-step form approach:

1. **Form State**: React Hook Form for field management and validation
2. **Creation Flow**: Step-by-step guidance with progress tracking
3. **Draft Auto-save**: Automatic saving of drafts during creation
4. **Publishing Validation**: Final validation before agent publication

## Advanced Features

### Template Selection

The Agent Builder provides templates for common agent types:

1. **Customer Support Agent**: Pre-configured for support interactions
2. **Research Assistant**: Set up for in-depth research and analysis
3. **Creative Writer**: Optimized for creative content generation
4. **Data Analyst**: Configured for data analysis and visualization

### Version History

For existing agents, the builder tracks version history:

- View and compare previous versions
- Rollback to earlier versions if needed
- Document changes between versions

### AI-Assisted Improvements

The builder offers AI-assisted improvements:

- Prompt enhancement suggestions
- Tool recommendation based on system prompt
- Potential issues detection in agent configuration

## Responsive Considerations

- **Desktop**: Full multi-column layout
- **Tablet**: Stacked sections with full-width inputs
- **Mobile**:
  - Single column layout
  - Simplified tool selection interface
  - Collapsible sections

## Accessibility Requirements

- **Form Labels**: Proper labeling for all form controls
- **Error Messages**: Clear, accessible error feedback
- **Keyboard Navigation**: Full support for keyboard users
- **Screen Reader Support**: ARIA attributes for dynamic content

## Next Steps

1. Create UI component skeletons in the packages/ui directory
2. Implement form state management with validation
3. Develop the system prompt editor with formatting support
4. Create the tool selection interface
5. Build the testing interface for real-time agent testing
