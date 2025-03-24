/**
 * Simple Router Tests
 *
 * Demonstrates how to test tRPC routers using straightforward unit testing.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTestContext } from "../utils/trpc-test-utils";
import { TRPCError } from "@trpc/server";

// Mock function we want to test
const mockDataService = {
  getUserData: vi.fn(),
  saveUserData: vi.fn(),
};

// Define types for our test data
type UserData = {
  id: string;
  name: string;
  email: string;
};

type Context = {
  session: { userId: string } | null;
  organizationId?: string;
};

// Functions that would be in a router we're testing
function fetchUserData(ctx: Context, userId: string): UserData {
  // Check authentication
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Ensure user is requesting their own data or is an admin
  if (ctx.session.userId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Cannot access another user's data",
    });
  }

  return mockDataService.getUserData(userId);
}

function saveUserData<T extends Record<string, unknown>>(
  ctx: Context,
  userId: string,
  data: T,
): {
  success: boolean;
  userId: string;
  organizationId: string;
  updatedData: T;
} {
  // Check authentication
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Ensure user is saving their own data
  if (ctx.session.userId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Cannot modify another user's data",
    });
  }

  // Check for mandatory organization ID
  if (!ctx.organizationId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Organization ID is required",
    });
  }

  return mockDataService.saveUserData(userId, data, ctx.organizationId);
}

describe("User Data Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock implementations
    mockDataService.getUserData.mockImplementation((userId) => ({
      id: userId,
      name: "Test User",
      email: "test@example.com",
    }));

    mockDataService.saveUserData.mockImplementation((userId, data, orgId) => ({
      success: true,
      userId,
      organizationId: orgId,
      updatedData: data,
    }));
  });

  describe("fetchUserData", () => {
    it("should fetch user data for authorized user", () => {
      // Create test context with authenticated user
      const ctx = createTestContext({
        session: { userId: "user-123" },
      });

      // Call the function directly
      const result = fetchUserData(ctx, "user-123");

      // Check it called the service with correct ID
      expect(mockDataService.getUserData).toHaveBeenCalledWith("user-123");

      // Verify the result matches expected data
      expect(result).toEqual({
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      });
    });

    it("should throw UNAUTHORIZED when user is not authenticated", () => {
      // Create test context with no session
      const ctx = createTestContext({ session: null });

      // Verify it throws the expected error
      expect(() => fetchUserData(ctx, "user-123")).toThrow(TRPCError);
      expect(() => fetchUserData(ctx, "user-123")).toThrow(/UNAUTHORIZED/);

      // Ensure service was not called
      expect(mockDataService.getUserData).not.toHaveBeenCalled();
    });

    it("should throw FORBIDDEN when accessing another user's data", () => {
      // Create test context with different user
      const ctx = createTestContext({
        session: { userId: "user-456" },
      });

      // Verify it throws the expected error
      expect(() => fetchUserData(ctx, "user-123")).toThrow(TRPCError);
      expect(() => fetchUserData(ctx, "user-123")).toThrow(
        /Cannot access another user's data/,
      );

      // Ensure service was not called
      expect(mockDataService.getUserData).not.toHaveBeenCalled();
    });
  });

  describe("saveUserData", () => {
    it("should save data for authenticated user with organization", () => {
      // Create test context with authenticated user and organization
      const ctx = createTestContext();
      const testData = { value: "test-value" };

      // Call the function directly
      const result = saveUserData(ctx, "test-user-id", testData);

      // Check it called the service with correct params
      expect(mockDataService.saveUserData).toHaveBeenCalledWith(
        "test-user-id",
        testData,
        "test-org-id",
      );

      // Verify the result
      expect(result).toEqual({
        success: true,
        userId: "test-user-id",
        organizationId: "test-org-id",
        updatedData: testData,
      });
    });

    it("should throw BAD_REQUEST when organization ID is missing", () => {
      // Create test context with authenticated user but no organization
      const ctx = createTestContext({ organizationId: undefined });
      const testData = { value: "test-value" };

      // Verify it throws the expected error
      expect(() => saveUserData(ctx, "test-user-id", testData)).toThrow(
        TRPCError,
      );
      expect(() => saveUserData(ctx, "test-user-id", testData)).toThrow(
        /Organization ID is required/,
      );

      // Ensure service was not called
      expect(mockDataService.saveUserData).not.toHaveBeenCalled();
    });
  });
});
