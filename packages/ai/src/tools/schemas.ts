/**
 * Utilities for working with Zod schemas in the tools system
 */

import { z } from "zod";

/**
 * Creates a string parameter with description
 */
export const createStringParam = (
  description: string,
  options?: {
    required?: boolean;
    default?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: readonly [string, ...string[]];
  },
): z.ZodType => {
  // Handle enum separately as it's a different type
  if (options?.enum !== undefined) {
    const enumSchema = z.enum(options.enum).describe(description);

    if (options?.default !== undefined) {
      const withDefault = enumSchema.default(options.default);
      return options?.required === false ? withDefault.optional() : withDefault;
    }

    return options?.required === false ? enumSchema.optional() : enumSchema;
  }

  // Handle string schema
  let schema = z.string().describe(description);

  if (options?.minLength !== undefined) {
    schema = schema.min(options.minLength);
  }

  if (options?.maxLength !== undefined) {
    schema = schema.max(options.maxLength);
  }

  if (options?.pattern !== undefined) {
    schema = schema.regex(options.pattern);
  }

  if (options?.default !== undefined) {
    const withDefault = schema.default(options.default);
    return options?.required === false ? withDefault.optional() : withDefault;
  }

  return options?.required === false ? schema.optional() : schema;
};

/**
 * Creates a number parameter with description
 */
export const createNumberParam = (
  description: string,
  options?: {
    required?: boolean;
    default?: number;
    min?: number;
    max?: number;
    int?: boolean;
  },
): z.ZodType => {
  let schema = z.number().describe(description);

  if (options?.min !== undefined) {
    schema = schema.min(options.min);
  }

  if (options?.max !== undefined) {
    schema = schema.max(options.max);
  }

  if (options?.int) {
    schema = schema.int();
  }

  if (options?.default !== undefined) {
    const withDefault = schema.default(options.default);
    return options?.required === false ? withDefault.optional() : withDefault;
  }

  return options?.required === false ? schema.optional() : schema;
};

/**
 * Creates a boolean parameter with description
 */
export const createBooleanParam = (
  description: string,
  options?: {
    required?: boolean;
    default?: boolean;
  },
): z.ZodType => {
  const schema = z.boolean().describe(description);

  if (options?.default !== undefined) {
    const withDefault = schema.default(options.default);
    return options?.required === false ? withDefault.optional() : withDefault;
  }

  return options?.required === false ? schema.optional() : schema;
};

/**
 * Creates an array parameter with description
 */
export const createArrayParam = <T extends z.ZodTypeAny>(
  description: string,
  itemSchema: T,
  options?: {
    required?: boolean;
    default?: z.infer<T>[];
    minLength?: number;
    maxLength?: number;
  },
): z.ZodType => {
  let schema = z.array(itemSchema).describe(description);

  if (options?.minLength !== undefined) {
    schema = schema.min(options.minLength);
  }

  if (options?.maxLength !== undefined) {
    schema = schema.max(options.maxLength);
  }

  if (options?.default !== undefined) {
    const withDefault = schema.default(options.default);
    return options?.required === false ? withDefault.optional() : withDefault;
  }

  return options?.required === false ? schema.optional() : schema;
};

/**
 * Creates an object parameter with description
 */
export const createObjectParam = <T extends z.ZodRawShape>(
  description: string,
  shape: T,
  options?: {
    required?: boolean;
    default?: z.infer<z.ZodObject<T>>;
  },
): z.ZodType => {
  const schema = z.object(shape).describe(description);

  if (options?.default !== undefined) {
    const withDefault = schema.default(options.default);
    return options?.required === false ? withDefault.optional() : withDefault;
  }

  return options?.required === false ? schema.optional() : schema;
};

/**
 * Converts a Zod schema to an OpenAPI/JSON Schema compatible format
 * This helps with AI SDK compatibility
 */
export const zodToJsonSchema = <T>(
  schema: z.ZodType<T>,
): Record<string, unknown> => {
  try {
    // Use zod-to-json-schema if available (to be implemented)
    // For now, provide a basic implementation
    const jsonSchema: Record<string, unknown> = {};

    const zodDescription = schema.description;
    if (zodDescription) {
      jsonSchema.description = zodDescription;
    }

    if (schema instanceof z.ZodString) {
      jsonSchema.type = "string";
    } else if (schema instanceof z.ZodNumber) {
      jsonSchema.type = "number";
    } else if (schema instanceof z.ZodBoolean) {
      jsonSchema.type = "boolean";
    } else if (schema instanceof z.ZodArray) {
      jsonSchema.type = "array";
      // Could add items schema here in a more complete implementation
    } else if (schema instanceof z.ZodObject) {
      jsonSchema.type = "object";
      // Could add properties here in a more complete implementation
    } else if (schema instanceof z.ZodEnum) {
      jsonSchema.type = "string";
      // Could add enum values here in a more complete implementation
    }

    return jsonSchema;
  } catch (error) {
    console.warn("Failed to convert Zod schema to JSON Schema", error);
    return { type: "object" };
  }
};

/**
 * Converts an AI SDK compatible schema into our Zod schema
 * Useful for integrating with external tools
 */
export const jsonSchemaToZod = (
  jsonSchema: Record<string, unknown>,
): z.ZodType => {
  try {
    // Basic implementation for common types
    const type = jsonSchema.type as string;
    const description = (jsonSchema.description as string) || "";

    switch (type) {
      case "string":
        return z.string().describe(description);
      case "number":
      case "integer":
        return z.number().describe(description);
      case "boolean":
        return z.boolean().describe(description);
      case "array":
        return z.array(z.unknown()).describe(description);
      case "object":
        return z.record(z.string(), z.unknown()).describe(description);
      default:
        return z.unknown().describe(description);
    }
  } catch (error) {
    console.warn("Failed to convert JSON Schema to Zod schema", error);
    return z.unknown();
  }
};
