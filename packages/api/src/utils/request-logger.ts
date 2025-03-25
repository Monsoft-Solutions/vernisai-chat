import type { Request, Response, NextFunction, Application } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "./logger";
import {
  setupRequestLogging as setupLoggerMiddleware,
  requestContextMiddleware,
  requestLoggingMiddleware,
  errorHandlerMiddleware,
  RequestLoggerOptions,
  ExtendedRequest,
} from "@vernisai/logger";

/**
 * Custom request properties for extended Express requests
 */
export interface CustomRequest extends Request {
  id: string;
  startTime: number;
  userId?: string;
  organizationId?: string;
}

/**
 * Extract user ID from request if available
 */
function getUserId(req: Request): string | undefined {
  // Try to get user ID from session or headers
  if (req.headers["x-user-id"]) {
    return String(req.headers["x-user-id"]);
  }

  // Try to get from auth headers or other sources
  // This would be expanded based on your authentication method
  return undefined;
}

/**
 * Extract organization ID from request if available
 */
function getOrganizationId(req: Request): string | undefined {
  // Try to get org ID from headers
  if (req.headers["x-organization-id"]) {
    return String(req.headers["x-organization-id"]);
  }

  return undefined;
}

/**
 * Request ID middleware for adding unique IDs to requests
 */
export function generateRequestIdMiddleware() {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Generate a unique request ID
    const requestId = (req.headers["x-request-id"] as string) || uuidv4();
    (req as CustomRequest).id = requestId;

    // Store the start time for response time calculation
    (req as CustomRequest).startTime = Date.now();

    next();
  };
}

/**
 * Set up all request logging middleware for an Express application
 */
export function setupRequestLogging(app: Application): Application {
  // Define options for request logging
  const options: RequestLoggerOptions = {
    skipPaths: ["/health", "/api/health"],
    excludeFields: ["password", "token", "apiKey", "secret"],
    getUserId,
    getOrganizationId,
    logBody: true,
    logHeaders: process.env.NODE_ENV !== "production",
    logQuery: true,
    enableMetrics: true,
  };

  // Use the middleware from the logger package
  return setupLoggerMiddleware(app, logger, options);
}

// Re-export middleware for direct use
export {
  requestContextMiddleware,
  requestLoggingMiddleware,
  errorHandlerMiddleware,
};

// Re-export extended request type
export type { ExtendedRequest };
