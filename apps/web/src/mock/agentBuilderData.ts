import { agents } from "./agents";

export type Tool = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  requiresConfig?: boolean;
  configSchema?: Record<string, unknown>;
};

export type Model = {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextLength: number;
  costPerRequest?: number;
};

export type TestMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export const mockTools: Tool[] = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for real-time information",
    icon: "search",
    requiresConfig: false,
  },
  {
    id: "document-reader",
    name: "Document Reader",
    description: "Read and analyze documents from various formats",
    icon: "file-text",
    requiresConfig: true,
    configSchema: {
      apiKey: { type: "string", required: true },
      maxDocuments: { type: "number", default: 5 },
    },
  },
  {
    id: "calculator",
    name: "Calculator",
    description: "Perform complex mathematical calculations",
    icon: "calculator",
    requiresConfig: false,
  },
  {
    id: "code-helper",
    name: "Code Helper",
    description: "Generate, analyze, and debug code in various languages",
    icon: "code",
    requiresConfig: false,
  },
  {
    id: "weather",
    name: "Weather",
    description: "Get current weather and forecasts for any location",
    icon: "cloud",
    requiresConfig: true,
    configSchema: {
      apiKey: { type: "string", required: true },
      units: {
        type: "string",
        enum: ["metric", "imperial"],
        default: "metric",
      },
    },
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Analyze data sets and generate insights",
    icon: "bar-chart",
    requiresConfig: false,
  },
];

export const mockModels: Model[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    capabilities: ["Text Generation", "Reasoning", "Problem Solving"],
    contextLength: 8192,
    costPerRequest: 0.03,
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    capabilities: ["Text Generation", "Creative Writing", "Summarization"],
    contextLength: 100000,
    costPerRequest: 0.015,
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    capabilities: ["Text Generation", "Reasoning", "Instruction Following"],
    contextLength: 100000,
    costPerRequest: 0.01,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    capabilities: ["Text Generation", "Classification", "Conversation"],
    contextLength: 4096,
    costPerRequest: 0.002,
  },
];

export const mockTestMessages: TestMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Can you help me with analyzing our Q2 marketing performance?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    role: "assistant",
    content:
      "I'd be happy to help analyze your Q2 marketing performance. To provide the most accurate analysis, I'll need some information like your key metrics, campaign details, and goals. What specific aspects of your Q2 marketing would you like to focus on?",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "3",
    role: "user",
    content:
      "We ran social media campaigns on Facebook and Instagram. We need to understand which platform performed better for our ROI.",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: "4",
    role: "assistant",
    content:
      "I understand you want to compare ROI between Facebook and Instagram campaigns from Q2. To provide a meaningful analysis, I'll need:\n\n1. Budget allocated to each platform\n2. Total conversions from each platform\n3. Revenue generated from those conversions\n4. Campaign duration\n\nDo you have this data available? With this information, I can calculate platform-specific ROI and offer suggestions for future optimization.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
];

export const mockAgentTemplates = [
  {
    id: "customer-support",
    name: "Customer Support Agent",
    description:
      "Pre-configured for handling customer inquiries and support requests",
    systemPrompt:
      "You are a helpful customer support agent. Your goal is to assist customers with their inquiries and resolve their issues efficiently and professionally. Always maintain a polite and friendly tone.",
    recommendedTools: ["document-reader", "web-search"],
    model: "gpt-4",
    icon: agents.find((agent) => agent.name === "Customer Support")?.icon,
  },
  {
    id: "research-assistant",
    name: "Research Assistant",
    description: "Optimized for information gathering and in-depth research",
    systemPrompt:
      "You are a research assistant with expertise in gathering, analyzing, and synthesizing information from various sources. Provide comprehensive, balanced, and accurate information based on verified sources.",
    recommendedTools: ["web-search", "document-reader", "data-analysis"],
    model: "claude-3-opus",
    icon: agents.find((agent) => agent.name === "Research Assistant")?.icon,
  },
  {
    id: "creative-writer",
    name: "Creative Writer",
    description: "Specialized in generating creative content and storytelling",
    systemPrompt:
      "You are a creative writer skilled in various writing styles and formats. Help users generate creative content such as stories, poems, scripts, and marketing copy.",
    recommendedTools: [],
    model: "claude-3-sonnet",
    icon: agents.find((agent) => agent.name === "Creative Writer")?.icon,
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Focused on data analysis, visualization, and insights",
    systemPrompt:
      "You are a data analyst capable of processing, analyzing, and visualizing data. Help users interpret data, identify trends, and extract actionable insights.",
    recommendedTools: ["data-analysis", "calculator"],
    model: "gpt-4",
    icon: agents.find((agent) => agent.name === "Data Analyst")?.icon,
  },
];
