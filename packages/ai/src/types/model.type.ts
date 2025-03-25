/**
 * Types for AI model configuration in the AI package
 */

/**
 * Supported AI model providers
 */
export type ModelProvider = "openai" | "anthropic" | "custom";

/**
 * Base model configuration interface
 */
export type ModelConfig = {
  /**
   * Provider of the AI model
   */
  provider: ModelProvider;
  /**
   * Specific model identifier/name
   */
  model: string;
  /**
   * Default temperature setting
   */
  temperature?: number;
  /**
   * Default maximum tokens to generate
   */
  maxTokens?: number;
  /**
   * Default system prompt
   */
  systemPrompt?: string;
  /**
   * Additional model-specific parameters
   */
  additionalParams?: Record<string, unknown>;
};

/**
 * OpenAI-specific model configuration
 */
export type OpenAIModelConfig = ModelConfig & {
  provider: "openai";
  /**
   * Top-p sampling parameter
   */
  topP?: number;
  /**
   * Frequency penalty parameter
   */
  frequencyPenalty?: number;
  /**
   * Presence penalty parameter
   */
  presencePenalty?: number;
};

/**
 * Anthropic-specific model configuration
 */
export type AnthropicModelConfig = ModelConfig & {
  provider: "anthropic";
  /**
   * Top-k parameter
   */
  topK?: number;
  /**
   * Top-p sampling parameter
   */
  topP?: number;
};

/**
 * Custom model configuration for other providers
 */
export type CustomModelConfig = ModelConfig & {
  provider: "custom";
  /**
   * Custom endpoint URL
   */
  endpoint?: string;
  /**
   * Authentication headers
   */
  headers?: Record<string, string>;
};

/**
 * Union type of all model configurations
 */
export type AnyModelConfig =
  | OpenAIModelConfig
  | AnthropicModelConfig
  | CustomModelConfig;

/**
 * Model configuration presets
 */
export enum ModelPreset {
  /**
   * Optimized for speed and efficiency
   */
  SPEED = "speed",
  /**
   * Balanced for most use cases
   */
  SMART = "smart",
  /**
   * Advanced model for complex tasks
   */
  GENIUS = "genius",
  /**
   * Optimized for reasoning and problem-solving
   */
  REASONING = "reasoning",
}
