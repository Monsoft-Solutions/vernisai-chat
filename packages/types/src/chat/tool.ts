/**
 * Chat tool types
 */

/**
 * Represents a tool available for the assistant
 */
export type Tool = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  requiresConfig?: boolean;
  configSchema?: Record<string, unknown>;
};
