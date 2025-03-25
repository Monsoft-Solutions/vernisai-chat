/**
 * Usage data types for dashboard analytics
 */

/**
 * Represents a single data point for usage graphs
 */
export type UsageData = {
  date: string;
  value: number;
};

/**
 * Types of usage metrics that can be tracked
 */
export type UsageMetricType =
  | "messages"
  | "tokens"
  | "sessions"
  | "tools"
  | "apiCalls";

/**
 * Usage metrics with time period
 */
export type UsageMetrics = {
  type: UsageMetricType;
  period: "daily" | "weekly" | "monthly";
  data: UsageData[];
  total: number;
  previousPeriodTotal?: number;
  changePercentage?: number;
};
