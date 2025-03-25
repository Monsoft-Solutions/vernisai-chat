import winston from "winston";
import { contextManager } from "../core";

/**
 * Create a formatter that adds request context to logs
 */
export function createContextFormat() {
  return winston.format((info) => {
    const context = contextManager.getContext();
    if (context) {
      // Add context data to log entry
      return {
        ...info,
        ...context,
      };
    }
    return info;
  });
}

/**
 * Create a development-friendly console format
 *
 * @param options - Format options
 * @returns Winston format
 */
export function createConsoleFormat(
  options: {
    colors?: boolean;
    timestamp?: boolean;
    timestampFormat?: string;
    showMeta?: boolean;
    metaStringify?: boolean;
  } = {},
) {
  const {
    colors = true,
    timestamp = true,
    timestampFormat = "YYYY-MM-DD HH:mm:ss.SSS",
    showMeta = true,
    metaStringify = true,
  } = options;

  return winston.format.combine(
    ...(colors ? [winston.format.colorize()] : []),
    ...(timestamp
      ? [winston.format.timestamp({ format: timestampFormat })]
      : []),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      // Extract request ID if present for special formatting
      const requestId = meta.requestId ? ` [${meta.requestId}]` : "";
      delete meta.requestId;

      // Format the rest of the metadata
      let metaStr = "";
      if (showMeta && Object.keys(meta).length > 0) {
        if (metaStringify) {
          metaStr = JSON.stringify(meta, null, 2);
        } else {
          metaStr = Object.entries(meta)
            .map(([key, val]) => `${key}=${val}`)
            .join(" ");
        }
      }

      // Build the final log message
      return `${timestamp ? `${timestamp} ` : ""}${level}:${requestId} ${message}${
        metaStr ? ` ${metaStr}` : ""
      }`;
    }),
  );
}

/**
 * Create a JSON format with additional formatting
 *
 * @param options - Format options
 * @returns Winston format
 */
export function createJsonFormat(
  options: {
    timestamp?: boolean;
    timestampFormat?: string;
  } = {},
) {
  const { timestamp = true, timestampFormat = "YYYY-MM-DD HH:mm:ss.SSS" } =
    options;

  return winston.format.combine(
    ...(timestamp
      ? [winston.format.timestamp({ format: timestampFormat })]
      : []),
    winston.format.json(),
  );
}
