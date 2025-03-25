/**
 * Agent types for dashboard and chat
 */

/**
 * Model information
 */
export type Model = {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextLength: number;
  costPerRequest?: number;
};

/**
 * Represents an agent
 */
export type Agent = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  modelName?: string; // Used in chat UI
  model?: Model; // Used in dashboard
  avatarUrl?: string;
  icon?: string; // Icon name as a string
};

/**
 * Template for creating new agents
 */
export type AgentTemplate = {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  recommendedTools: string[];
  model: string;
  icon?: string;
};
