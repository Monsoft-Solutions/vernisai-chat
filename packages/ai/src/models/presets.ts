/**
 * Model configuration presets for the AI package
 */

import {
  AnyModelConfig,
  ModelPreset,
  OpenAIModelConfig,
  AnthropicModelConfig,
} from "../types/model";

/**
 * Default model configurations for each preset
 * These will be populated in the next implementation phase
 */
export const modelPresets: Record<ModelPreset, AnyModelConfig> = {
  [ModelPreset.SPEED]: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000,
  } as OpenAIModelConfig,

  [ModelPreset.SMART]: {
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 2000,
  } as OpenAIModelConfig,

  [ModelPreset.GENIUS]: {
    provider: "anthropic",
    model: "claude-3-opus-20240229",
    temperature: 0.7,
    maxTokens: 4000,
  } as AnthropicModelConfig,

  [ModelPreset.REASONING]: {
    provider: "openai",
    model: "gpt-4-turbo",
    temperature: 0.3,
    maxTokens: 4000,
  } as OpenAIModelConfig,
};
