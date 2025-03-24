import { z } from "zod";
import { router, organizationProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

/**
 * Message router with message-related endpoints
 */
export const messageRouter = router({
  /**
   * Get message by ID
   */
  getById: organizationProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        // In a real implementation, this would use a message service
        return {
          id: input.id,
          conversationId: `conv-${Math.floor(Math.random() * 100)}`,
          content: `This is message ${input.id}`,
          role: "user",
          createdAt: new Date().toISOString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve message",
          cause: error,
        });
      }
    }),

  /**
   * List messages for a conversation
   */
  listByConversation: organizationProcedure
    .input(
      z.object({
        conversationId: z.string(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        // In a real implementation, this would query the database
        const messages = Array.from({ length: input.limit }, (_, i) => ({
          id: `msg-${i + 1}`,
          conversationId: input.conversationId,
          content: `Message ${i + 1} in conversation ${input.conversationId}`,
          role: i % 2 === 0 ? "user" : "assistant",
          createdAt: new Date().toISOString(),
        }));

        const nextCursor =
          messages.length === input.limit ? `cursor-${input.limit}` : undefined;

        return {
          messages,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list messages",
          cause: error,
        });
      }
    }),

  /**
   * Create a new message
   */
  create: organizationProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string().min(1),
        role: z.enum(["user", "assistant", "system"]).default("user"),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // In a real implementation, this would create a message in the database
        const id = `msg-${Math.floor(Math.random() * 1000)}`;

        return {
          id,
          conversationId: input.conversationId,
          content: input.content,
          role: input.role,
          createdAt: new Date().toISOString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create message",
          cause: error,
        });
      }
    }),

  /**
   * Send a message and get AI response (streaming)
   */
  sendMessage: organizationProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // In a real implementation, this would:
        // 1. Save the user message
        // 2. Generate a response with an AI model
        // 3. Save the AI response

        const userMessageId = `msg-user-${Math.floor(Math.random() * 1000)}`;
        const aiMessageId = `msg-ai-${Math.floor(Math.random() * 1000)}`;

        return {
          userMessage: {
            id: userMessageId,
            conversationId: input.conversationId,
            content: input.content,
            role: "user",
            createdAt: new Date().toISOString(),
          },
          assistantMessage: {
            id: aiMessageId,
            conversationId: input.conversationId,
            content: `This is an AI response to: "${input.content}"`,
            role: "assistant",
            createdAt: new Date().toISOString(),
          },
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process message",
          cause: error,
        });
      }
    }),
});
