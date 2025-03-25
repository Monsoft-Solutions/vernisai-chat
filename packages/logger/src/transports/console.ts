import winston from "winston";
import { ConsoleTransportConfig } from "../types";

/**
 * Create a formatted console transport with options
 */
export function createConsoleTransport(
  options: ConsoleTransportConfig = {},
): winston.transports.ConsoleTransportInstance {
  const {
    level,
    colors = true,
    json = false,
    timestampFormat = "YYYY-MM-DD HH:mm:ss.SSS",
  } = options;

  const format = json
    ? winston.format.json()
    : winston.format.combine(
        colors ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.timestamp({
          format: timestampFormat,
        }),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const requestId = meta.requestId ? ` [${meta.requestId}]` : "";
          return `${timestamp} ${level}:${requestId} ${message} ${
            Object.keys(meta).length > 0 &&
            (!meta.requestId || Object.keys(meta).length > 1)
              ? JSON.stringify(meta, null, 2)
              : ""
          }`;
        }),
      );

  return new winston.transports.Console({
    level,
    format,
  });
}
