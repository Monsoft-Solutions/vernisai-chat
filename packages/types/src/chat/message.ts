/**
 * Chat message types
 */

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
 * Request parameters for sending a message
 */
export type SendMessageParams = {
  sessionId: string;
  content: string;
  toolId?: string;
};

/**
 * Response for a sent message
 */
export type SendMessageResponse = {
  success: boolean;
  messageId: string;
  sessionId: string;
};
