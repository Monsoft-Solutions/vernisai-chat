/**
 * Functions for creating tool definitions
 */

import { z } from "zod";
import {
  BaseTool,
  ContextualTool,
  AuthenticatedTool,
  ToolContext,
  ToolCategory,
} from "../types/tool.type";
import { registerTool } from "./registry";

/**
 * Options for creating a basic tool
 */
export type CreateToolOptions<TParams, TResult> = {
  /**
   * Tool name
   */
  name: string;
  /**
   * Tool description
   */
  description: string;
  /**
   * Zod schema defining the parameters
   */
  parameters: z.ZodType<TParams>;
  /**
   * Function that executes the tool
   */
  execute: (params: TParams) => Promise<TResult>;
  /**
   * Tool category for organization and filtering
   */
  category?: ToolCategory;
  /**
   * Optional version of the tool
   */
  version?: string;
  /**
   * Optional tags for additional filtering and metadata
   */
  tags?: string[];
  /**
   * Whether to automatically register the tool
   */
  autoRegister?: boolean;
};

/**
 * Options for creating a contextual tool
 */
export type CreateContextualToolOptions<TParams, TResult> = {
  /**
   * Tool name
   */
  name: string;
  /**
   * Tool description
   */
  description: string;
  /**
   * Zod schema defining the parameters
   */
  parameters: z.ZodType<TParams>;
  /**
   * Function that executes the tool with context
   */
  execute: (params: TParams, context: ToolContext) => Promise<TResult>;
  /**
   * Tool category for organization and filtering
   */
  category?: ToolCategory;
  /**
   * Optional version of the tool
   */
  version?: string;
  /**
   * Optional tags for additional filtering and metadata
   */
  tags?: string[];
  /**
   * Whether to automatically register the tool
   */
  autoRegister?: boolean;
};

/**
 * Options for creating an authenticated tool
 */
export type CreateAuthenticatedToolOptions<TParams, TResult> =
  CreateContextualToolOptions<TParams, TResult> & {
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
 * Create a basic tool
 */
export const createTool = <TParams, TResult>(
  options: CreateToolOptions<TParams, TResult>,
): BaseTool<TParams, TResult> => {
  // Validate required fields
  if (!options.name) {
    throw new Error("Tool name is required");
  }

  if (!options.description) {
    throw new Error("Tool description is required");
  }

  if (!options.parameters) {
    throw new Error("Tool parameters schema is required");
  }

  if (!options.execute) {
    throw new Error("Tool execute function is required");
  }

  const tool: BaseTool<TParams, TResult> = {
    name: options.name,
    description: options.description,
    parameters: options.parameters,
    execute: options.execute,
    category: options.category || ToolCategory.CUSTOM,
  };

  // Add optional fields if provided
  if (options.version) {
    tool.version = options.version;
  }

  if (options.tags) {
    tool.tags = options.tags;
  }

  // Auto-register the tool if specified
  if (options.autoRegister !== false) {
    registerTool(tool);
  }

  return tool;
};

/**
 * Create a contextual tool
 */
export const createContextualTool = <TParams, TResult>(
  options: CreateContextualToolOptions<TParams, TResult>,
): ContextualTool<TParams, TResult> => {
  // Validate required fields
  if (!options.name) {
    throw new Error("Tool name is required");
  }

  if (!options.description) {
    throw new Error("Tool description is required");
  }

  if (!options.parameters) {
    throw new Error("Tool parameters schema is required");
  }

  if (!options.execute) {
    throw new Error("Tool execute function is required");
  }

  const tool: ContextualTool<TParams, TResult> = {
    name: options.name,
    description: options.description,
    parameters: options.parameters,
    execute: options.execute,
    category: options.category || ToolCategory.CUSTOM,
  };

  // Add optional fields if provided
  if (options.version) {
    tool.version = options.version;
  }

  if (options.tags) {
    tool.tags = options.tags;
  }

  // Auto-register the tool if specified
  if (options.autoRegister !== false) {
    registerTool(tool);
  }

  return tool;
};

/**
 * Create an authenticated tool
 */
export const createAuthenticatedTool = <TParams, TResult>(
  options: CreateAuthenticatedToolOptions<TParams, TResult>,
): AuthenticatedTool<TParams, TResult> => {
  // Validate required fields
  if (!options.name) {
    throw new Error("Tool name is required");
  }

  if (!options.description) {
    throw new Error("Tool description is required");
  }

  if (!options.parameters) {
    throw new Error("Tool parameters schema is required");
  }

  if (!options.execute) {
    throw new Error("Tool execute function is required");
  }

  if (!options.auth || !options.auth.provider) {
    throw new Error(
      "Authentication provider is required for authenticated tools",
    );
  }

  const tool: AuthenticatedTool<TParams, TResult> = {
    name: options.name,
    description: options.description,
    parameters: options.parameters,
    execute: options.execute,
    category: options.category || ToolCategory.CUSTOM,
    auth: {
      provider: options.auth.provider,
      scopes: options.auth.scopes,
    },
  };

  // Add optional fields if provided
  if (options.version) {
    tool.version = options.version;
  }

  if (options.tags) {
    tool.tags = options.tags;
  }

  // Auto-register the tool if specified
  if (options.autoRegister !== false) {
    registerTool(tool);
  }

  return tool;
};
