/**
 * Adapters for integrating tools with Vercel AI SDK
 */

import { z } from "zod";
import {
  BaseTool,
  ContextualTool,
  AuthenticatedTool,
  ToolContext,
  AiSdkTool,
} from "../types/tool.type";
import { getAllTools, getTool } from "./registry";

/**
 * Vercel AI SDK expects a tool in this format
 */
export type AiSdkToolDefinition = {
  name: string;
  description: string;
  parameters: z.ZodType<unknown>;
  execute?: (args: Record<string, unknown>) => Promise<unknown>;
};

/**
 * Convert a single tool to AI SDK format
 */
export const adaptToolForAiSdk = <TParams, TResult>(
  tool:
    | BaseTool<TParams, TResult>
    | ContextualTool<TParams, TResult>
    | AuthenticatedTool<TParams, TResult>,
  context: ToolContext = {},
): AiSdkToolDefinition => {
  return {
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
    execute: async (args: Record<string, unknown>) => {
      try {
        // Parse the parameters using the tool's schema
        const validParams = tool.parameters.parse(args);

        // Execute the tool based on its type
        if ("auth" in tool) {
          // Authenticated tool (skipping auth for now)
          return await (tool as AuthenticatedTool<TParams, TResult>).execute(
            validParams as TParams,
            context,
          );
        } else if (tool.execute.length > 1) {
          // Contextual tool
          return await (tool as ContextualTool<TParams, TResult>).execute(
            validParams as TParams,
            context,
          );
        } else {
          // Basic tool
          return await (tool as BaseTool<TParams, TResult>).execute(
            validParams as TParams,
          );
        }
      } catch (error) {
        console.error(`Error executing tool "${tool.name}":`, error);
        throw error;
      }
    },
  };
};

/**
 * Convert multiple tools to AI SDK format
 */
export const adaptToolsForAiSdk = (
  tools: Array<
    | BaseTool<unknown, unknown>
    | ContextualTool<unknown, unknown>
    | AuthenticatedTool<unknown, unknown>
  >,
  context: ToolContext = {},
): AiSdkToolDefinition[] => {
  return tools.map((tool) => adaptToolForAiSdk(tool, context));
};

/**
 * Get all registered tools in AI SDK format
 */
export const getAiSdkToolDefinitions = (
  context: ToolContext = {},
): AiSdkToolDefinition[] => {
  return adaptToolsForAiSdk(getAllTools(), context);
};

/**
 * Get a single tool in AI SDK format by name
 */
export const getAiSdkToolDefinition = (
  name: string,
  context: ToolContext = {},
): AiSdkToolDefinition | undefined => {
  const tool = getTool(name);
  if (!tool) {
    return undefined;
  }

  return adaptToolForAiSdk(tool, context);
};

/**
 * Usage example with Vercel AI SDK:
 *
 * ```typescript
 * import { generateText } from 'ai';
 * import { getAiSdkToolDefinitions } from '@vernis/ai';
 *
 * // Get tools in AI SDK format with user context
 * const tools = getAiSdkToolDefinitions({
 *   user: { id: "user-123" },
 *   conversationId: "conv-456",
 * });
 *
 * // Use with generateText from Vercel AI SDK
 * const response = await generateText({
 *   model: "openai:gpt-4",
 *   messages: [
 *     { role: "user", content: "What's the weather in London?" },
 *   ],
 *   tools,
 * });
 * ```
 */

/**
 * Adapter for making our tools compatible with the Vercel AI SDK
 */

import { registry } from "./registry";

/**
 * Convert a single tool to AI SDK format
 */
export const convertToolToAiSdk = <TParams, TResult>(
  tool:
    | BaseTool<TParams, TResult>
    | ContextualTool<TParams, TResult>
    | AuthenticatedTool<TParams, TResult>,
): AiSdkTool => {
  const aiSdkTool: AiSdkTool = {
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
    execute: async (params: Record<string, unknown>) => {
      try {
        // The execute function in AI SDK expects a record of parameters
        // We need to parse the parameters with our tool's schema first
        const validParams = tool.parameters.parse(params);

        // We now need to determine what kind of tool we have and execute it accordingly
        if ("auth" in tool) {
          // It's an authenticated tool, but we'll skip auth for now in this adapter
          return await (tool as AuthenticatedTool<unknown, unknown>).execute(
            validParams,
            {},
          );
        } else if (tool.execute.length > 1) {
          // It has a context parameter
          return await (tool as ContextualTool<unknown, unknown>).execute(
            validParams,
            {},
          );
        } else {
          // It's a basic tool
          return await (tool as BaseTool<unknown, unknown>).execute(
            validParams,
          );
        }
      } catch (error) {
        console.error(`Error executing tool "${tool.name}":`, error);
        throw error;
      }
    },
  };

  // Add category if available
  if ("category" in tool) {
    aiSdkTool.category = tool.category;
  }

  // Add tags if available
  if ("tags" in tool && tool.tags) {
    aiSdkTool.tags = tool.tags;
  }

  return aiSdkTool;
};

/**
 * Convert all registered tools to AI SDK format
 */
export const getAllToolsForAiSdk = (): AiSdkTool[] => {
  return registry.toAiSdkTools();
};

/**
 * Get AI SDK compatible tools
 */
export const getAiSdkTools = (options?: {
  tools?: string[];
  includeExecution?: boolean;
}): AiSdkTool[] => {
  const allTools = registry.getAll();

  // Filter the tools if specific ones are requested
  const filteredTools =
    options?.tools && options.tools.length > 0
      ? allTools.filter((tool) => options.tools?.includes(tool.name))
      : allTools;

  return filteredTools.map((tool) => {
    const aiSdkTool = convertToolToAiSdk(tool);

    // Remove the execute function if not requested
    if (options?.includeExecution === false) {
      delete aiSdkTool.execute;
    }

    return aiSdkTool;
  });
};

/**
 * Configuration options for AI SDK tool adapter
 */
export type AiSdkToolAdapterOptions = {
  /**
   * Whether to include the execute function in the tools
   */
  includeExecution?: boolean;
  /**
   * List of tool names to include (if not provided, all tools are included)
   */
  tools?: string[];
};

/**
 * Create an adapter for AI SDK tools
 */
export const createAiSdkToolAdapter = (
  options?: AiSdkToolAdapterOptions,
): {
  /**
   * Get tools in AI SDK format
   */
  getTools: () => AiSdkTool[];
  /**
   * Execute a tool by name with parameters
   */
  executeTool: (
    name: string,
    params: Record<string, unknown>,
  ) => Promise<unknown>;
} => {
  return {
    getTools: () =>
      getAiSdkTools({
        tools: options?.tools,
        includeExecution: options?.includeExecution,
      }),
    executeTool: async (name: string, params: Record<string, unknown>) => {
      const tool = registry.get(name);
      if (!tool) {
        throw new Error(`Tool "${name}" not found`);
      }

      try {
        const validParams = tool.parameters.parse(params);

        if ("auth" in tool) {
          return await (tool as AuthenticatedTool<unknown, unknown>).execute(
            validParams,
            {},
          );
        } else if (tool.execute.length > 1) {
          return await (tool as ContextualTool<unknown, unknown>).execute(
            validParams,
            {},
          );
        } else {
          return await (tool as BaseTool<unknown, unknown>).execute(
            validParams,
          );
        }
      } catch (error) {
        console.error(`Error executing tool "${name}":`, error);
        throw error;
      }
    },
  };
};
