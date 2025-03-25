import { Logger } from "../types";
import { sanitize, sanitizeError } from "../utils/sanitizer";
import { contextManager } from "../core/context";
import { metricsManager } from "../core/metrics";

/**
 * Options for TRPC logger middleware
 */
export interface TRPCLoggerOptions {
  /** Whether to enable performance metrics */
  enableMetrics?: boolean;

  /** Whether to log input parameters */
  logParams?: boolean;

  /** Fields to exclude from input parameters */
  excludeFields?: string[];

  /** Log level for request start (false to disable) */
  requestLogLevel?: "info" | "debug" | "http" | false;

  /** Log level for successful responses */
  successLogLevel?: "info" | "debug" | "http";

  /** Function to extract the request path from context if not standard */
  getPath?: (path: string, type: string) => string;
}

/**
 * Create a TRPC middleware for logging
 *
 * This is a generic function to support any TRPC context
 */
export function createTRPCLoggerMiddleware<
  TContext extends Record<string, unknown>,
>(logger: Logger, options: TRPCLoggerOptions = {}) {
  const {
    enableMetrics = true,
    logParams = true,
    excludeFields = [],
    requestLogLevel = "debug",
    successLogLevel = "info",
    getPath = (path) => path,
  } = options;

  return async (opts: {
    path: string;
    type: "query" | "mutation" | "subscription";
    next: () => Promise<unknown>;
    ctx: TContext;
    rawInput?: unknown;
  }) => {
    const { path, type, next, ctx, rawInput } = opts;
    const start = Date.now();
    const requestPath = getPath(path, type);

    // Prepare common metadata
    const meta: Record<string, unknown> = {
      path: requestPath,
      type,
    };

    // Add user and organization IDs if available in context
    let userId: string | undefined;
    if (
      ctx.session &&
      typeof ctx.session === "object" &&
      ctx.session !== null &&
      "userId" in ctx.session
    ) {
      userId = ctx.session.userId as string;
      meta.userId = userId;
      // Update the logger context
      contextManager.updateContext({ userId });
    }

    let organizationId: string | undefined;
    if (typeof ctx === "object" && ctx !== null && "organizationId" in ctx) {
      organizationId = ctx.organizationId as string;
      meta.organizationId = organizationId;
      // Update the logger context
      contextManager.updateContext({ organizationId });
    }

    // Add sanitized input parameters if enabled
    if (logParams && rawInput !== undefined) {
      meta.input = sanitize(rawInput, excludeFields);
    }

    // Log the request start if enabled
    if (requestLogLevel) {
      logger[requestLogLevel](`TRPC ${type} request started`, meta);
    }

    try {
      // Execute the request
      const result = await next();

      // Calculate duration
      const durationMs = Date.now() - start;
      meta.durationMs = durationMs;

      // Log successful completion
      logger[successLogLevel](`TRPC ${type} request completed`, meta);

      // Record metrics if enabled
      if (enableMetrics) {
        metricsManager.recordRequestMetrics(
          requestPath,
          type.toUpperCase(),
          200, // Success
          durationMs,
        );
      }

      return result;
    } catch (error) {
      // Calculate duration
      const durationMs = Date.now() - start;
      meta.durationMs = durationMs;

      // Add error information
      meta.error = sanitizeError(error);

      // Determine HTTP status code (if available)
      const httpStatus =
        typeof error === "object" && error !== null && "code" in error
          ? error["code"] === "INTERNAL_SERVER_ERROR"
            ? 500
            : 400
          : 500;
      meta.httpStatus = httpStatus;

      // Log the error
      logger.error(`TRPC ${type} request failed`, meta);

      // Record metrics if enabled
      if (enableMetrics) {
        metricsManager.recordRequestMetrics(
          requestPath,
          type.toUpperCase(),
          httpStatus,
          durationMs,
        );
      }

      // Re-throw the error
      throw error;
    }
  };
}
