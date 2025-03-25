import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  mockOrganizationInfo,
  mockRecentConversations,
  mockAgents,
  mockUsageData,
  mockTools,
  mockModels,
  mockTestMessages,
  mockAgentTemplates,
} from "../mock/dashboard";

/**
 * Dashboard router for dashboard-related endpoints
 */
export const dashboardRouter = router({
  /**
   * Get organization information
   */
  getOrganizationInfo: publicProcedure.query(async () => {
    try {
      return mockOrganizationInfo;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve organization information",
        cause: error,
      });
    }
  }),

  /**
   * Get recent conversations
   */
  getRecentConversations: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(10),
          filter: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      try {
        const limit = input?.limit || 10;
        const filter = input?.filter?.toLowerCase() || "";

        const filteredConversations = mockRecentConversations
          .filter((conv) => {
            if (!filter) return true;
            return (
              conv.title.toLowerCase().includes(filter) ||
              conv.model.toLowerCase().includes(filter) ||
              conv.snippet.toLowerCase().includes(filter)
            );
          })
          .slice(0, limit);

        return filteredConversations;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve recent conversations",
          cause: error,
        });
      }
    }),

  /**
   * Get available agents
   */
  getAgents: publicProcedure
    .input(
      z
        .object({
          filter: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      try {
        const filter = input?.filter?.toLowerCase() || "";

        if (!filter) {
          return mockAgents;
        }

        return mockAgents.filter((agent) => {
          return (
            agent.name.toLowerCase().includes(filter) ||
            agent.description.toLowerCase().includes(filter) ||
            agent.capabilities.some((cap) => cap.toLowerCase().includes(filter))
          );
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve agents",
          cause: error,
        });
      }
    }),

  /**
   * Get usage data
   */
  getUsageData: publicProcedure
    .input(
      z
        .object({
          days: z.number().min(1).max(365).default(30),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      try {
        const days = input?.days || 30;
        return mockUsageData.slice(-days);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve usage data",
          cause: error,
        });
      }
    }),

  /**
   * Get available tools
   */
  getTools: publicProcedure.query(async () => {
    try {
      return mockTools;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve tools",
        cause: error,
      });
    }
  }),

  /**
   * Get available models
   */
  getModels: publicProcedure.query(async () => {
    try {
      return mockModels;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve models",
        cause: error,
      });
    }
  }),

  /**
   * Get test messages for agent testing
   */
  getTestMessages: publicProcedure.query(async () => {
    try {
      return mockTestMessages;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve test messages",
        cause: error,
      });
    }
  }),

  /**
   * Get agent templates
   */
  getAgentTemplates: publicProcedure.query(async () => {
    try {
      return mockAgentTemplates;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve agent templates",
        cause: error,
      });
    }
  }),
});
