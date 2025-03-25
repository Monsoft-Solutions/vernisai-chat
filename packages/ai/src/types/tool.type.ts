/**
 * Types for the tools system using Zod schemas
 */

import { z } from "zod";

/**
 * Tool categories for organization and filtering
 */
export enum ToolCategory {
  // Information retrieval categories
  SEARCH = "search",
  KNOWLEDGE_BASE = "knowledge-base",
  DATA_RETRIEVAL = "data-retrieval",

  // Content processing categories
  TEXT_PROCESSING = "text-processing",
  ANALYSIS = "analysis",
  TRANSLATION = "translation",

  // Generation categories
  CONTENT_GENERATION = "content-generation",
  CODE_GENERATION = "code-generation",
  IMAGE_GENERATION = "image-generation",

  // Integration categories
  EMAIL = "email",
  CALENDAR = "calendar",
  MESSAGING = "messaging",
  CRM = "crm",
  DOCUMENT = "document",

  // System categories
  SYSTEM = "system",
  UTILITY = "utility",

  // Custom category
  CUSTOM = "custom",
}

/**
 * Base tool interface compatible with AI SDK
 */
export type BaseTool<TParams = unknown, TResult = unknown> = {
  /**
   * Unique name for the tool
   */
  name: string;
  /**
   * Description of what the tool does
   */
  description: string;
  /**
   * Zod schema for validating the parameters
   */
  parameters: z.ZodType<TParams>;
  /**
   * Function that executes the tool
   */
  execute: (params: TParams) => Promise<TResult>;
  /**
   * Tool category for organization and filtering
   */
  category: ToolCategory;
  /**
   * Optional version of the tool
   */
  version?: string;
  /**
   * Optional tags for additional filtering and metadata
   */
  tags?: string[];
};

/**
 * Tool execution context provided to tool functions
 */
export type ToolContext = {
  /**
   * Information about the current user
   */
  user?: {
    id: string;
    [key: string]: unknown;
  };
  /**
   * Conversation identifier
   */
  conversationId?: string;
  /**
   * Trace ID for observability
   */
  traceId?: string;
  /**
   * Additional execution metadata
   */
  metadata?: Record<string, unknown>;
};

/**
 * Tool with execution context support
 */
export type ContextualTool<TParams = unknown, TResult = unknown> = {
  /**
   * Unique name for the tool
   */
  name: string;
  /**
   * Description of what the tool does
   */
  description: string;
  /**
   * Zod schema for validating the parameters
   */
  parameters: z.ZodType<TParams>;
  /**
   * Function that executes the tool with context
   */
  execute: (params: TParams, context: ToolContext) => Promise<TResult>;
  /**
   * Tool category for organization and filtering
   */
  category: ToolCategory;
  /**
   * Optional version of the tool
   */
  version?: string;
  /**
   * Optional tags for additional filtering and metadata
   */
  tags?: string[];
};

/**
 * Tool with authentication requirements
 */
export type AuthenticatedTool<
  TParams = unknown,
  TResult = unknown,
> = ContextualTool<TParams, TResult> & {
  /**
   * Authentication configuration
   */
  auth: {
    /**
     * Required authentication provider
     */
    provider: string;
    /**
     * Required scopes
     */
    scopes?: string[];
  };
};

/**
 * Status of a tool execution
 */
export type ToolExecutionStatus = "success" | "error" | "partial";

/**
 * Response from a tool execution
 */
export type ToolResponse<T = unknown> = {
  /**
   * Execution status
   */
  status: ToolExecutionStatus;
  /**
   * Result data if successful
   */
  data?: T;
  /**
   * Error message if failed
   */
  error?: string;
  /**
   * Error details if available
   */
  errorDetails?: Record<string, unknown>;
  /**
   * Execution metadata
   */
  metadata?: {
    /**
     * Execution time in milliseconds
     */
    executionTime?: number;
    /**
     * Rate limit information
     */
    rateLimit?: {
      /**
       * Remaining requests
       */
      remaining: number;
      /**
       * Reset timestamp
       */
      reset: number;
    };
    /**
     * Additional metadata
     */
    [key: string]: unknown;
  };
};

/**
 * Tool adapter for Vercel AI SDK compatibility
 */
export type AiSdkTool = {
  /**
   * Tool name
   */
  name: string;
  /**
   * Tool description
   */
  description: string;
  /**
   * Tool parameters schema
   */
  parameters: z.ZodType<unknown>;
  /**
   * Optional execute function
   */
  execute?: (params: Record<string, unknown>) => Promise<unknown>;
  /**
   * Tool category for organization and filtering
   */
  category?: ToolCategory;
  /**
   * Optional tags for additional filtering and metadata
   */
  tags?: string[];
};

/**
 * Registry for storing tool definitions
 */
export type ToolRegistry = {
  /**
   * Register a tool in the registry
   */
  register: <TParams, TResult>(
    tool:
      | BaseTool<TParams, TResult>
      | ContextualTool<TParams, TResult>
      | AuthenticatedTool<TParams, TResult>,
  ) => void;
  /**
   * Get a tool by name
   */
  get: (
    name: string,
  ) =>
    | BaseTool<unknown, unknown>
    | ContextualTool<unknown, unknown>
    | AuthenticatedTool<unknown, unknown>
    | undefined;
  /**
   * Get all registered tools
   */
  getAll: () => (
    | BaseTool<unknown, unknown>
    | ContextualTool<unknown, unknown>
    | AuthenticatedTool<unknown, unknown>
  )[];
  /**
   * Get tools by category
   */
  getByCategory: (
    category: ToolCategory,
  ) => (
    | BaseTool<unknown, unknown>
    | ContextualTool<unknown, unknown>
    | AuthenticatedTool<unknown, unknown>
  )[];
  /**
   * Get tools by tag
   */
  getByTag: (
    tag: string,
  ) => (
    | BaseTool<unknown, unknown>
    | ContextualTool<unknown, unknown>
    | AuthenticatedTool<unknown, unknown>
  )[];
  /**
   * Check if a tool exists in the registry
   */
  has: (name: string) => boolean;
  /**
   * Convert registered tools to AI SDK compatible format
   */
  toAiSdkTools: () => AiSdkTool[];
};

/**
 * Options for tool execution
 */
export type ToolExecutionOptions = {
  /**
   * Timeout in milliseconds
   */
  timeout?: number;
  /**
   * Context for tool execution
   */
  context?: ToolContext;
  /**
   * Whether to throw on error
   */
  throwOnError?: boolean;
};

/**
 * Built-in tool identifiers
 */
export enum BuiltInTool {
  // Information retrieval
  SEARCH = "search",
  DOCUMENT_QUERY = "document-query",
  NEWS_SEARCH = "news-search",

  // Content processing
  SUMMARIZE = "summarize",
  CONTENT_ANALYZE = "content-analyze",
  TRANSLATE = "translate",

  // Content generation
  EMAIL_COMPOSER = "email-composer",
  SOCIAL_MEDIA_POST = "social-media-post",
  BLOG_POST_GENERATOR = "blog-post-generator",
  IMAGE_GENERATOR = "image-generator",

  // Integration
  EMAIL_SENDER = "email-sender",
  CALENDAR_MANAGER = "calendar-manager",
  SMS_SENDER = "sms-sender",
  SLACK_MESSENGER = "slack-messenger",
}

/**
 * Mapping of built-in tools to their categories
 */
export const BuiltInToolCategories: Record<BuiltInTool, ToolCategory> = {
  [BuiltInTool.SEARCH]: ToolCategory.SEARCH,
  [BuiltInTool.DOCUMENT_QUERY]: ToolCategory.KNOWLEDGE_BASE,
  [BuiltInTool.NEWS_SEARCH]: ToolCategory.SEARCH,
  [BuiltInTool.SUMMARIZE]: ToolCategory.TEXT_PROCESSING,
  [BuiltInTool.CONTENT_ANALYZE]: ToolCategory.ANALYSIS,
  [BuiltInTool.TRANSLATE]: ToolCategory.TRANSLATION,
  [BuiltInTool.EMAIL_COMPOSER]: ToolCategory.CONTENT_GENERATION,
  [BuiltInTool.SOCIAL_MEDIA_POST]: ToolCategory.CONTENT_GENERATION,
  [BuiltInTool.BLOG_POST_GENERATOR]: ToolCategory.CONTENT_GENERATION,
  [BuiltInTool.IMAGE_GENERATOR]: ToolCategory.IMAGE_GENERATION,
  [BuiltInTool.EMAIL_SENDER]: ToolCategory.EMAIL,
  [BuiltInTool.CALENDAR_MANAGER]: ToolCategory.CALENDAR,
  [BuiltInTool.SMS_SENDER]: ToolCategory.MESSAGING,
  [BuiltInTool.SLACK_MESSENGER]: ToolCategory.MESSAGING,
};
