# Natural Agent Builder

The Natural Agent Builder provides a way to create sophisticated AI agents using natural language instructions, making agent creation accessible to non-technical users.

## Overview

While the `@vernis/ai` package supports detailed programmatic creation of agents, the Natural Agent Builder allows users to describe their desired agent in plain language. The system then automatically:

1. Interprets the natural language description
2. Determines appropriate tools and configuration
3. Creates a well-structured agent workflow
4. Provides opportunities for refinement

## Creating Agents with Natural Language

```typescript
import { createAgentFromDescription, ModelConfig } from "@vernis/ai";

// Create an agent using natural language
const marketingAgent = await createAgentFromDescription({
  description: `
    Create a marketing assistant that can:
    1. Find trending topics on Twitter related to my industry
    2. Generate social media post ideas based on those trends
    3. Draft actual posts for Twitter, LinkedIn, and Instagram
    4. Schedule the posts to be published at optimal times
    
    The agent should focus on the tech industry and maintain a professional tone.
  `,
  // Optional configuration to guide the creation process
  baseModel: ModelConfig.GENIUS,
  availableTools: [
    "social-media-search",
    "content-generator",
    "post-scheduler",
  ],
  userContext: {
    industry: "technology",
    brand: "enterprise software",
  },
});

// Use the created agent
const result = await marketingAgent.execute({
  task: "Create posts about our new cloud security features",
});
```

## The Creation Process

Behind the scenes, the Natural Agent Builder follows a multi-step process:

1. **Instruction Parsing**: The system analyzes the natural language description to identify key tasks, requirements, and constraints.

2. **Tool Selection**: Based on the identified tasks, the system selects appropriate tools from available options.

3. **Workflow Construction**: The system creates a logical workflow that connects the tools in the right sequence.

4. **Parameter Configuration**: Each tool is configured with appropriate default parameters.

5. **Agent Assembly**: A complete agent is assembled with the workflow, tools, and appropriate prompt templates.

## Interactive Refinement

The Natural Agent Builder also supports an interactive mode for refining the created agent:

```typescript
import { createAgentInteractively } from "@vernis/ai";

// Start an interactive agent creation process
const agent = await createAgentInteractively({
  initialDescription:
    "A research assistant that can find scientific papers and summarize them",
  // Enable step-by-step refinement
  interactiveMode: "stepwise",
  // Callback for user interaction
  userInteractionCallback: async (stage, proposal, options) => {
    // This would typically connect to your UI
    return await presentOptionsToUser(stage, proposal, options);
  },
});
```

With interactive mode, the system will:

1. Present its interpretation of the task
2. Show selected tools and workflow
3. Allow the user to make adjustments at each step
4. Generate the final agent based on the refined choices

## Behind the Scenes

The Natural Agent Builder uses a specialized internal agent to create other agents:

```
User Description → Builder Agent → Generated Agent Specification → Agent Creation API → Working Agent
```

The Builder Agent has specialized knowledge about:

- Available tools and their capabilities
- Common workflow patterns
- Best practices for agent design
- Parameter optimization

## Customizing the Builder

For more control over the agent creation process:

```typescript
import { configureAgentBuilder } from "@vernis/ai";

// Configure the agent builder system
configureAgentBuilder({
  // Default models for different aspects of agent creation
  models: {
    planning: ModelConfig.REASONING,
    toolSelection: ModelConfig.GENIUS,
    promptGeneration: ModelConfig.SMART,
  },

  // Add custom templates for different agent types
  templates: [
    {
      name: "customer-support",
      description: "Template for customer support agents",
      basePrompt: "You are a helpful customer support assistant...",
      suggestedTools: [
        "knowledge-base-query",
        "ticket-system",
        "email-composer",
      ],
    },
  ],

  // Customize the builder logic
  optimizationGoals: ["reliability", "simplicity"],
  maxWorkflowSteps: 10,
  requireExplicitApproval: true,
});
```

## Agent Schema and Form Integration

For applications that want to blend natural language and form-based agent creation, the package provides schema generation:

```typescript
import { getAgentBuilderForm, createAgentFromNaturalAndForm } from "@vernis/ai";

// Get a form schema based on a natural language description
const formSchema = await getAgentBuilderForm({
  description:
    "A research assistant that can search academic papers and summarize findings",
});

// formSchema contains a JSON schema that can be rendered as a form in your UI
// The user can then fill out the form to refine the agent configuration

// Later, create the agent using both the natural description and form data
const agent = await createAgentFromNaturalAndForm({
  naturalDescription:
    "A research assistant that can search academic papers and summarize findings",
  formData: {
    // Form data from your UI, following the schema
    name: "Research Helper",
    tools: ["academic-search", "summarizer"],
    maxSteps: 5,
    // ...other form fields
  },
});
```

## Iterative Improvement

After creating an agent through natural language, you can save and iteratively improve it:

```typescript
import { improveAgentFromFeedback } from "@vernis/ai";

// After using the agent and gathering feedback
const improvedAgent = await improveAgentFromFeedback({
  agent: marketingAgent,
  feedback: "The posts are too verbose and should include hashtags",
  preserveCore: true, // Keep the core workflow but adjust parameters
});

// The improved agent incorporates the feedback
const betterResult = await improvedAgent.execute({
  task: "Create posts about our product update",
});
```

## The `AgentBuilderForm.tsx` Component

For React applications, the package includes a dedicated form component:

```tsx
import { AgentBuilderForm } from "@vernis/ai/react";

// In your React component
function AgentCreationPage() {
  const handleAgentCreated = (agent) => {
    // Store the created agent
    saveAgent(agent);
  };

  return (
    <div>
      <h1>Create a New Agent</h1>
      <AgentBuilderForm
        initialDescription="Create a social media manager that can post updates to Twitter and LinkedIn"
        availableTools={[
          "social-media-search",
          "content-generator",
          "post-scheduler",
        ]}
        onAgentCreated={handleAgentCreated}
        showAdvancedOptions={true}
        theme="light"
      />
    </div>
  );
}
```

The `AgentBuilderForm` component provides:

- A text area for the natural language description
- Real-time feedback on the interpreted agent capabilities
- Tool selection interface
- Parameter configuration options
- Preview of the agent workflow
- Test functionality

## Related Documentation

- [Agent Framework](./agent-framework.md)
- [Tools](./tools.md)
- [Knowledge Base](./knowledge-base.md)
