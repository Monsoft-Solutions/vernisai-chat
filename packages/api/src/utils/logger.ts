import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import { AsyncLocalStorage } from "async_hooks";

// Initialize context storage for request-scoped data
const asyncLocalStorage = new AsyncLocalStorage<{
  requestId?: string;
  userId?: string;
  organizationId?: string;
  [key: string]: unknown;
}>();

// Initialize Logtail with source token from environment
const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN || "", {
  endpoint: "https://s1250072.eu-nbg-2.betterstackdata.com",
});

// Create formatter for development logs
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS",
  }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`;
  }),
);

// Format that includes context from AsyncLocalStorage
const contextFormat = winston.format((info) => {
  const context = asyncLocalStorage.getStore();
  if (context) {
    // Add context data to log entry
    return {
      ...info,
      ...context,
    };
  }
  return info;
});

// Create a Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: {
    service: "vernisai-api",
    environment: process.env.NODE_ENV || "development",
  },
  format: winston.format.combine(
    contextFormat(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),
    winston.format.json(),
  ),
  transports: [
    // Console transport for local development
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? winston.format.json()
          : devFormat,
    }),
    new LogtailTransport(logtail),
  ],
});

// Add environment-specific configuration
if (process.env.NODE_ENV !== "production") {
  // More detailed logging for development
  logger.level = "debug";
}

/**
 * Helper function to sanitize sensitive data in logs
 */
export function sanitizeLogFields(
  data: Record<string, unknown> | unknown,
  sensitiveFields = ["password", "token", "apiKey", "credit_card"],
): Record<string, unknown> | unknown {
  if (!data || typeof data !== "object") return data;

  const result = { ...(data as Record<string, unknown>) };

  for (const [key, value] of Object.entries(result)) {
    if (sensitiveFields.includes(key)) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeLogFields(value, sensitiveFields);
    }
  }

  return result;
}

export { asyncLocalStorage };
export default logger;
