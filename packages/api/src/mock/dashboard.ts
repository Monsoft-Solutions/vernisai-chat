import {
  OrganizationInfo,
  ConversationSummary,
  UsageData,
  Agent,
  Tool,
  Model,
  TestMessage,
  AgentTemplate,
} from "@vernisai/types";

export const mockOrganizationInfo: OrganizationInfo = {
  name: "VernisAI Inc.",
  activeUsers: 12,
  totalUsers: 15,
  subscriptionPlan: "Pro",
  usagePercent: 68,
  createdAt: new Date("2025-01-15"),
  renewalDate: new Date("2026-02-15"),
  usageLimit: 10000,
};

export const mockRecentConversations: ConversationSummary[] = [
  {
    id: "1",
    title: "Marketing Campaign Ideas",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    model: "GPT-4",
    snippet:
      "We could try a social media approach focused on user testimonials...",
  },
  {
    id: "2",
    title: "Product Roadmap Review",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    model: "Claude 3",
    snippet: "The Q3 priorities should focus on improving user onboarding...",
  },
  {
    id: "3",
    title: "Customer Support Training",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    model: "GPT-4",
    snippet: "Here are the key points to cover in the training session...",
  },
  {
    id: "4",
    title: "Website Copy Review",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    model: "Claude 3",
    snippet:
      "The homepage messaging could be more direct and benefit-focused...",
  },
];

export const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Marketing Assistant",
    description: "Helps create and refine marketing campaigns and content",
    capabilities: [
      "Content Creation",
      "Campaign Planning",
      "Audience Analysis",
    ],
    avatarUrl: "/avatars/marketing-agent.svg",
    icon: "MessageSquareText",
  },
  {
    id: "2",
    name: "Data Analyst",
    description: "Analyzes data and generates insights and visualizations",
    capabilities: ["Data Analysis", "Chart Generation", "Trend Identification"],
    avatarUrl: "/avatars/data-agent.svg",
    icon: "BarChart3",
  },
  {
    id: "3",
    name: "Customer Support",
    description: "Assists with customer queries and support ticket management",
    capabilities: ["Query Resolution", "Ticket Management", "Knowledge Base"],
    avatarUrl: "/avatars/support-agent.svg",
    icon: "Headset",
  },
  {
    id: "4",
    name: "Code Assistant",
    description: "Helps write, review, and debug code across various languages",
    capabilities: ["Code Generation", "Code Review", "Debugging"],
    avatarUrl: "/avatars/code-agent.svg",
    icon: "Code",
  },
];

export const mockUsageData: UsageData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 29 + i);
  return {
    date: date.toISOString().split("T")[0],
    value: Math.floor(Math.random() * 60) + 20, // Random value between 20 and 80
  };
});

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

export const mockAgentTemplates: AgentTemplate[] = [
  {
    id: "customer-support",
    name: "Customer Support Agent",
    description:
      "Pre-configured for handling customer inquiries and support requests",
    systemPrompt:
      "You are a helpful customer support agent. Your goal is to assist customers with their inquiries and resolve their issues efficiently and professionally. Always maintain a polite and friendly tone.",
    recommendedTools: ["document-reader", "web-search"],
    model: "gpt-4",
    icon: "Headset",
  },
  {
    id: "research-assistant",
    name: "Research Assistant",
    description: "Optimized for information gathering and in-depth research",
    systemPrompt:
      "You are a research assistant with expertise in gathering, analyzing, and synthesizing information from various sources. Provide comprehensive, balanced, and accurate information based on verified sources.",
    recommendedTools: ["web-search", "document-reader", "data-analysis"],
    model: "claude-3-opus",
    icon: "Search",
  },
  {
    id: "creative-writer",
    name: "Creative Writer",
    description: "Specialized in generating creative content and storytelling",
    systemPrompt:
      "You are a creative writer skilled in various writing styles and formats. Help users generate creative content such as stories, poems, scripts, and marketing copy.",
    recommendedTools: [],
    model: "claude-3-sonnet",
    icon: "Pencil",
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Focused on data analysis, visualization, and insights",
    systemPrompt:
      "You are a data analyst capable of processing, analyzing, and visualizing data. Help users interpret data, identify trends, and extract actionable insights.",
    recommendedTools: ["data-analysis", "calculator"],
    model: "gpt-4",
    icon: "BarChart3",
  },
];
