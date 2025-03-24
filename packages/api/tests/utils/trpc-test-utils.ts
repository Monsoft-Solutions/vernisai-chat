/**
 * TRPC Test Utilities
 *
 * This file provides utilities for testing tRPC endpoints.
 */
import { createInnerTRPCContext } from "../../src/trpc";
import { TRPCError } from "@trpc/server";
import type { CreateContextOptions } from "../../src/trpc";
import type { AnyRouter } from "@trpc/server";

/**
 * Test context options with defaults that can be overridden for specific tests
 */
export type TestContextOptions = Partial<CreateContextOptions>;

/**
 * Create a test context for tRPC router testing
 *
 * @param options - Optional overrides for the test context
 * @returns A configured tRPC context for testing
 */
export function createTestContext(options: TestContextOptions = {}) {
  // Default test context with authenticated user
  const defaultOptions: CreateContextOptions = {
    session: { userId: "test-user-id" },
    organizationId: "test-org-id",
  };

  // Merge default options with overrides
  const mergedOptions = { ...defaultOptions, ...options };

  return createInnerTRPCContext(mergedOptions);
}

/**
 * Create an unauthenticated test context
 *
 * @returns A tRPC context with no authenticated user
 */
export function createUnauthenticatedTestContext() {
  return createTestContext({ session: null });
}

/**
 * Create a test context without an organization ID
 *
 * @returns A tRPC context with an authenticated user but no organization
 */
export function createNoOrganizationTestContext() {
  return createTestContext({
    session: { userId: "test-user-id" },
    organizationId: undefined,
  });
}

/**
 * Helper to create a mock tRPC caller for routers
 *
 * @param router - The tRPC router to create a caller for
 * @param ctx - Optional test context to use
 * @returns A mocked tRPC caller for testing
 */
export function createMockCaller<T extends AnyRouter>(
  router: T,
  ctx: ReturnType<typeof createTestContext> = createTestContext(),
) {
  return router.createCaller(ctx);
}

/**
 * Handle any TRPCError that might be thrown and assert its properties
 *
 * @param fn - Async function that might throw a TRPCError
 * @param expectedCode - Expected error code
 * @param expectedMessage - Optional expected error message
 */
export async function expectTRPCError(
  fn: () => Promise<unknown>,
  expectedCode: TRPCError["code"],
  expectedMessage?: string,
) {
  try {
    await fn();
    // If we get here, the function didn't throw, which is an error
    throw new Error(
      `Expected TRPCError with code ${expectedCode} but no error was thrown`,
    );
  } catch (err) {
    // Ensure it's a TRPCError
    expect(err).toBeInstanceOf(TRPCError);

    const trpcError = err as TRPCError;
    expect(trpcError.code).toBe(expectedCode);

    if (expectedMessage) {
      expect(trpcError.message).toBe(expectedMessage);
    }
  }
}
