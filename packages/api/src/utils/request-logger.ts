import type { Request, Response, NextFunction, Application } from "express";
import { v4 as uuidv4 } from "uuid";
import logger, { asyncLocalStorage, sanitizeLogFields } from "./logger";

/**
 * Middleware to add request ID and setup logging context
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Generate a unique request ID
  const requestId = uuidv4();
  req.id = requestId;

  // Extract user ID if available
  const userId = req.headers.authorization
    ? "extract-from-auth-token" // Replace with actual user extraction logic
    : undefined;

  // Extract organization ID if available
  const organizationId = req.headers["x-organization-id"] as string | undefined;

  // Store the start time for response time calculation
  req.startTime = Date.now();

  // Set up response finished logging
  res.on("finish", () => {
    const responseTime = Date.now() - req.startTime;

    // Log at appropriate level based on status code
    const logLevel =
      res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "http";

    logger[logLevel]("Response finished", {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime,
      userId,
      organizationId,
    });
  });

  // Create the async context with request data
  const store = {
    requestId,
    userId,
    organizationId,
  };

  // Run the next middleware within the async context
  asyncLocalStorage.run(store, next);
}

/**
 * Middleware to log incoming requests
 */
export function requestLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Log the request
  logger.http("Request received", {
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    body: sanitizeLogFields(req.body),
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  next();
}

/**
 * Error handling middleware with logging
 */
export function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Log the error
  logger.error("Unhandled error", {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      body: sanitizeLogFields(req.body),
      ip: req.ip,
    },
  });

  // Send response to client
  res.status(500).json({
    error: "Internal server error",
    requestId: req.id, // Include for support reference
  });

  // Call next with the error if needed for other error handlers
  next(err);
}

/**
 * Set up all request logging middleware for an Express application
 */
export function setupRequestLogging(app: Application) {
  app.use(requestIdMiddleware);
  app.use(requestLoggingMiddleware);
  app.use(errorHandlerMiddleware);
}

// Add custom properties to Express Request type
export interface RequestWithId extends Request {
  id: string;
  startTime: number;
}

// Type augmentation for Express Request
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id: string;
      startTime: number;
    }
  }
}
