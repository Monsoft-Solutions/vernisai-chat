import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

/**
 * User router with user-related endpoints
 */
export const userRouter = router({
  /**
   * Get current user information
   */
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      // In a real implementation, this would use a user service
      // For now, we're just returning the user ID from the session
      return {
        id: ctx.session.userId,
        email: `user-${ctx.session.userId}@example.com`,
        name: `User ${ctx.session.userId}`,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve user information",
        cause: error,
      });
    }
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // In a real implementation, this would use a user service to update the profile
        return {
          id: ctx.session.userId,
          name: input.name || `User ${ctx.session.userId}`,
          email: input.email || `user-${ctx.session.userId}@example.com`,
          updatedAt: new Date().toISOString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user profile",
          cause: error,
        });
      }
    }),

  /**
   * List all users (admin only in a real implementation)
   */
  listUsers: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        // In a real implementation, this would query the database
        const users = Array.from({ length: input.limit }, (_, i) => ({
          id: `user-${i + 1}`,
          name: `User ${i + 1}`,
          email: `user-${i + 1}@example.com`,
        }));

        const nextCursor =
          users.length === input.limit ? `cursor-${input.limit}` : undefined;

        return {
          users,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve users list",
          cause: error,
        });
      }
    }),
});
