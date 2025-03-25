/**
 * Logger configuration for the API service
 */
import { createLogger, LoggerOptions, LogLevel } from "@vernisai/logger";

// Define API-specific logger configuration
const loggerConfig: Partial<LoggerOptions> = {
  serviceName: "api",
  environment: process.env.NODE_ENV || "development",
  level: (process.env.LOG_LEVEL as LogLevel) || "info",
  // Add additional sensitive fields specific to the API
  sensitiveFields: [
    "sessionToken",
    "authToken",
    "credentials",
    "jwt",
    "signature",
  ],
};

// Create the configured logger
export const logger = createLogger(loggerConfig);

// Export context manager for request context handling
export { contextManager } from "@vernisai/logger";
