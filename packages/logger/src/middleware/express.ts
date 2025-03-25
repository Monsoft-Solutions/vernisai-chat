import type { Request, Response, NextFunction, Application } from "express";
import { v4 as uuidv4 } from "uuid";
import { sanitize } from "../utils/sanitizer";
import { contextManager } from "../core/context";
import { metricsManager } from "../core/metrics";
import { Logger } from "../types";

/**
 * Extended Express Request with timing and ID
 */
export interface RequestWithContext extends Request {
  id: string;
  startTime: number;
}

/**
 * Options for request logging middleware
 */
export interface RequestLoggerOptions {
  /** Skip logging for certain paths (e.g., health checks) */
  skipPaths?: string[];

  /** Fields to exclude from request body */
  excludeFields?: string[];

  /** Function to extract user ID from request */
  getUserId?: (req: Request) => string | undefined;

  /** Function to extract organization ID from request */
  getOrganizationId?: (req: Request) => string | undefined;

  /** Whether to log request body */
  logBody?: boolean;

  /** Whether to log request headers */
  logHeaders?: boolean;

  /** Whether to log query parameters */
  logQuery?: boolean;

  /** Whether to include performance metrics */
  enableMetrics?: boolean;
}

/**
 * Basic middleware to add request ID and set up logging context
 */
export function requestContextMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Generate a unique request ID
    const requestId = (req.headers["x-request-id"] as string) || uuidv4();
    (req as RequestWithContext).id = requestId;

    // Store the start time for response time calculation
    (req as RequestWithContext).startTime = Date.now();

    // Create the context with request data
    const context = {
      requestId,
      timestamp: Date.now(),
    };

    // Run the next middleware within the context
    contextManager.runWithContext(context, next);
  };
}

/**
 * Middleware to log incoming requests
 */
export function requestLoggingMiddleware(
  logger: Logger,
  options: RequestLoggerOptions = {},
) {
  const {
    skipPaths = [],
    excludeFields = [],
    getUserId,
    getOrganizationId,
    logBody = true,
    logHeaders = false,
    logQuery = true,
    enableMetrics = true,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip logging for specified paths
    if (skipPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    // Get request information
    const method = req.method;
    const url = req.originalUrl || req.url;
    const requestId = (req as RequestWithContext).id;
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // Get optional user and organization IDs
    const userId = getUserId ? getUserId(req) : undefined;
    const organizationId = getOrganizationId
      ? getOrganizationId(req)
      : undefined;

    // Update context with user info if available
    if (userId || organizationId) {
      contextManager.updateContext({
        userId,
        organizationId,
      });
    }

    // Create log entry meta data
    const meta: Record<string, unknown> = {
      requestId,
      method,
      url,
      ip,
      userAgent,
    };

    // Add query parameters if enabled
    if (logQuery && Object.keys(req.query).length > 0) {
      meta.query = sanitize(req.query);
    }

    // Add request body if enabled and available
    if (logBody && req.body && Object.keys(req.body).length > 0) {
      meta.body = sanitize(req.body, excludeFields);
    }

    // Add headers if enabled
    if (logHeaders && req.headers) {
      meta.headers = sanitize(req.headers);
    }

    // Log the request
    logger.http("Request received", meta);

    // Set up response finished logging
    res.on("finish", () => {
      const responseTime = Date.now() - (req as RequestWithContext).startTime;
      const statusCode = res.statusCode;

      // Log at appropriate level based on status code
      const logLevel =
        statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "http";

      logger[logLevel]("Response finished", {
        requestId,
        method,
        url,
        statusCode,
        responseTime,
        userId,
        organizationId,
      });

      // Record metrics if enabled
      if (enableMetrics) {
        metricsManager.recordRequestMetrics(
          req.path,
          method,
          statusCode,
          responseTime,
        );
      }
    });

    next();
  };
}

/**
 * Error handling middleware with logging
 */
export function errorHandlerMiddleware(logger: Logger) {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Get request information
    const method = req.method;
    const url = req.originalUrl || req.url;
    const requestId = (req as RequestWithContext).id;
    const ip = req.ip || req.socket.remoteAddress;

    // Log the error
    logger.error("Unhandled error", {
      error: {
        message: err.message,
        stack: err.stack,
        name: err.name,
      },
      request: {
        method,
        url,
        query: sanitize(req.query),
        body: sanitize(req.body),
        ip,
        requestId,
      },
    });

    // Send response to client
    res.status(500).json({
      error: "Internal server error",
      requestId, // Include for support reference
    });

    // Call next with the error if needed for other error handlers
    next(err);
  };
}

/**
 * Set up all request logging middleware for an Express application
 */
export function setupRequestLogging(
  app: Application,
  logger: Logger,
  options: RequestLoggerOptions = {},
) {
  app.use(requestContextMiddleware());
  app.use(requestLoggingMiddleware(logger, options));
  app.use(errorHandlerMiddleware(logger));

  // Add type augmentation
  return app;
}

// Export interface instead of using namespace
export interface ExtendedRequest extends Request {
  id: string;
  startTime: number;
}
