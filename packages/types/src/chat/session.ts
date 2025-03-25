/**
 * Chat session types
 */

import type { Message } from "./message";

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
 * Represents a conversation (alternative term used in some parts of the application)
 */
export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Request parameters for creating a new chat session
 */
export type CreateSessionParams = {
  name?: string;
  agentId?: string;
};

/**
 * Parameters for retrieving a chat session
 */
export type GetSessionParams = {
  id: string;
};
