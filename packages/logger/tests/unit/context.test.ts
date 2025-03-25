import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { contextManager, asyncLocalStorage } from "../../src/core/context";
import { RequestContext } from "../../src/types";

// Mock AsyncLocalStorage
vi.mock("async_hooks", () => {
  let currentStore: Record<string, unknown> = {};

  return {
    AsyncLocalStorage: vi.fn().mockImplementation(() => ({
      getStore: vi.fn(() => currentStore),
      run: vi.fn((newStore, fn, ...args) => {
        const originalStore = { ...currentStore };
        // Update the store with the new context
        currentStore = { ...newStore };
        try {
          return fn(...args);
        } finally {
          // Restore original store after function execution
          currentStore = originalStore;
        }
      }),
    })),
  };
});

describe("Context Manager", () => {
  const mockContext: RequestContext = {
    requestId: "test-request-id",
    userId: "test-user-id",
    organizationId: "test-org-id",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getContext", () => {
    it("should return the current context from AsyncLocalStorage", () => {
      const mockStore = { requestId: "test-id" };
      vi.spyOn(asyncLocalStorage, "getStore").mockReturnValueOnce(
        mockStore as RequestContext,
      );

      const context = contextManager.getContext();

      expect(asyncLocalStorage.getStore).toHaveBeenCalled();
      expect(context).toEqual(mockStore);
    });

    it("should return undefined if no context is available", () => {
      vi.spyOn(asyncLocalStorage, "getStore").mockReturnValueOnce(undefined);

      const context = contextManager.getContext();

      expect(asyncLocalStorage.getStore).toHaveBeenCalled();
      expect(context).toBeUndefined();
    });
  });

  describe("runWithContext", () => {
    it("should run a function with the provided context", () => {
      const mockFn = vi.fn().mockReturnValue("test-result");
      vi.spyOn(asyncLocalStorage, "run");

      const result = contextManager.runWithContext(
        mockContext,
        mockFn,
        "arg1",
        "arg2",
      );

      expect(asyncLocalStorage.run).toHaveBeenCalledWith(
        mockContext,
        mockFn,
        "arg1",
        "arg2",
      );
      expect(result).toBe("test-result");
    });

    it("should preserve the original context after function execution", () => {
      const originalContext = { requestId: "original-id" };
      const newContext = { requestId: "new-id" };

      // Create a mock implementation for the AsyncLocalStorage run method
      // that will properly switch contexts
      const runMock = vi.fn().mockImplementation((newStore, fn, ...args) => {
        const currentContext = asyncLocalStorage.getStore();

        // Save original store reference before changing to new store
        const originalStore = currentContext;

        // Setup a spy to return the new context when called inside the function
        vi.spyOn(asyncLocalStorage, "getStore").mockReturnValueOnce(newStore);

        // Execute the function with the new context
        const result = fn(...args);

        // Reset getStore to return original context
        vi.spyOn(asyncLocalStorage, "getStore").mockReturnValueOnce(
          originalStore,
        );

        return result;
      });

      // Apply our mock implementation
      vi.spyOn(asyncLocalStorage, "run").mockImplementation(runMock);

      // Set up initial context
      vi.spyOn(asyncLocalStorage, "getStore").mockReturnValueOnce(
        originalContext as RequestContext,
      );

      // Function to be run within the new context
      const mockFn = vi.fn(() => {
        // Inside the function, we should have the new context
        const innerContext = contextManager.getContext();
        expect(innerContext).toEqual(newContext);
        return "test-result";
      });

      // Run the function with the new context
      const result = contextManager.runWithContext(
        newContext as RequestContext,
        mockFn,
      );

      // Verify the function returned the expected result
      expect(result).toBe("test-result");

      // Verify that after execution, we have the original context again
      expect(contextManager.getContext()).toEqual(originalContext);
    });
  });

  describe("updateContext", () => {
    it("should update the existing context with new properties", () => {
      const currentContext = {
        requestId: "original-id",
        userId: "original-user",
      };

      const contextUpdate = {
        userId: "updated-user",
        traceId: "new-trace",
      };

      vi.spyOn(asyncLocalStorage, "getStore").mockReturnValueOnce(
        currentContext as RequestContext,
      );

      contextManager.updateContext(contextUpdate);

      // Context should be updated in place
      expect(currentContext).toEqual({
        requestId: "original-id",
        userId: "updated-user",
        traceId: "new-trace",
      });
    });

    it("should do nothing if no context exists", () => {
      vi.spyOn(asyncLocalStorage, "getStore").mockReturnValueOnce(undefined);

      const contextUpdate = {
        userId: "updated-user",
        traceId: "new-trace",
      };

      contextManager.updateContext(contextUpdate);

      expect(asyncLocalStorage.getStore).toHaveBeenCalled();
      // Since no context exists, no update should happen (no error)
    });
  });

  describe("createStore", () => {
    it("should create a new empty context store", () => {
      const store = contextManager.createStore();
      expect(store).toEqual({});
    });
  });
});
