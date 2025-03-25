/**
 * Tool registry for managing tool definitions
 */

import {
  AiSdkTool,
  BaseTool,
  ContextualTool,
  AuthenticatedTool,
  ToolRegistry,
  ToolCategory,
} from "../types/tool.type";

/**
 * Implementation of the tool registry
 */
class ToolRegistryImpl implements ToolRegistry {
  private tools: Map<
    string,
    | BaseTool<unknown, unknown>
    | ContextualTool<unknown, unknown>
    | AuthenticatedTool<unknown, unknown>
  > = new Map();

  /**
   * Register a tool in the registry
   */
  register<TParams, TResult>(
    tool:
      | BaseTool<TParams, TResult>
      | ContextualTool<TParams, TResult>
      | AuthenticatedTool<TParams, TResult>,
  ): void {
    if (!tool.name) {
      throw new Error("Tool name is required for registration");
    }

    if (this.tools.has(tool.name)) {
      console.warn(
        `Tool with name "${tool.name}" already exists and will be overridden.`,
      );
    }

    // Ensure tool has a category, defaulting to CUSTOM if not specified
    if (!("category" in tool)) {
      (tool as BaseTool).category = ToolCategory.CUSTOM;
    }

    this.tools.set(tool.name, tool as BaseTool<unknown, unknown>);
  }

  /**
   * Get a tool by name
   */
  get(
    name: string,
  ):
    | BaseTool<unknown, unknown>
    | ContextualTool<unknown, unknown>
    | AuthenticatedTool<unknown, unknown>
    | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all registered tools
   */
  getAll(): (
    | BaseTool<unknown, unknown>
    | ContextualTool<unknown, unknown>
    | AuthenticatedTool<unknown, unknown>
  )[] {
    return Array.from(this.tools.values());
  }

  /**
   * Check if a tool exists in the registry
   */
  has(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Convert registered tools to AI SDK compatible format
   */
  toAiSdkTools(): AiSdkTool[] {
    return Array.from(this.tools.values()).map((tool) => {
      const aiSdkTool: AiSdkTool = {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
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
    });
  }

  /**
   * Get tools by category
   */
  getByCategory(
    category: ToolCategory,
  ): (
    | BaseTool<unknown, unknown>
    | ContextualTool<unknown, unknown>
    | AuthenticatedTool<unknown, unknown>
  )[] {
    return Array.from(this.tools.values()).filter(
      (tool) => "category" in tool && tool.category === category,
    );
  }

  /**
   * Get tools by tag
   */
  getByTag(
    tag: string,
  ): (
    | BaseTool<unknown, unknown>
    | ContextualTool<unknown, unknown>
    | AuthenticatedTool<unknown, unknown>
  )[] {
    return Array.from(this.tools.values()).filter(
      (tool) => "tags" in tool && tool.tags && tool.tags.includes(tag),
    );
  }

  /**
   * Clear all tools from the registry
   */
  clear(): void {
    this.tools.clear();
  }
}

/**
 * Global tool registry instance
 */
export const globalRegistry = new ToolRegistryImpl();

/**
 * Create a new tool registry
 */
export const createToolRegistry = (): ToolRegistry => {
  return new ToolRegistryImpl();
};

/**
 * Register a tool in the global registry
 */
export const registerTool = <TParams, TResult>(
  tool:
    | BaseTool<TParams, TResult>
    | ContextualTool<TParams, TResult>
    | AuthenticatedTool<TParams, TResult>,
): void => {
  globalRegistry.register(tool);
};

/**
 * Get a tool from the global registry
 */
export const getTool = (
  name: string,
):
  | BaseTool<unknown, unknown>
  | ContextualTool<unknown, unknown>
  | AuthenticatedTool<unknown, unknown>
  | undefined => {
  return globalRegistry.get(name);
};

/**
 * Get all tools from the global registry
 */
export const getAllTools = (): (
  | BaseTool<unknown, unknown>
  | ContextualTool<unknown, unknown>
  | AuthenticatedTool<unknown, unknown>
)[] => {
  return globalRegistry.getAll();
};

/**
 * Check if a tool exists in the global registry
 */
export const hasTool = (name: string): boolean => {
  return globalRegistry.has(name);
};

/**
 * Get all tools in AI SDK compatible format
 * @private Internal use only - use aiSdkAdapter instead
 */
const getAiSdkToolsInternal = (): AiSdkTool[] => {
  return globalRegistry.toAiSdkTools();
};

/**
 * Get tools by category
 */
export const getToolsByCategory = (
  category: ToolCategory,
): (
  | BaseTool<unknown, unknown>
  | ContextualTool<unknown, unknown>
  | AuthenticatedTool<unknown, unknown>
)[] => {
  return globalRegistry.getByCategory(category);
};

/**
 * Get tools by tag
 */
export const getToolsByTag = (
  tag: string,
): (
  | BaseTool<unknown, unknown>
  | ContextualTool<unknown, unknown>
  | AuthenticatedTool<unknown, unknown>
)[] => {
  return globalRegistry.getByTag(tag);
};

/**
 * Clear all tools from the registry (primarily for testing purposes)
 */
export const clearTools = (): void => {
  globalRegistry.clear();
};

/**
 * The centralized tool registry
 */
export const registry: ToolRegistry = {
  register: registerTool,
  get: getTool,
  getAll: getAllTools,
  getByCategory: getToolsByCategory,
  getByTag: getToolsByTag,
  has: hasTool,
  toAiSdkTools: getAiSdkToolsInternal,
};

export default registry;
