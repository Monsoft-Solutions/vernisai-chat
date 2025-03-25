import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTRPCLoggerMiddleware } from "../../src/middleware/trpc";
import { contextManager } from "../../src/core/context";
import { Logger } from "../../src/types";

// Mock dependencies first
vi.mock("../../src/utils/sanitizer", () => ({
  sanitize: vi.fn((data) => data),
  sanitizeError: vi.fn((error) => ({
    message: error.message,
    stack: error.stack,
    code: error.code,
    httpStatus: error.httpStatus,
  })),
}));

vi.mock("../../src/core/context", () => ({
  contextManager: {
    runWithContext: vi.fn((context, callback) => callback()),
    getContext: vi.fn(),
    updateContext: vi.fn(),
    createStore: vi.fn().mockReturnValue({}),
  },
  asyncLocalStorage: {
    getStore: vi.fn(),
    run: vi.fn(),
  },
}));

// Create a proper mock logger
const mockLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  http: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  child: vi.fn().mockImplementation(() => mockLogger),
};

vi.mock("../../src/core/logger", () => ({
  createLogger: vi.fn().mockReturnValue(mockLogger),
}));

// Mock metrics manager
vi.mock("../../src/core/metrics", () => ({
  metricsManager: {
    recordRequestMetrics: vi.fn(),
  },
}));

// Import sanitizer utils after mocking
import { sanitize } from "../../src/utils/sanitizer";

describe("tRPC Middleware", () => {
  let mockContext: Record<string, unknown>;
  let mockNext: ReturnType<typeof vi.fn>;
  let logger: Logger;

  beforeEach(() => {
    mockContext = {
      session: {
        userId: "test-user-id",
      },
      organizationId: "test-org-id",
      req: {
        headers: {
          "x-request-id": "test-req-id",
        },
      },
    };

    mockNext = vi.fn().mockResolvedValue({
      result: "test-result",
    });

    logger = mockLogger as unknown as Logger;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createTRPCLoggerMiddleware", () => {
    it("should create a middleware function", () => {
      const middleware = createTRPCLoggerMiddleware(logger);
      expect(typeof middleware).toBe("function");
    });

    it("should log procedure call start and completion", async () => {
      const middleware = createTRPCLoggerMiddleware(logger);

      await middleware({
        ctx: mockContext,
        path: "test.procedure",
        rawInput: { param: "test" },
        type: "query",
        next: mockNext,
      });

      expect(logger.debug).toHaveBeenCalledWith(
        "TRPC query request started",
        expect.objectContaining({
          path: "test.procedure",
          type: "query",
        }),
      );

      expect(logger.info).toHaveBeenCalledWith(
        "TRPC query request completed",
        expect.objectContaining({
          path: "test.procedure",
          type: "query",
          durationMs: expect.any(Number),
        }),
      );
    });

    it("should log errors when procedure call fails", async () => {
      const error = new Error("Test error");
      Object.defineProperty(error, "code", { value: "INTERNAL_SERVER_ERROR" });
      Object.defineProperty(error, "httpStatus", { value: 500 });
      mockNext.mockRejectedValueOnce(error);

      const middleware = createTRPCLoggerMiddleware(logger);

      try {
        await middleware({
          ctx: mockContext,
          path: "test.procedure",
          rawInput: { param: "test" },
          type: "query",
          next: mockNext,
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (e) {
        // Expected error
        expect(e).toBe(error);
      }

      expect(logger.error).toHaveBeenCalledWith(
        "TRPC query request failed",
        expect.objectContaining({
          path: "test.procedure",
          type: "query",
          error: expect.any(Object),
        }),
      );
    });

    it("should extract and use user and organization IDs", async () => {
      const middleware = createTRPCLoggerMiddleware(logger);

      await middleware({
        ctx: mockContext,
        path: "test.procedure",
        rawInput: { param: "test" },
        type: "query",
        next: mockNext,
      });

      // Should update context with user and org IDs
      expect(contextManager.updateContext).toHaveBeenCalledWith({
        userId: "test-user-id",
      });

      expect(contextManager.updateContext).toHaveBeenCalledWith({
        organizationId: "test-org-id",
      });

      // Should include these in logs
      expect(logger.debug).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          userId: "test-user-id",
          organizationId: "test-org-id",
        }),
      );
    });

    it("should filter sensitive data from inputs", async () => {
      // Setup a custom implementation for sanitize
      (sanitize as jest.Mock).mockImplementationOnce((data) => {
        return { ...data, password: "[FILTERED]" };
      });

      const middleware = createTRPCLoggerMiddleware(logger, {
        excludeFields: ["password", "token"],
      });

      await middleware({
        ctx: mockContext,
        path: "test.procedure",
        rawInput: {
          username: "testuser",
          password: "secret123",
          token: "jwt-token-123",
        },
        type: "mutation",
        next: mockNext,
      });

      expect(sanitize).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "testuser",
          password: "secret123",
          token: "jwt-token-123",
        }),
        ["password", "token"],
      );
    });

    it("should support custom log levels", async () => {
      const middleware = createTRPCLoggerMiddleware(logger, {
        requestLogLevel: "http",
        successLogLevel: "debug",
      });

      await middleware({
        ctx: mockContext,
        path: "test.procedure",
        rawInput: { param: "test" },
        type: "query",
        next: mockNext,
      });

      // Should use http for request start
      expect(logger.http).toHaveBeenCalledWith(
        "TRPC query request started",
        expect.any(Object),
      );

      // Should use debug for completion
      expect(logger.debug).toHaveBeenCalledWith(
        "TRPC query request completed",
        expect.any(Object),
      );
    });

    it("should disable request logging when specified", async () => {
      const middleware = createTRPCLoggerMiddleware(logger, {
        requestLogLevel: false,
      });

      await middleware({
        ctx: mockContext,
        path: "test.procedure",
        rawInput: { param: "test" },
        type: "query",
        next: mockNext,
      });

      // Should not log request start
      expect(logger.debug).not.toHaveBeenCalledWith(
        "TRPC query request started",
        expect.any(Object),
      );

      // But should still log completion
      expect(logger.info).toHaveBeenCalledWith(
        "TRPC query request completed",
        expect.any(Object),
      );
    });
  });
});
