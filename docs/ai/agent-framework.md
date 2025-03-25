# Agent Framework

The Agent Framework provides a powerful system for creating specialized AI agents that execute multi-step workflows to accomplish complex tasks.

## Overview

Unlike simple chat assistants, agents in the `@vernis/ai` package can:

- Execute predefined or dynamic multi-step workflows
- Use specialized tools to interact with external systems
- Maintain state across execution steps
- Make decisions based on previous steps and external data
- Access knowledge bases for additional context

## Agent Lifecycle

Agents follow a defined lifecycle:

1. **Creation**: Agents are defined with initial configuration
2. **Initialization**: The agent prepares its tools and resources
3. **Planning**: The agent analyzes the task and plans its approach
4. **Execution**: Steps are executed sequentially or adaptively
5. **Completion**: The agent provides the final result
6. **Termination**: Resources are released

## Creating an Agent

```typescript
import { createAgent, ModelConfig, Tool } from "@vernis/ai";

// Define the agent
const researchAgent = createAgent({
  name: "Research Assistant",
  description: "Researches topics thoroughly and provides summaries",
  model: ModelConfig.GENIUS,
  systemPrompt:
    "You are a research assistant that can search for information and summarize findings.",
  tools: [SearchTool, SummarizeTool],
  maxSteps: 10,
});

// Execute the agent with a task
const result = await researchAgent.execute({
  task: "Research the impact of AI on healthcare and provide a summary",
  options: {
    verbose: true, // Log detailed execution steps
  },
});

console.log(result.output);
```

## Workflow Definition

Agents can use either:

### 1. Predefined Workflows

```typescript
import { createAgent, defineWorkflow, ModelConfig } from "@vernis/ai";

// Define a step-by-step workflow
const researchWorkflow = defineWorkflow({
  name: "Research Workflow",
  steps: [
    {
      name: "initial-search",
      description: "Search for general information on the topic",
      tool: "search",
      inputMapping: {
        query: "{{task}}", // Use the task description as the search query
      },
    },
    {
      name: "find-recent-papers",
      description: "Find recent research papers on the topic",
      tool: "academic-search",
      inputMapping: {
        query: "{{task}} recent research papers",
        yearStart: "2020",
      },
    },
    {
      name: "summarize",
      description: "Summarize all findings",
      tool: "summarize",
      inputMapping: {
        content: "{{initial-search.result}} {{find-recent-papers.result}}",
      },
    },
  ],
});

// Create agent with predefined workflow
const agent = createAgent({
  name: "Research Assistant",
  model: ModelConfig.GENIUS,
  workflow: researchWorkflow,
});

const result = await agent.execute({
  task: "Impact of AI on healthcare",
});
```

### 2. Dynamic (Self-Planning) Workflows

```typescript
import { createAgent, ModelConfig } from "@vernis/ai";

// Create an agent that plans its own workflow
const dynamicAgent = createAgent({
  name: "Dynamic Research Assistant",
  model: ModelConfig.GENIUS,
  systemPrompt:
    "You are a research assistant that plans and executes research tasks.",
  tools: [SearchTool, AcademicSearchTool, SummarizeTool, AnalyzeTrendsTool],
  planningStrategy: "autonomous", // Agent determines its own steps
  maxSteps: 15,
});

const result = await dynamicAgent.execute({
  task: "Research the impact of AI on healthcare, focusing on recent innovations and trends",
});
```

## Tools and Actions

Agents execute actions through tools, which are integration points with external systems or specialized capabilities.

### Built-in Tools

The framework includes several built-in tools:

- Search
- Document retrieval
- Summarization
- Content generation
- Data analysis
- Email composition
- Social media integration

```typescript
import { createAgent, ModelConfig, BuiltInTools } from "@vernis/ai";

const agent = createAgent({
  name: "Marketing Assistant",
  model: ModelConfig.SMART,
  tools: [
    BuiltInTools.SEARCH,
    BuiltInTools.SUMMARIZE,
    BuiltInTools.SOCIAL_MEDIA_POST,
  ],
});
```

### Custom Tools

You can define custom tools for your specific use cases:

```typescript
import { createTool, ToolDefinition } from "@vernis/ai";

// Define a custom tool
const weatherTool: ToolDefinition = {
  name: "weather",
  description: "Get current weather for a location",
  parameters: {
    location: {
      type: "string",
      description: "City name or coordinates",
      required: true,
    },
    units: {
      type: "string",
      enum: ["metric", "imperial"],
      default: "metric",
      required: false,
    },
  },
  execute: async ({ location, units }) => {
    // Implementation to fetch weather data
    const weatherData = await fetchWeatherData(location, units);
    return weatherData;
  },
};

// Register the tool
const WeatherTool = createTool(weatherTool);

// Use in an agent
const agent = createAgent({
  name: "Travel Assistant",
  model: ModelConfig.SMART,
  tools: [SearchTool, WeatherTool, HotelBookingTool],
});
```

## Agent State and Memory

Agents maintain state throughout their lifecycle:

```typescript
import { createAgent, ModelConfig } from "@vernis/ai";

const agent = createAgent({
  name: "Research Assistant",
  model: ModelConfig.GENIUS,
  // Configure persistent state
  stateManager: {
    type: "persistent",
    storage: "database", // Options: 'memory', 'file', 'database'
    retentionPeriod: "1d", // How long to retain state after completion
  },
});

// Execute with existing state
const result = await agent.execute({
  task: "Continue the research from yesterday",
  stateId: "previous-research-state-123",
});
```

## Error Handling and Retry Mechanisms

Agents include robust error handling:

```typescript
import { createAgent, ModelConfig } from "@vernis/ai";

const agent = createAgent({
  name: "Email Assistant",
  model: ModelConfig.SMART,
  tools: [EmailTool, ContactsTool],
  // Configure error handling
  errorHandling: {
    retryFailedSteps: true,
    maxRetries: 3,
    retryDelay: 1000, // ms
    fallbackStrategies: [
      "alternative-tool",
      "simplified-step",
      "human-intervention",
    ],
  },
});
```

## Knowledge Base Integration

Agents can access knowledge bases for additional context:

```typescript
import { createAgent, ModelConfig } from "@vernis/ai";

const agent = createAgent({
  name: "Company Assistant",
  model: ModelConfig.SMART,
  knowledgeBases: ["company-policies", "product-documentation"],
  knowledgeBaseStrategy: "auto-query", // Automatically query relevant knowledge
});
```

## Advanced Usage: Parallel Execution

For complex workflows that can benefit from parallel execution:

```typescript
import { createAgent, defineWorkflow, ModelConfig } from "@vernis/ai";

const parallelWorkflow = defineWorkflow({
  name: "Parallel Research",
  steps: [
    // Initial step
    {
      name: "initial-query",
      tool: "query-formulation",
    },
    // Parallel execution group
    {
      name: "research-phase",
      type: "parallel",
      steps: [
        {
          name: "web-search",
          tool: "search",
        },
        {
          name: "academic-search",
          tool: "academic-search",
        },
        {
          name: "news-search",
          tool: "news-search",
        },
      ],
    },
    // Final step using results from parallel steps
    {
      name: "synthesis",
      tool: "summarize",
      inputMapping: {
        content: "{{research-phase.results}}",
      },
    },
  ],
});
```

## Related Documentation

- [Tools](./tools.md)
- [Knowledge Base](./knowledge-base.md)
- [Natural Agent Builder](./natural-agent-builder.md)
- [Auth](./auth.md)
