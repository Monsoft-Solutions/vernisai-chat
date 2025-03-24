import { z } from "zod";
import { router, organizationProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

/**
 * Conversation router with conversation-related endpoints
 */
export const conversationRouter = router({
  /**
   * Get conversation by ID
   */
  getById: organizationProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        // In a real implementation, this would use a conversation service
        return {
          id: input.id,
          title: `Conversation ${input.id}`,
          organizationId: ctx.organizationId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve conversation",
          cause: error,
        });
      }
    }),

  /**
   * List conversations
   */
  list: organizationProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        // In a real implementation, this would query the database
        const conversations = Array.from({ length: input.limit }, (_, i) => ({
          id: `conv-${i + 1}`,
          title: `Conversation ${i + 1}`,
          organizationId: ctx.organizationId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        const nextCursor =
          conversations.length === input.limit
            ? `cursor-${input.limit}`
            : undefined;

        return {
          conversations,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list conversations",
          cause: error,
        });
      }
    }),

  /**
   * Create a new conversation
   */
  create: organizationProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // In a real implementation, this would create a conversation in the database
        const id = `conv-${Math.floor(Math.random() * 1000)}`;

        return {
          id,
          title: input.title || `New Conversation`,
          organizationId: ctx.organizationId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create conversation",
          cause: error,
        });
      }
    }),
});
