/**
 * Represents a message sender
 */
export type MessageSender = "user" | "assistant" | "system";

/**
 * Represents the status of a message
 */
export type MessageStatus = "sending" | "sent" | "error" | "generating";

/**
 * Represents a tool usage in a message
 */
export type ToolUsage = {
  toolName: string;
  toolInput: unknown;
  toolOutput: unknown;
};

/**
 * Represents a chat message
 */
export type Message = {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  status?: MessageStatus;
  toolUsage?: ToolUsage[];
};

/**
 * Represents a conversation
 */
export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Represents an agent
 */
export type Agent = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  modelName: string;
  avatarUrl?: string;
};

/**
 * Represents a reference or source
 */
export type Reference = {
  id: string;
  title: string;
  url?: string;
  content?: string;
};

/**
 * Represents a chat session
 */
export type ChatSession = {
  id: string;
  name: string;
  agentName?: string;
  agentDescription?: string;
  messages: Message[];
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Represents a tool available for the assistant
 */
export type Tool = {
  id: string;
  name: string;
  description: string;
  icon?: string;
};
