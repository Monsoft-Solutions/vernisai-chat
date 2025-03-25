import { LogLevel } from "./logger.types";

/**
 * Base transport configuration
 */
export interface TransportConfig {
  /** Minimum log level for this transport */
  level?: LogLevel;

  /** Whether the transport is enabled */
  enabled?: boolean;
}

/**
 * Console transport options
 */
export interface ConsoleTransportConfig extends TransportConfig {
  /** Use colored output (for development) */
  colors?: boolean;

  /** Format logs as JSON */
  json?: boolean;

  /** Custom timestamp format */
  timestampFormat?: string;
}

/**
 * Logtail transport options
 */
export interface LogtailTransportConfig extends TransportConfig {
  /** Logtail source token */
  sourceToken: string;

  /** Custom endpoint URL */
  endpoint?: string;

  /** Maximum batch size */
  batchSize?: number;

  /** Maximum time to wait before sending batch (ms) */
  batchInterval?: number;
}

/**
 * Metrics transport options
 */
export interface MetricsTransportConfig extends TransportConfig {
  /** Types of metrics to collect */
  metricTypes?: ("request" | "response" | "error" | "custom")[];

  /** Sampling rate (0-1) */
  samplingRate?: number;

  /** Custom metrics endpoint */
  endpoint?: string;
}

/**
 * Combined transport options
 */
export interface TransportsConfig {
  console?: ConsoleTransportConfig;
  logtail?: LogtailTransportConfig;
  metrics?: MetricsTransportConfig;
}
