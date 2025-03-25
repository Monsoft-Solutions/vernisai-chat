/**
 * Types for tools and function calling in the AI package
 */

/**
 * Parameter schema for a tool
 */
export type ToolParameterSchema = {
  /**
   * Type of the parameter
   */
  type: "string" | "number" | "boolean" | "object" | "array";
  /**
   * Description of the parameter
   */
  description?: string;
  /**
   * Whether the parameter is required
   */
  required?: boolean;
  /**
   * Enum values if the parameter is restricted to specific values
   */
  enum?: string[];
  /**
   * Properties if the parameter is an object
   */
  properties?: Record<string, ToolParameterSchema>;
  /**
   * Items if the parameter is an array
   */
  items?: ToolParameterSchema;
};

/**
 * Schema for a tool definition
 */
export type ToolSchema = {
  /**
   * Name of the tool
   */
  name: string;
  /**
   * Description of what the tool does
   */
  description: string;
  /**
   * Parameters for the tool
   */
  parameters?: Record<string, ToolParameterSchema>;
  /**
   * Whether the tool requires authentication
   */
  requiresAuth?: boolean;
  /**
   * The authentication provider required for this tool
   */
  authProvider?: string;
};

/**
 * Tool execution function signature
 */
export type ToolFunction = (
  params: Record<string, unknown>,
  context?: Record<string, unknown>,
) => Promise<unknown>;

/**
 * Complete tool definition with schema and implementation
 */
export type Tool = {
  /**
   * Tool schema defining the interface
   */
  schema: ToolSchema;
  /**
   * Function that implements the tool
   */
  function: ToolFunction;
};
