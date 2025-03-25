import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import type { Application } from "express";
import {
  setupRequestLogging,
  requestLoggingMiddleware,
  requestContextMiddleware,
} from "../../src/middleware/express";
import { contextManager } from "../../src/core/context";
import { Logger } from "../../src/types";

// Mock dependencies
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

// Create a proper mock logger that we'll assign directly
const mockLoggerMethods = {
  debug: vi.fn(),
  info: vi.fn(),
  http: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  child: vi.fn().mockReturnValue({
    debug: vi.fn(),
    info: vi.fn(),
    http: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    child: vi.fn(),
  }),
};

vi.mock("../../src/core/logger", () => ({
  createLogger: vi.fn().mockReturnValue(mockLoggerMethods),
}));

vi.mock("../utils/sanitizer", () => ({
  sanitize: vi.fn((data) => data),
}));

describe("Express Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: ReturnType<typeof vi.fn>;
  let middleware: (req: Request, res: Response, next: NextFunction) => void;
  let logger: Logger;

  beforeEach(() => {
    mockRequest = {
      method: "GET",
      url: "/test",
      path: "/test",
      originalUrl: "/test",
      ip: "127.0.0.1",
      query: {},
      body: {},
      headers: {
        "x-request-id": "test-req-id",
        "user-agent": "test-agent",
      },
      get: vi.fn(() => "test-value") as unknown as Request["get"],
      socket: {
        remoteAddress: "127.0.0.1",
      } as unknown as Request["socket"],
    };

    mockResponse = {
      on: vi.fn(),
      once: vi.fn(),
      statusCode: 200,
      getHeader: vi.fn(),
      locals: {},
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();

    logger = mockLoggerMethods as unknown as Logger;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("requestContextMiddleware", () => {
    it("should set requestId on the request object", () => {
      const middleware = requestContextMiddleware();
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest).toHaveProperty("id");
      expect(mockRequest).toHaveProperty("startTime");
      expect(contextManager.runWithContext).toHaveBeenCalled();
    });

    it("should use existing request ID if present", () => {
      const middleware = requestContextMiddleware();
      mockRequest.headers = { "x-request-id": "existing-id" };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      const requestWithId = mockRequest as unknown as { id: string };
      expect(requestWithId.id).toBe("existing-id");
    });
  });

  describe("requestLoggingMiddleware", () => {
    it("should create middleware with default options", () => {
      middleware = requestLoggingMiddleware(logger);
      expect(middleware).toBeInstanceOf(Function);
    });

    it("should create middleware with custom options", () => {
      middleware = requestLoggingMiddleware(logger, {
        skipPaths: ["/health"],
        logBody: false,
        getUserId: () => "custom-user",
        getOrganizationId: () => "custom-org",
      });
      expect(middleware).toBeInstanceOf(Function);
    });

    it("should set up response event listener", () => {
      middleware = requestLoggingMiddleware(logger);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.on).toHaveBeenCalledWith(
        "finish",
        expect.any(Function),
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it("should update context if user or org IDs available", () => {
      const getUserId = vi.fn().mockReturnValue("custom-user-id");
      const getOrganizationId = vi.fn().mockReturnValue("custom-org-id");

      middleware = requestLoggingMiddleware(logger, {
        getUserId,
        getOrganizationId,
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(getUserId).toHaveBeenCalledWith(mockRequest);
      expect(getOrganizationId).toHaveBeenCalledWith(mockRequest);
      expect(contextManager.updateContext).toHaveBeenCalledWith({
        userId: "custom-user-id",
        organizationId: "custom-org-id",
      });
    });

    it("should log HTTP request", () => {
      middleware = requestLoggingMiddleware(logger);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(logger.http).toHaveBeenCalledWith(
        "Request received",
        expect.objectContaining({
          method: "GET",
          url: "/test",
        }),
      );
    });

    it("should log response completion", () => {
      middleware = requestLoggingMiddleware(logger);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Call the finish event handler
      const onMock = mockResponse.on as jest.Mock;
      const finishHandler = onMock.mock.calls[0][1];
      finishHandler();

      expect(logger.http).toHaveBeenCalledWith(
        "Response finished",
        expect.objectContaining({
          method: "GET",
          url: "/test",
          statusCode: 200,
        }),
      );
    });

    it("should skip logging for specified paths", () => {
      middleware = requestLoggingMiddleware(logger, {
        skipPaths: ["/test"],
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(logger.http).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("setupRequestLogging", () => {
    it("should set up all middleware in correct order", () => {
      const mockApp = {
        use: vi.fn(),
      };

      setupRequestLogging(mockApp as unknown as Application, logger);

      expect(mockApp.use).toHaveBeenCalledTimes(3);
    });
  });
});
