/**
 * Types for completion responses in the AI package
 */

import { Message } from "./message";

/**
 * Options for a completion request
 */
export type CompletionOptions = {
  /**
   * Messages to be sent for completion
   */
  messages: Message[];
  /**
   * Maximum number of tokens to generate
   */
  maxTokens?: number;
  /**
   * Temperature parameter for controlling randomness (0-1)
   */
  temperature?: number;
  /**
   * Whether to stream the response or not
   */
  stream?: boolean;
  /**
   * Additional model-specific parameters
   */
  modelParams?: Record<string, unknown>;
};

/**
 * Completion response from an AI model
 */
export type CompletionResponse = {
  /**
   * The generated content from the AI
   */
  content: string;
  /**
   * Original messages sent with the request
   */
  messages: Message[];
  /**
   * New message representing the AI response
   */
  responseMessage: Message;
  /**
   * Model identifier that was used
   */
  model: string;
  /**
   * Usage statistics (tokens used)
   */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};
