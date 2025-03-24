import { z } from "zod";
import { router, protectedProcedure, organizationProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

/**
 * Organization router with organization-related endpoints
 */
export const organizationRouter = router({
  /**
   * Get current organization
   */
  getCurrentOrganization: organizationProcedure.query(async ({ ctx }) => {
    try {
      // In a real implementation, this would use an organization service
      return {
        id: ctx.organizationId,
        name: `Organization ${ctx.organizationId}`,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve organization information",
        cause: error,
      });
    }
  }),

  /**
   * Create a new organization
   */
  createOrganization: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // In a real implementation, this would create an organization in the database
        const orgId = `org-${Math.floor(Math.random() * 1000)}`;

        return {
          id: orgId,
          name: input.name,
          createdAt: new Date().toISOString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create organization",
          cause: error,
        });
      }
    }),

  /**
   * Update organization settings
   */
  updateOrganization: organizationProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        settings: z
          .object({
            allowAgentCreation: z.boolean().optional(),
            maxUsers: z.number().positive().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // In a real implementation, this would update the organization in the database
        return {
          id: ctx.organizationId,
          name: input.name || `Organization ${ctx.organizationId}`,
          settings: {
            allowAgentCreation: input.settings?.allowAgentCreation ?? true,
            maxUsers: input.settings?.maxUsers ?? 10,
          },
          updatedAt: new Date().toISOString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update organization",
          cause: error,
        });
      }
    }),

  /**
   * List organization members
   */
  listMembers: organizationProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        // In a real implementation, this would query the database
        const members = Array.from({ length: input.limit }, (_, i) => ({
          id: `user-${i + 1}`,
          name: `User ${i + 1}`,
          email: `user-${i + 1}@org-${ctx.organizationId}.com`,
          role: i === 0 ? "ADMIN" : "MEMBER",
        }));

        const nextCursor =
          members.length === input.limit ? `cursor-${input.limit}` : undefined;

        return {
          members,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve organization members",
          cause: error,
        });
      }
    }),
});
