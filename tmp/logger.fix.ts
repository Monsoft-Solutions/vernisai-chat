import winston from "winston";
import { LogtailTransport } from "@logtail/winston";
import { Logtail } from "@logtail/node";
import {
  LoggerOptions,
  Logger as LoggerInterface,
  LogLevel,
  LogData,
} from "../types";
import { contextManager } from "./context";

/**
 * Default logger options
 */
const defaultOptions: LoggerOptions = {
  serviceName: "vernisai",
  environment: process.env.NODE_ENV || "development",
  level: (process.env.LOG_LEVEL as LogLevel) || "info",
  transports: {
    console: true,
    logtail: !!process.env.LOGTAIL_SOURCE_TOKEN,
    metrics: false,
  },
  logtail: {
    sourceToken: process.env.LOGTAIL_SOURCE_TOKEN,
    endpoint:
      process.env.LOGTAIL_ENDPOINT ||
      "https://s1250072.eu-nbg-2.betterstackdata.com",
  },
  sensitiveFields: [
    "password",
    "token",
    "apiKey",
    "credit_card",
    "secret",
    "key",
  ],
};

/**
 * Create the context format to add context from AsyncLocalStorage
 */
// This directly creates the format object instead of returning a function
export const contextFormat = winston.format((info) => {
  const context = contextManager.getContext();
  if (context) {
    // Add context data to log entry
    return {
      ...info,
      ...context,
    };
  }
  return info;
})();

/**
 * Create formatter for development logs
 */
const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS",
  }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const requestId = meta.requestId ? ` [${meta.requestId}]` : "";
    return `${timestamp} ${level}:${requestId} ${message} ${
      Object.keys(meta).length > 0 &&
      (!meta.requestId || Object.keys(meta).length > 1)
        ? JSON.stringify(sanitizeLogFields(meta), null, 2)
        : ""
    }`;
  }),
);

/**
 * Sanitize sensitive fields in logs
 */
export function sanitizeLogFields(
  data: Record<string, unknown> | unknown,
  sensitiveFields = defaultOptions.sensitiveFields,
): Record<string, unknown> | unknown {
  if (!data || typeof data !== "object" || !sensitiveFields) return data;

  const result = { ...(data as Record<string, unknown>) };

  for (const [key, value] of Object.entries(result)) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeLogFields(value, sensitiveFields);
    }
  }

  return result;
}

/**
 * Create a Winston logger with the provided options
 */
export function createLogger(
  options: Partial<LoggerOptions> = {},
): LoggerInterface {
  // Merge defaults with provided options
  const mergedOptions: LoggerOptions = {
    ...defaultOptions,
    ...options,
    transports: {
      ...defaultOptions.transports,
      ...options.transports,
    },
    logtail: {
      ...defaultOptions.logtail,
      ...options.logtail,
    },
    sensitiveFields: [
      ...(defaultOptions.sensitiveFields || []),
      ...(options.sensitiveFields || []),
    ],
    defaultMeta: {
      ...defaultOptions.defaultMeta,
      ...options.defaultMeta,
    },
  };

  // Configure transports
  const transports: winston.transport[] = [];

  // Add console transport if enabled
  if (mergedOptions.transports?.console) {
    transports.push(
      new winston.transports.Console({
        format:
          mergedOptions.environment === "production"
            ? winston.format.json()
            : developmentFormat,
      }),
    );
  }

  // Add Logtail transport if enabled and token is available
  if (mergedOptions.transports?.logtail && mergedOptions.logtail?.sourceToken) {
    const logtail = new Logtail(mergedOptions.logtail.sourceToken, {
      endpoint: mergedOptions.logtail.endpoint,
    });
    transports.push(new LogtailTransport(logtail));
  }

  // Create the Winston logger
  const winstonLogger = winston.createLogger({
    level: mergedOptions.level,
    defaultMeta: {
      service: mergedOptions.serviceName,
      environment: mergedOptions.environment,
      ...mergedOptions.defaultMeta,
    },
    format: winston.format.combine(
      contextFormat,
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS",
      }),
      winston.format.json(),
    ),
    transports,
  });

  // Create a custom logger that wraps Winston logger methods
  const logger: LoggerInterface = {
    error(message: string, meta: LogData = {}) {
      winstonLogger.error(
        message,
        sanitizeLogFields(meta, mergedOptions.sensitiveFields),
      );
    },
    warn(message: string, meta: LogData = {}) {
      winstonLogger.warn(
        message,
        sanitizeLogFields(meta, mergedOptions.sensitiveFields),
      );
    },
    info(message: string, meta: LogData = {}) {
      winstonLogger.info(
        message,
        sanitizeLogFields(meta, mergedOptions.sensitiveFields),
      );
    },
    http(message: string, meta: LogData = {}) {
      winstonLogger.http(
        message,
        sanitizeLogFields(meta, mergedOptions.sensitiveFields),
      );
    },
    debug(message: string, meta: LogData = {}) {
      winstonLogger.debug(
        message,
        sanitizeLogFields(meta, mergedOptions.sensitiveFields),
      );
    },
    trace(message: string, meta: LogData = {}) {
      // Use debug level since winston doesn't have trace
      winstonLogger.debug(
        `[TRACE] ${message}`,
        sanitizeLogFields(meta, mergedOptions.sensitiveFields),
      );
    },
    child(childMeta: LogData) {
      const childWinstonLogger = winstonLogger.child(childMeta);

      return {
        error(message: string, meta: LogData = {}) {
          childWinstonLogger.error(
            message,
            sanitizeLogFields(meta, mergedOptions.sensitiveFields),
          );
        },
        warn(message: string, meta: LogData = {}) {
          childWinstonLogger.warn(
            message,
            sanitizeLogFields(meta, mergedOptions.sensitiveFields),
          );
        },
        info(message: string, meta: LogData = {}) {
          childWinstonLogger.info(
            message,
            sanitizeLogFields(meta, mergedOptions.sensitiveFields),
          );
        },
        http(message: string, meta: LogData = {}) {
          childWinstonLogger.http(
            message,
            sanitizeLogFields(meta, mergedOptions.sensitiveFields),
          );
        },
        debug(message: string, meta: LogData = {}) {
          childWinstonLogger.debug(
            message,
            sanitizeLogFields(meta, mergedOptions.sensitiveFields),
          );
        },
        trace(message: string, meta: LogData = {}) {
          childWinstonLogger.debug(
            `[TRACE] ${message}`,
            sanitizeLogFields(meta, mergedOptions.sensitiveFields),
          );
        },
        child(grandchildMeta: LogData) {
          // Support for nested child loggers
          const combinedMeta = { ...childMeta, ...grandchildMeta };
          return logger.child(combinedMeta);
        },
      };
    },
  };

  return logger;
}

// Default logger instance
export const logger = createLogger();
