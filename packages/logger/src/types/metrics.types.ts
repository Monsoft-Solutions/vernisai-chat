/**
 * Metric types that can be tracked
 */
export type MetricType = "counter" | "gauge" | "histogram" | "summary";

/**
 * Base metric interface
 */
export interface Metric {
  /** Metric name */
  name: string;

  /** Metric type */
  type: MetricType;

  /** Metric description */
  description?: string;

  /** Labels/tags for the metric */
  labels?: Record<string, string>;
}

/**
 * Counter metric for cumulative values
 */
export interface CounterMetric extends Metric {
  type: "counter";

  /** Current value */
  value: number;

  /** Increment counter by specified amount */
  increment(amount?: number): void;
}

/**
 * Gauge metric for values that can go up and down
 */
export interface GaugeMetric extends Metric {
  type: "gauge";

  /** Current value */
  value: number;

  /** Set gauge to specific value */
  set(value: number): void;

  /** Increment gauge by specified amount */
  increment(amount?: number): void;

  /** Decrement gauge by specified amount */
  decrement(amount?: number): void;
}

/**
 * Histogram metric for distributions of values
 */
export interface HistogramMetric extends Metric {
  type: "histogram";

  /** Observe a value */
  observe(value: number): void;

  /** Get current distribution */
  getDistribution(): { [bucket: string]: number };
}

/**
 * Summary metric similar to histogram but with quantiles
 */
export interface SummaryMetric extends Metric {
  type: "summary";

  /** Observe a value */
  observe(value: number): void;

  /** Get current quantiles */
  getQuantiles(): { [quantile: string]: number };
}

/**
 * Performance timing data
 */
export interface PerformanceMetrics {
  /** Request latency in ms */
  requestLatency?: number;

  /** Database query latency in ms */
  dbLatency?: number;

  /** External API call latency in ms */
  apiLatency?: number;

  /** CPU usage percentage */
  cpuUsage?: number;

  /** Memory usage in bytes */
  memoryUsage?: number;

  /** Custom metrics */
  [key: string]: number | undefined;
}

/**
 * Metrics manager interface
 */
export interface MetricsManager {
  /** Create a new counter */
  createCounter(
    name: string,
    description?: string,
    labels?: Record<string, string>,
  ): CounterMetric;

  /** Create a new gauge */
  createGauge(
    name: string,
    description?: string,
    labels?: Record<string, string>,
  ): GaugeMetric;

  /** Create a new histogram */
  createHistogram(
    name: string,
    buckets?: number[],
    description?: string,
    labels?: Record<string, string>,
  ): HistogramMetric;

  /** Create a new summary */
  createSummary(
    name: string,
    quantiles?: number[],
    description?: string,
    labels?: Record<string, string>,
  ): SummaryMetric;

  /** Record performance metrics for a request */
  recordRequestMetrics(
    path: string,
    method: string,
    statusCode: number,
    latency: number,
  ): void;
}
