/**
 * Custom matchers for Vitest
 */

// Type definitions for custom matchers
export interface CustomMatchers<R = unknown> {
  toBeSuccessful(): R;
  toHaveSucceeded(): R;
  toBeDateNear(date: Date, toleranceMs?: number): R;
  toBeWithinDaysOf(date: Date, days: number): R;
  toHaveBeenCalledAtLeastOnceWith(...args: unknown[]): R;
}

// Mock of expect for standalone usage
const expectMock = {
  extend: (matchers: Record<string, unknown>): void => {
    // This is just a mock implementation
    // In actual usage, this will be replaced by the testing framework's implementation
    console.log("Mock expect.extend called with", Object.keys(matchers));
  },
};

/**
 * Custom matchers for Vitest
 */
export function setupCustomMatchers(expectObj = expectMock) {
  // Add custom matchers
  expectObj.extend({
    /**
     * Check if response is successful (status 2xx)
     */
    toBeSuccessful(received: { status?: number; statusCode?: number }) {
      const status = received?.status || received?.statusCode;
      const pass = typeof status === "number" && status >= 200 && status < 300;

      return {
        pass,
        message: () =>
          `expected response ${pass ? "not " : ""}to be successful, got status ${status}`,
      };
    },

    /**
     * Alias for toBeSuccessful
     */
    toHaveSucceeded(received: { status?: number; statusCode?: number }) {
      // @ts-expect-error - this is handled by the framework
      return this.toBeSuccessful(received);
    },

    /**
     * Check if date is close to another date
     */
    toBeDateNear(received: unknown, expected: unknown, toleranceMs = 1000) {
      const receivedDate =
        received instanceof Date ? received : new Date(received as string);
      const expectedDate =
        expected instanceof Date ? expected : new Date(expected as string);

      const diffMs = Math.abs(receivedDate.getTime() - expectedDate.getTime());
      const pass = diffMs <= toleranceMs;

      return {
        pass,
        message: () =>
          `expected date ${receivedDate.toISOString()} ${
            pass ? "not " : ""
          }to be within ${toleranceMs}ms of ${expectedDate.toISOString()}, difference was ${diffMs}ms`,
      };
    },

    /**
     * Check if date is within a certain number of days of another date
     */
    toBeWithinDaysOf(received: unknown, expected: unknown, days: number) {
      const receivedDate =
        received instanceof Date ? received : new Date(received as string);
      const expectedDate =
        expected instanceof Date ? expected : new Date(expected as string);

      const diffMs = Math.abs(receivedDate.getTime() - expectedDate.getTime());
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      const pass = diffDays <= days;

      return {
        pass,
        message: () =>
          `expected date ${receivedDate.toISOString()} ${
            pass ? "not " : ""
          }to be within ${days} days of ${expectedDate.toISOString()}, difference was ${diffDays.toFixed(
            2,
          )} days`,
      };
    },

    /**
     * Check if mock was called at least once with specific args
     */
    toHaveBeenCalledAtLeastOnceWith(
      received: { mock?: { calls: unknown[][] } },
      ...args: unknown[]
    ) {
      const calls = received.mock?.calls || [];

      const pass = calls.some((call) => {
        if (call.length !== args.length) return false;
        // @ts-expect-error - this is handled by the framework
        return call.every((arg, i) => this.equals(arg, args[i]));
      });

      return {
        pass,
        message: () =>
          `expected mock ${
            pass ? "not " : ""
          }to have been called at least once with ${JSON.stringify(args)}`,
      };
    },
  });

  return expectObj;
}

// Export custom matchers as default
export default setupCustomMatchers;
