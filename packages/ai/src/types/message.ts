/**
 * Types for chat messages in the AI package
 */

/**
 * Possible roles for a message in a conversation
 */
export type MessageRole = "user" | "assistant" | "system" | "tool" | "function";

/**
 * Base message type containing content and role
 */
export type Message = {
  /**
   * The role of the message sender
   */
  role: MessageRole;
  /**
   * The content of the message
   */
  content: string;
  /**
   * Optional ID for the message
   */
  id?: string;
  /**
   * Optional name for the message sender
   */
  name?: string;
};

/**
 * Message from the user
 */
export type UserMessage = Message & {
  role: "user";
};

/**
 * Message from the assistant
 */
export type AssistantMessage = Message & {
  role: "assistant";
};

/**
 * System message providing instructions
 */
export type SystemMessage = Message & {
  role: "system";
};

/**
 * Function or tool execution message
 */
export type ToolMessage = Message & {
  role: "tool" | "function";
  name: string;
};

/**
 * Conversation history consisting of multiple messages
 */
export type MessageHistory = Message[];
