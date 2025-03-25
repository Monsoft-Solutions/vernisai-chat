/**
 * Available log levels
 */
export type LogLevel = "error" | "warn" | "info" | "http" | "debug" | "trace";

/**
 * Base log data interface
 */
export type LogData = Record<string, unknown>;

/**
 * Logger options for configuration
 */
export interface LoggerOptions {
  /** Service name for the logger */
  serviceName: string;

  /** Environment (production, development, test) */
  environment?: string;

  /** Default log level */
  level?: LogLevel;

  /** Enable/disable specific transports */
  transports?: {
    console?: boolean;
    logtail?: boolean;
    metrics?: boolean;
  };

  /** Logtail specific configuration */
  logtail?: {
    sourceToken?: string;
    endpoint?: string;
  };

  /** Fields to sanitize (redact) from logs */
  sensitiveFields?: string[];

  /** Additional default metadata */
  defaultMeta?: LogData;
}

/**
 * Extended winston logger interface with additional methods
 */
export interface Logger {
  error(message: string, meta?: LogData): void;
  warn(message: string, meta?: LogData): void;
  info(message: string, meta?: LogData): void;
  http(message: string, meta?: LogData): void;
  debug(message: string, meta?: LogData): void;
  trace(message: string, meta?: LogData): void;

  /**
   * Create a child logger with additional context
   */
  child(options: LogData): Logger;
}

/**
 * Logger factory function type
 */
export interface LoggerFactory {
  (options?: Partial<LoggerOptions>): Logger;
}
