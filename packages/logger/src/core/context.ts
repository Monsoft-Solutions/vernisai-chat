import { AsyncLocalStorage } from "async_hooks";
import { ContextManager, RequestContext } from "../types";

// Initialize async local storage for request context management
const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Implementation of the ContextManager interface
 */
export const contextManager: ContextManager = {
  /**
   * Get the current context from AsyncLocalStorage
   */
  getContext(): RequestContext | undefined {
    return asyncLocalStorage.getStore();
  },

  /**
   * Run a function with the provided context
   */
  runWithContext<T>(
    context: RequestContext,
    fn: (...args: unknown[]) => T,
    ...args: unknown[]
  ): T {
    return asyncLocalStorage.run(context, fn, ...args);
  },

  /**
   * Update the current context with additional properties
   */
  updateContext(contextUpdate: Partial<RequestContext>): void {
    const currentContext = asyncLocalStorage.getStore();
    if (currentContext) {
      // Merge the update into the current context
      Object.assign(currentContext, contextUpdate);
    }
  },

  /**
   * Create a new context store
   */
  createStore(): RequestContext {
    return {};
  },
};

export { asyncLocalStorage };
