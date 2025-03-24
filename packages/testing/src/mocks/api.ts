import { MockOptions, ApiResponseMock } from "../types";

/**
 * Creates a mock API client for testing
 *
 * @param options - Mock options
 * @returns Mocked API client
 */
export function mockApi(options: MockOptions = {}) {
  const { shouldError = false, delay = 0 } = options;

  // Simple response cache for consistent responses
  const responseCache = new Map<string, ApiResponseMock>();

  /**
   * Helper to simulate network delay
   */
  const simulateDelay = () =>
    delay > 0
      ? new Promise((resolve) => setTimeout(resolve, delay))
      : Promise.resolve();

  /**
   * Create a mock response for a specific endpoint
   *
   * @param endpoint - API endpoint
   * @param response - Response data
   */
  const mockEndpoint = <T>(endpoint: string, response: ApiResponseMock<T>) => {
    responseCache.set(endpoint, response);
  };

  /**
   * Generic request handler
   */
  const request = async <T>(
    method: string,
    endpoint: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _data?: unknown,
  ): Promise<T> => {
    await simulateDelay();

    if (shouldError) {
      throw new Error("API request failed (mock error)");
    }

    const cachedResponse = responseCache.get(endpoint) as ApiResponseMock<T>;

    if (cachedResponse) {
      if (cachedResponse.status >= 400) {
        throw new Error(cachedResponse.error || "API request failed");
      }
      return cachedResponse.data as T;
    }

    // Default success response
    return { success: true } as unknown as T;
  };

  return {
    /**
     * GET request
     *
     * @param endpoint - API endpoint
     * @returns Response data
     */
    get: <T>(endpoint: string) => request<T>("GET", endpoint),

    /**
     * POST request
     *
     * @param endpoint - API endpoint
     * @param data - Request data
     * @returns Response data
     */
    post: <T>(endpoint: string, data: unknown) =>
      request<T>("POST", endpoint, data),

    /**
     * PUT request
     *
     * @param endpoint - API endpoint
     * @param data - Request data
     * @returns Response data
     */
    put: <T>(endpoint: string, data: unknown) =>
      request<T>("PUT", endpoint, data),

    /**
     * DELETE request
     *
     * @param endpoint - API endpoint
     * @returns Response data
     */
    delete: <T>(endpoint: string) => request<T>("DELETE", endpoint),

    /**
     * Mock a specific endpoint
     *
     * @param endpoint - API endpoint
     * @param response - Response data
     */
    mockEndpoint,

    /**
     * Reset all mocked endpoints
     */
    reset: () => {
      responseCache.clear();
    },

    /**
     * Access to the response cache
     */
    _responseCache: responseCache,
  };
}
