/**
 * Organization types for the dashboard
 */

/**
 * Subscription plan types
 */
export type SubscriptionPlan = "Free" | "Pro" | "Enterprise";

/**
 * Organization information
 */
export type OrganizationInfo = {
  name: string;
  activeUsers: number;
  totalUsers: number;
  subscriptionPlan: SubscriptionPlan;
  usagePercent: number;
  createdAt: Date;
  renewalDate: Date;
  usageLimit: number;
};
