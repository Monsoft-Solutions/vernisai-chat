import {
  CounterMetric,
  GaugeMetric,
  HistogramMetric,
  MetricsManager,
  SummaryMetric,
} from "../types";

/**
 * Simple counter implementation
 */
class Counter implements CounterMetric {
  public type = "counter" as const;
  public value = 0;

  constructor(
    public name: string,
    public description?: string,
    public labels?: Record<string, string>,
  ) {}

  increment(amount = 1): void {
    this.value += amount;
  }
}

/**
 * Simple gauge implementation
 */
class Gauge implements GaugeMetric {
  public type = "gauge" as const;
  public value = 0;

  constructor(
    public name: string,
    public description?: string,
    public labels?: Record<string, string>,
  ) {}

  set(value: number): void {
    this.value = value;
  }

  increment(amount = 1): void {
    this.value += amount;
  }

  decrement(amount = 1): void {
    this.value -= amount;
  }
}

/**
 * Simple histogram implementation
 */
class Histogram implements HistogramMetric {
  public type = "histogram" as const;
  private distribution: { [bucket: string]: number } = {};
  private buckets: number[];

  constructor(
    public name: string,
    buckets: number[] = [0.01, 0.05, 0.1, 0.5, 1, 5, 10, 50, 100, 500, 1000],
    public description?: string,
    public labels?: Record<string, string>,
  ) {
    this.buckets = [...buckets].sort((a, b) => a - b);
    this.buckets.forEach((bucket) => {
      this.distribution[bucket.toString()] = 0;
    });
    // Add infinity bucket
    this.distribution["Inf"] = 0;
  }

  observe(value: number): void {
    let foundBucket = false;

    for (const bucket of this.buckets) {
      if (value <= bucket) {
        this.distribution[bucket.toString()]++;
        foundBucket = true;
        break;
      }
    }

    // If value is larger than all explicit buckets, put it in the "Inf" bucket
    if (!foundBucket) {
      this.distribution["Inf"]++;
    }
  }

  getDistribution(): { [bucket: string]: number } {
    return { ...this.distribution };
  }
}

/**
 * Simple summary implementation
 */
class Summary implements SummaryMetric {
  public type = "summary" as const;
  private values: number[] = [];
  private quantiles: number[];

  constructor(
    public name: string,
    quantiles: number[] = [0.5, 0.9, 0.95, 0.99],
    public description?: string,
    public labels?: Record<string, string>,
  ) {
    this.quantiles = quantiles;
  }

  observe(value: number): void {
    this.values.push(value);

    // Keep the array size manageable
    if (this.values.length > 1000) {
      this.values = this.values.slice(-1000);
    }
  }

  getQuantiles(): { [quantile: string]: number } {
    const result: { [quantile: string]: number } = {};
    const sortedValues = [...this.values].sort((a, b) => a - b);

    if (sortedValues.length === 0) {
      return {};
    }

    for (const q of this.quantiles) {
      const pos = Math.floor(sortedValues.length * q);
      result[q.toString()] =
        sortedValues[pos] || sortedValues[sortedValues.length - 1];
    }

    return result;
  }
}

// Store metrics by name
const metricsStore = new Map<
  string,
  CounterMetric | GaugeMetric | HistogramMetric | SummaryMetric
>();

/**
 * Generate a unique key for a metric with labels
 */
function getMetricKey(name: string, labels?: Record<string, string>): string {
  if (!labels) return name;

  const labelStr = Object.entries(labels)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}="${value}"`)
    .join(",");

  return `${name}{${labelStr}}`;
}

/**
 * Helper to get or create a counter
 */
function getOrCreateCounter(
  name: string,
  description?: string,
  labels?: Record<string, string>,
): CounterMetric {
  const key = getMetricKey(name, labels);
  const existing = metricsStore.get(key);

  if (existing && existing.type === "counter") {
    return existing as CounterMetric;
  }

  const counter = new Counter(name, description, labels);
  metricsStore.set(key, counter);
  return counter;
}

/**
 * Helper to get or create a histogram
 */
function getOrCreateHistogram(
  name: string,
  buckets?: number[],
  description?: string,
  labels?: Record<string, string>,
): HistogramMetric {
  const key = getMetricKey(name, labels);
  const existing = metricsStore.get(key);

  if (existing && existing.type === "histogram") {
    return existing as HistogramMetric;
  }

  const histogram = new Histogram(name, buckets, description, labels);
  metricsStore.set(key, histogram);
  return histogram;
}

/**
 * Metrics manager implementation
 */
export const metricsManager: MetricsManager = {
  /**
   * Create a new counter metric
   */
  createCounter(
    name: string,
    description?: string,
    labels?: Record<string, string>,
  ): CounterMetric {
    const counter = new Counter(name, description, labels);
    metricsStore.set(getMetricKey(name, labels), counter);
    return counter;
  },

  /**
   * Create a new gauge metric
   */
  createGauge(
    name: string,
    description?: string,
    labels?: Record<string, string>,
  ): GaugeMetric {
    const gauge = new Gauge(name, description, labels);
    metricsStore.set(getMetricKey(name, labels), gauge);
    return gauge;
  },

  /**
   * Create a new histogram metric
   */
  createHistogram(
    name: string,
    buckets?: number[],
    description?: string,
    labels?: Record<string, string>,
  ): HistogramMetric {
    const histogram = new Histogram(name, buckets, description, labels);
    metricsStore.set(getMetricKey(name, labels), histogram);
    return histogram;
  },

  /**
   * Create a new summary metric
   */
  createSummary(
    name: string,
    quantiles?: number[],
    description?: string,
    labels?: Record<string, string>,
  ): SummaryMetric {
    const summary = new Summary(name, quantiles, description, labels);
    metricsStore.set(getMetricKey(name, labels), summary);
    return summary;
  },

  /**
   * Record request metrics
   */
  recordRequestMetrics(
    path: string,
    method: string,
    statusCode: number,
    latency: number,
  ): void {
    // Create or get request counter
    const requestCounter = getOrCreateCounter(
      "http_requests_total",
      "Total number of HTTP requests",
      { path, method },
    );
    requestCounter.increment();

    // Track latency in histogram
    const latencyHistogram = getOrCreateHistogram(
      "http_request_duration_seconds",
      undefined,
      "HTTP request latency in seconds",
      { path, method },
    );
    latencyHistogram.observe(latency / 1000); // Convert ms to seconds

    // Count by status code
    const statusCounter = getOrCreateCounter(
      "http_response_status_total",
      "Total number of HTTP responses by status code",
      { path, method, status: statusCode.toString() },
    );
    statusCounter.increment();
  },
};
