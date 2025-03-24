export * from "./react";

/**
 * Creates a random string for test identifiers
 *
 * @param prefix - Optional prefix for the ID
 * @returns A unique random string
 */
export function generateTestId(prefix = "test"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Delay execution for the specified time
 *
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a mock function that resolves after a delay
 *
 * @param returnValue - Value to return
 * @param delayMs - Delay in milliseconds
 * @returns Mock function that resolves after a delay
 */
export function createDelayedMock<T>(
  returnValue: T,
  delayMs = 100,
): () => Promise<T> {
  return async () => {
    await delay(delayMs);
    return returnValue;
  };
}

/**
 * Creates a mock that throws an error after a delay
 *
 * @param errorMessage - Error message
 * @param delayMs - Delay in milliseconds
 * @returns Mock function that throws after a delay
 */
export function createErrorMock(
  errorMessage: string,
  delayMs = 100,
): () => Promise<never> {
  return async () => {
    await delay(delayMs);
    throw new Error(errorMessage);
  };
}

/**
 * Type definition for a mocked function
 */
export interface MockedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T>;
  mockImplementation: (impl: T) => void;
  mockResolvedValue: (value: unknown) => void;
  mockRejectedValue: (reason: unknown) => void;
  mockReturnValue: (value: unknown) => void;
  mock: {
    calls: unknown[][];
  };
}

/**
 * Type-safe mock creator for functions
 *
 * @returns Mock function with type-safety
 */
export function createTypedMock<T extends (...args: unknown[]) => unknown>(): {
  mock: MockedFunction<T>;
  mockImplementation: (impl: T) => void;
  mockResolvedValue: (
    value: ReturnType<T> extends Promise<infer R> ? R : never,
  ) => void;
  mockRejectedValue: (err: unknown) => void;
  mockReturnValue: (value: ReturnType<T>) => void;
} {
  // Mock implementation using global vi
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mock = { fn: () => {} } as any as MockedFunction<T>;
  mock.mockImplementation = () => {};
  mock.mockResolvedValue = () => {};
  mock.mockRejectedValue = () => {};
  mock.mockReturnValue = () => {};
  mock.mock = { calls: [] };

  return {
    mock,
    mockImplementation: (impl: T) => {
      mock.mockImplementation(impl);
    },
    mockResolvedValue: (value) => {
      mock.mockResolvedValue(value);
    },
    mockRejectedValue: (err) => {
      mock.mockRejectedValue(err);
    },
    mockReturnValue: (value) => {
      mock.mockReturnValue(value);
    },
  };
}
