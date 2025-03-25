export type OrganizationInfo = {
  name: string;
  activeUsers: number;
  totalUsers: number;
  subscriptionPlan: "Free" | "Pro" | "Enterprise";
  usagePercent: number;
  createdAt: string | Date;
  renewalDate: string | Date;
  usageLimit: number;
};

export type Conversation = {
  id: string;
  title: string;
  lastMessageAt: Date;
  model: string;
  snippet: string;
};

export type UsageData = {
  date: string;
  value: number;
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatarUrl?: string;
  icon?: string; // Icon name as a string
};

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

export type AgentTemplate = {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  recommendedTools: string[];
  model: string;
  icon?: string;
};
