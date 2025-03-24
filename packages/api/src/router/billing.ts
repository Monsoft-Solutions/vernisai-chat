import { z } from "zod";
import { router, organizationProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

/**
 * Billing router with billing-related endpoints
 */
export const billingRouter = router({
  /**
   * Get organization subscription
   */
  getSubscription: organizationProcedure.query(async ({ ctx }) => {
    try {
      // In a real implementation, this would query the Stripe API
      return {
        organizationId: ctx.organizationId,
        planId: "premium",
        planName: "Premium Plan",
        status: "active",
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve subscription information",
        cause: error,
      });
    }
  }),

  /**
   * Get organization usage
   */
  getUsage: organizationProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month"]).default("month"),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        // In a real implementation, this would query the database for usage statistics
        const messagesCount = 1250;
        const tokensUsed = 352500;
        const agentExecutions = 45;

        return {
          organizationId: ctx.organizationId,
          period: input.period,
          messagesCount,
          tokensUsed,
          agentExecutions,
          lastUpdated: new Date().toISOString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve usage information",
          cause: error,
        });
      }
    }),

  /**
   * Create checkout session
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        organizationId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // In a real implementation, this would create a Stripe checkout session
        return {
          sessionId: `session-${Math.floor(Math.random() * 1000)}`,
          url: `https://checkout.stripe.com/example?session=${Math.floor(Math.random() * 1000)}`,
          planId: input.planId,
          organizationId: input.organizationId,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
          cause: error,
        });
      }
    }),

  /**
   * List available plans
   */
  listPlans: protectedProcedure.query(async () => {
    try {
      // In a real implementation, this would query the Stripe API
      return {
        plans: [
          {
            id: "free",
            name: "Free",
            description: "Limited access for personal use",
            price: 0,
            priceId: "price_free",
            features: [
              "5 AI conversations per day",
              "Basic agents",
              "Community support",
            ],
          },
          {
            id: "premium",
            name: "Premium",
            description: "Enhanced capabilities for professionals",
            price: 19.99,
            priceId: "price_premium",
            features: [
              "Unlimited AI conversations",
              "Custom agents",
              "Priority support",
              "API access",
            ],
          },
          {
            id: "business",
            name: "Business",
            description: "Complete solution for businesses",
            price: 49.99,
            priceId: "price_business",
            features: [
              "Everything in Premium",
              "Organization management",
              "Advanced analytics",
              "Dedicated support",
              "SSO integration",
            ],
          },
        ],
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve plans",
        cause: error,
      });
    }
  }),
});
