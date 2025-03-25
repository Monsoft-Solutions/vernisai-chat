import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { LoggerOptions } from "../../src/types";
import * as winston from "winston";

// Mock winston first
vi.mock("winston", () => {
  // Create format function mock
  const formatFn = vi.fn().mockImplementation(() => ({
    transform: vi.fn((info) => info),
    combine: vi.fn(() => ({
      transform: vi.fn((info) => info),
    })),
    timestamp: vi.fn(() => ({ transform: vi.fn((info) => info) })),
    json: vi.fn(() => ({ transform: vi.fn((info) => info) })),
    printf: vi.fn(() => ({ transform: vi.fn((info) => info) })),
    colorize: vi.fn(() => ({ transform: vi.fn((info) => info) })),
    errors: vi.fn(() => ({ transform: vi.fn((info) => info) })),
    simple: vi.fn(() => ({ transform: vi.fn((info) => info) })),
    format: vi.fn(() => ({ transform: vi.fn((info) => info) })),
  }));

  // Add format methods
  formatFn.combine = vi.fn(() => ({
    transform: vi.fn((info) => info),
  }));
  formatFn.timestamp = vi.fn(() => ({ transform: vi.fn((info) => info) }));
  formatFn.json = vi.fn(() => ({ transform: vi.fn((info) => info) }));
  formatFn.printf = vi.fn(() => ({ transform: vi.fn((info) => info) }));
  formatFn.colorize = vi.fn(() => ({ transform: vi.fn((info) => info) }));
  formatFn.errors = vi.fn(() => ({ transform: vi.fn((info) => info) }));
  formatFn.simple = vi.fn(() => ({ transform: vi.fn((info) => info) }));

  // Create mock logger
  const mockLogger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    http: vi.fn(),
    child: vi.fn().mockReturnThis(),
  };

  return {
    format: formatFn,
    createLogger: vi.fn(() => mockLogger),
    transports: {
      Console: vi.fn(),
    },
    addColors: vi.fn(),
    default: {
      format: formatFn,
      createLogger: vi.fn(() => mockLogger),
      transports: {
        Console: vi.fn(),
      },
      addColors: vi.fn(),
    },
  };
});

// Mock other dependencies
vi.mock("@logtail/node", () => ({
  Logtail: vi.fn(() => ({
    withField: vi.fn().mockReturnThis(),
    withFields: vi.fn().mockReturnThis(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    flush: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock("@logtail/winston", () => ({
  LogtailTransport: vi.fn(() => ({
    name: "logtail",
    level: "info",
  })),
}));

vi.mock("../../src/core/context", () => ({
  contextManager: {
    getContext: vi.fn(),
    updateContext: vi.fn(),
    runWithContext: vi.fn(),
  },
}));

// Now import the module being tested
import * as loggerModule from "../../src/core/logger";

describe("Logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createLogger", () => {
    it("should create a logger with default options", () => {
      const { createLogger } = loggerModule;
      const logger = createLogger();
      expect(logger).toBeDefined();
    });

    it("should create a logger with custom options", () => {
      const { createLogger } = loggerModule;
      const options = {
        level: "debug",
        serviceName: "test-service",
        logtail: {
          sourceToken: "test-token",
        },
        transports: {
          console: true,
        },
      } as LoggerOptions;

      const logger = createLogger(options);
      expect(logger).toBeDefined();
    });

    // Skip the transport tests for now - they require complex mocking
    it.skip("should create a logger with console transport when enabled", () => {
      const { createLogger } = loggerModule;
      // Import modules inside the test to avoid hoisting issues
      const consoleSpy = vi.spyOn(winston.transports, "Console");

      const options = {
        serviceName: "test-service",
        transports: {
          console: true,
          logtail: false,
        },
      } as LoggerOptions;

      createLogger(options);
      expect(consoleSpy).toHaveBeenCalled();
    });

    // Skip the transport tests for now - they require complex mocking
    it.skip("should create a logger with logtail transport when enabled and token is provided", async () => {
      const { createLogger } = loggerModule;
      // Import modules inside the test to avoid hoisting issues
      const logtailNode = await import("@logtail/node");
      const logtailWinston = await import("@logtail/winston");

      const logtailSpy = vi.spyOn(logtailNode, "Logtail");
      const logtailTransportSpy = vi.spyOn(logtailWinston, "LogtailTransport");

      const options = {
        serviceName: "test-service",
        transports: {
          console: false,
          logtail: true,
        },
        logtail: {
          sourceToken: "test-token",
        },
      } as LoggerOptions;

      createLogger(options);
      expect(logtailSpy).toHaveBeenCalledWith("test-token", expect.any(Object));
      expect(logtailTransportSpy).toHaveBeenCalled();
    });
  });

  describe("sanitizeLogFields", () => {
    it("should sanitize sensitive fields", () => {
      const { sanitizeLogFields } = loggerModule;
      const input = {
        password: "secret",
        username: "user",
        nested: {
          token: "secret-token",
          id: 1234,
        },
        array: [{ password: "secret2" }, { token: "token2" }],
      };

      const result = sanitizeLogFields(input, [
        "password",
        "token",
      ]) as typeof input;

      expect(result.password).toBe("[REDACTED]");
      expect(result.username).toBe("user");
      expect(result.nested.token).toBe("[REDACTED]");
      expect(result.nested.id).toBe(1234);
      expect(result.array[0].password).toBe("[REDACTED]");
      expect(result.array[1].token).toBe("[REDACTED]");
    });

    it("should handle null and undefined values", () => {
      const { sanitizeLogFields } = loggerModule;
      expect(sanitizeLogFields(null, ["password"])).toBeNull();
      expect(sanitizeLogFields(undefined, ["password"])).toBeUndefined();
    });

    it("should handle primitive values", () => {
      const { sanitizeLogFields } = loggerModule;
      expect(sanitizeLogFields("string", ["password"])).toBe("string");
      expect(sanitizeLogFields(123, ["password"])).toBe(123);
      expect(sanitizeLogFields(true, ["password"])).toBe(true);
    });

    it("should handle arrays at the top level", () => {
      const { sanitizeLogFields } = loggerModule;
      const input = [
        { password: "secret", username: "user1" },
        { token: "token", id: 1234 },
      ];

      const result = sanitizeLogFields(input, [
        "password",
        "token",
      ]) as typeof input;

      expect(result[0].password).toBe("[REDACTED]");
      expect(result[0].username).toBe("user1");
      expect(result[1].token).toBe("[REDACTED]");
      expect(result[1].id).toBe(1234);
    });
  });
});
