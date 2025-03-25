/**
 * Tool execution engine
 */

import {
  ToolExecutionOptions,
  ToolResponse,
  ToolContext,
  BaseTool,
  ContextualTool,
  AuthenticatedTool,
  ToolCategory,
} from "../types/tool.type";
import { getTool } from "./registry";

/**
 * Default timeout for tool execution (30 seconds)
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * Create a promise that rejects after a specified timeout
 */
const createTimeoutPromise = (timeoutMs: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Tool execution timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
};

/**
 * Execute a tool with error handling and timeout
 */
export const executeTool = async <TParams, TResult>(
  tool:
    | BaseTool<TParams, TResult>
    | ContextualTool<TParams, TResult>
    | AuthenticatedTool<TParams, TResult>,
  params: TParams,
  options: ToolExecutionOptions = {},
): Promise<ToolResponse<TResult>> => {
  const startTime = Date.now();
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const context = options.context || {};

  try {
    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Tool execution timed out after ${timeout}ms`));
      }, timeout);
    });

    // Execute the tool based on its type
    const executePromise = executeToolByType(tool, params, context);

    // Race the execution against the timeout
    const result = await Promise.race([executePromise, timeoutPromise]);

    return {
      status: "success",
      data: result,
      metadata: {
        executionTime: Date.now() - startTime,
        category: "category" in tool ? tool.category : ToolCategory.CUSTOM,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error during tool execution";

    // Include more details in the error response
    const response: ToolResponse<TResult> = {
      status: "error",
      error: errorMessage,
      metadata: {
        executionTime: Date.now() - startTime,
        category: "category" in tool ? tool.category : ToolCategory.CUSTOM,
      },
    };

    // Add error details with additional properties
    if (error instanceof Error) {
      response.errorDetails = {};

      // If error.stack exists (in development), include it in errorDetails
      if (error.stack && process.env.NODE_ENV !== "production") {
        response.errorDetails.stack = error.stack;
      }

      // Safely check for cause property
      try {
        // Cast to unknown first before checking for properties
        const unknownError = error as unknown;
        if (
          unknownError &&
          typeof unknownError === "object" &&
          "cause" in unknownError &&
          unknownError.cause
        ) {
          response.errorDetails.cause = String(unknownError.cause);
        }
      } catch {
        // Ignore errors in accessing properties
      }
    }

    // Throw the error if requested, otherwise return the error response
    if (options.throwOnError) {
      throw error;
    }

    return response;
  }
};

/**
 * Execute a tool by its name
 */
export const executeToolByName = async <TResult = unknown>(
  name: string,
  params: unknown,
  options: ToolExecutionOptions = {},
): Promise<ToolResponse<TResult>> => {
  const tool = getTool(name);

  if (!tool) {
    return {
      status: "error",
      error: `Tool "${name}" not found`,
      metadata: {
        executionTime: 0,
      },
    };
  }

  try {
    // Validate parameters against the tool's schema
    const validatedParams = tool.parameters.parse(params);

    // Execute the tool with validated parameters
    // Use the generic type assertion to ensure type compatibility
    return await executeTool<unknown, TResult>(
      tool as BaseTool<unknown, TResult>,
      validatedParams,
      options,
    );
  } catch (error) {
    // Handle parameter validation errors
    const errorMessage =
      error instanceof Error ? error.message : "Invalid parameters";

    return {
      status: "error",
      error: errorMessage,
      errorDetails: {
        toolName: name,
        category: "category" in tool ? tool.category : ToolCategory.CUSTOM,
        validationError: true,
      },
      metadata: {
        executionTime: 0,
      },
    };
  }
};

/**
 * Execute a tool based on its type
 */
const executeToolByType = async <TParams, TResult>(
  tool:
    | BaseTool<TParams, TResult>
    | ContextualTool<TParams, TResult>
    | AuthenticatedTool<TParams, TResult>,
  params: TParams,
  context: ToolContext,
): Promise<TResult> => {
  // Authenticate the tool if it requires authentication
  if ("auth" in tool) {
    // Authentication logic would go here
    // For now, we'll just execute it with the context
    return await tool.execute(params, context);
  }

  // If it's a contextual tool, execute with context
  if (tool.execute.length > 1) {
    return await (tool as ContextualTool<TParams, TResult>).execute(
      params,
      context,
    );
  }

  // Otherwise, it's a basic tool
  return await (tool as BaseTool<TParams, TResult>).execute(params);
};

/**
 * Stream tool execution results
 * For tools that can produce incremental results
 */
export const streamToolExecution = async function* <TResult = unknown>(
  toolName: string,
  params: Record<string, unknown>,
  options: ToolExecutionOptions = {},
): AsyncGenerator<ToolResponse<TResult>> {
  const startTime = Date.now();
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const context = options.context || {};

  try {
    // Find the tool
    const tool = getTool(toolName);

    if (!tool) {
      yield {
        status: "error",
        error: `Tool "${toolName}" not found`,
        metadata: {
          executionTime: Date.now() - startTime,
        },
      };
      return;
    }

    // Parse parameters
    let validParams;
    try {
      validParams = tool.parameters.parse(params);
    } catch (error) {
      yield {
        status: "error",
        error: `Invalid parameters for tool "${toolName}"`,
        errorDetails: {
          originalError: error instanceof Error ? error.message : String(error),
          params,
        },
        metadata: {
          executionTime: Date.now() - startTime,
        },
      };
      return;
    }

    // Execute the tool with a timeout
    try {
      const result = await Promise.race([
        executeToolByType(tool, validParams, context),
        createTimeoutPromise(timeout),
      ]);

      yield {
        status: "success",
        data: result as TResult,
        metadata: {
          executionTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      if (options.throwOnError) {
        throw error;
      }

      yield {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          executionTime: Date.now() - startTime,
        },
      };
    }
  } catch (error) {
    if (options.throwOnError) {
      throw error;
    }

    yield {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
      metadata: {
        executionTime: Date.now() - startTime,
      },
    };
  }
};

/**
 * Batch execute multiple tools
 */
export const batchExecuteTools = async <TResult = unknown>(
  executions: Array<{
    tool: string;
    params: unknown;
    options?: ToolExecutionOptions;
  }>,
): Promise<ToolResponse<TResult>[]> => {
  // Execute all tools in parallel
  return await Promise.all(
    executions.map(({ tool, params, options }) =>
      executeToolByName<TResult>(tool, params, options),
    ),
  );
};
