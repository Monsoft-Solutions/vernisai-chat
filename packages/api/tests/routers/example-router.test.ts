/**
 * Example Router Tests
 *
 * Demonstrates how to test tRPC endpoints.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTestContext } from "../utils/trpc-test-utils";
import { router, publicProcedure, protectedProcedure } from "../../src/trpc";
import { z } from "zod";

// Mock service that would be used by the router
const mockService = {
  getData: vi.fn(),
  saveData: vi.fn(),
};

// Define the handler functions separately to test them directly
const publicExampleHandler = ({ input }: { input: { text: string } }) => {
  return {
    message: `You said: ${input.text}`,
    timestamp: new Date().toISOString(),
  };
};

const protectedExampleHandler = async ({
  input,
  ctx,
}: {
  input: { id: string };
  ctx: ReturnType<typeof createTestContext>;
}) => {
  // In a real implementation, this would call a service/database
  // Here we're using our mock
  if (!ctx.session) {
    throw new Error("Session is null");
  }

  mockService.saveData(input.id, ctx.session.userId);

  return {
    success: true,
    userId: ctx.session.userId,
    organizationId: ctx.organizationId,
  };
};

// Create the router definition for documentation purposes
router({
  publicExample: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(publicExampleHandler),

  protectedExample: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(protectedExampleHandler),
});

describe("Example Router", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    mockService.getData.mockResolvedValue({ data: "test data" });
    mockService.saveData.mockResolvedValue(true);
  });

  describe("publicExample", () => {
    it("should return formatted message with input text", async () => {
      // Test the handler directly
      const input = { text: "Hello, world!" };
      const result = publicExampleHandler({ input });

      // Assert the result
      expect(result).toMatchObject({
        message: `You said: ${input.text}`,
        timestamp: expect.any(String),
      });
    });
  });

  describe("protectedExample", () => {
    it("should save data with user ID when authenticated", async () => {
      // Create a test context with authenticated user
      const ctx = createTestContext();
      const input = { id: "test-id" };

      // Call the handler directly
      await protectedExampleHandler({ ctx, input });

      // Verify the mock service was called correctly
      expect(mockService.saveData).toHaveBeenCalledWith(
        "test-id",
        "test-user-id",
      );
    });

    it("should include organization ID in the response", async () => {
      // Create a test context with authenticated user
      const ctx = createTestContext();
      const input = { id: "test-id" };

      // Call the handler directly
      const result = await protectedExampleHandler({ ctx, input });

      // Verify the response includes the organization ID
      expect(result).toEqual({
        success: true,
        userId: "test-user-id",
        organizationId: "test-org-id",
      });
    });
  });
});
