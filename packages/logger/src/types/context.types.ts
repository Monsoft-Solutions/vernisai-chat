/**
 * Base context object for logger
 */
export type LoggerContext = Record<string, unknown>;

/**
 * Standard request context information
 */
export interface RequestContext extends LoggerContext {
  /** Unique request identifier */
  requestId?: string;

  /** User ID if authenticated */
  userId?: string;

  /** Organization ID if applicable */
  organizationId?: string;

  /** Session ID for tracking user session */
  sessionId?: string;

  /** Request timestamp */
  timestamp?: number;

  /** Custom correlation ID for distributed tracing */
  correlationId?: string;
}

/**
 * Context setter and getter function signatures
 */
export interface ContextManager {
  /**
   * Get the current context
   */
  getContext(): RequestContext | undefined;

  /**
   * Run a function with the provided context
   */
  runWithContext<T>(
    context: RequestContext,
    fn: (...args: unknown[]) => T,
    ...args: unknown[]
  ): T;

  /**
   * Update current context with additional properties
   */
  updateContext(contextUpdate: Partial<RequestContext>): void;

  /**
   * Create a new context store
   */
  createStore(): RequestContext;
}
