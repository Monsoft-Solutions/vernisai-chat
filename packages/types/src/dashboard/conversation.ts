/**
 * Conversation types for the dashboard
 */

/**
 * Represents a conversation summary for dashboard
 */
export type ConversationSummary = {
  id: string;
  title: string;
  lastMessageAt: Date;
  model: string;
  snippet: string;
};
