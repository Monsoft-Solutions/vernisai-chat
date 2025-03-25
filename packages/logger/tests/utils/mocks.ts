import { vi } from "vitest";
import {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import {
  type LogLevel,
  type LoggerOptions,
  type LogEntry,
} from "../../src/types";

// Mock Winston
export const createMockWinstonLogger = () => {
  const logs: Record<string, LogEntry[]> = {
    error: [],
    warn: [],
    info: [],
    http: [],
    debug: [],
    verbose: [],
  };

  return {
    logs,
    logger: {
      error: vi.fn((message: string, meta?: Record<string, unknown>) => {
        logs.error.push({ level: "error", message, meta });
      }),
      warn: vi.fn((message: string, meta?: Record<string, unknown>) => {
        logs.warn.push({ level: "warn", message, meta });
      }),
      info: vi.fn((message: string, meta?: Record<string, unknown>) => {
        logs.info.push({ level: "info", message, meta });
      }),
      http: vi.fn((message: string, meta?: Record<string, unknown>) => {
        logs.http.push({ level: "http", message, meta });
      }),
      debug: vi.fn((message: string, meta?: Record<string, unknown>) => {
        logs.debug.push({ level: "debug", message, meta });
      }),
      verbose: vi.fn((message: string, meta?: Record<string, unknown>) => {
        logs.verbose.push({ level: "verbose", message, meta });
      }),
      format: {
        json: vi.fn().mockReturnValue({ format: () => ({}) }),
        timestamp: vi.fn().mockReturnValue({ format: () => ({}) }),
        combine: vi.fn().mockReturnValue({ format: () => ({}) }),
        printf: vi.fn().mockReturnValue({ format: () => ({}) }),
        colorize: vi.fn().mockReturnValue({ format: () => ({}) }),
        simple: vi.fn().mockReturnValue({ format: () => ({}) }),
      },
      createLogger: vi.fn().mockImplementation(() => ({
        error: logs.error,
        warn: logs.warn,
        info: logs.info,
        http: logs.http,
        debug: logs.debug,
        verbose: logs.verbose,
        log: vi.fn(),
        add: vi.fn(),
        remove: vi.fn(),
        clear: vi.fn(),
        exceptions: {
          handle: vi.fn(),
        },
        rejections: {
          handle: vi.fn(),
        },
      })),
      transports: {
        Console: vi.fn().mockImplementation(() => ({
          name: "console",
          level: "info",
        })),
      },
    },
  };
};

// Mock Logtail
export const createMockLogtail = () => {
  const logs: LogEntry[] = [];

  return {
    logs,
    Logtail: vi.fn().mockImplementation(() => ({
      flush: vi.fn().mockResolvedValue(undefined),
      log: vi.fn(
        (level: string, message: string, meta?: Record<string, unknown>) => {
          logs.push({ level, message, meta });
          return Promise.resolve();
        },
      ),
    })),
    LogtailTransport: vi.fn().mockImplementation(() => ({
      name: "logtail",
      level: "info",
      log: vi.fn((level: string, message: string, callback: () => void) => {
        logs.push({ level, message });
        callback();
      }),
    })),
  };
};

// Mock Express
export const createMockExpressApp = () => {
  const routes: Record<
    string,
    Array<(req: Request, res: Response, next?: NextFunction) => void>
  > = {};
  const middleware: Array<
    (req: Request, res: Response, next?: NextFunction) => void
  > = [];

  const app = {
    use: vi.fn(
      (
        middleware: (req: Request, res: Response, next?: NextFunction) => void,
      ) => {
        app.middleware.push(middleware);
        return app;
      },
    ),
    get: vi.fn(
      (
        path: string,
        ...handlers: Array<
          (req: Request, res: Response, next?: NextFunction) => void
        >
      ) => {
        routes[`GET ${path}`] = handlers;
        return app;
      },
    ),
    post: vi.fn(
      (
        path: string,
        ...handlers: Array<
          (req: Request, res: Response, next?: NextFunction) => void
        >
      ) => {
        routes[`POST ${path}`] = handlers;
        return app;
      },
    ),
    put: vi.fn(
      (
        path: string,
        ...handlers: Array<
          (req: Request, res: Response, next?: NextFunction) => void
        >
      ) => {
        routes[`PUT ${path}`] = handlers;
        return app;
      },
    ),
    delete: vi.fn(
      (
        path: string,
        ...handlers: Array<
          (req: Request, res: Response, next?: NextFunction) => void
        >
      ) => {
        routes[`DELETE ${path}`] = handlers;
        return app;
      },
    ),
    routes,
    middleware,
  };

  return app as unknown as Express & {
    routes: Record<
      string,
      Array<(req: Request, res: Response, next?: NextFunction) => void>
    >;
    middleware: Array<
      (req: Request, res: Response, next?: NextFunction) => void
    >;
  };
};

// Mock Request
export const createMockRequest = (overrides: Partial<Request> = {}) => {
  return {
    headers: {},
    query: {},
    params: {},
    body: {},
    get: vi.fn((name: string) => {
      return (this.headers as Record<string, string>)[name.toLowerCase()] ?? "";
    }),
    ...overrides,
  } as unknown as Request;
};

// Mock Response
export const createMockResponse = () => {
  const res = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    status: vi.fn(function (code: number) {
      this.statusCode = code;
      return this;
    }),
    json: vi.fn(function (body: unknown) {
      this.body = body;
      return this;
    }),
    send: vi.fn(function (body: unknown) {
      this.body = body;
      return this;
    }),
    setHeader: vi.fn(function (name: string, value: string) {
      this.headers[name] = value;
      return this;
    }),
    end: vi.fn(),
    on: vi.fn((event, callback) => {
      if (event === "finish") {
        // Store the callback to manually call it later
        res._finishCallbacks.push(callback);
      }
      return res;
    }),
    _finishCallbacks: [] as Array<
      (req: Request, res: Response, next?: NextFunction) => void
    >,
    _trigger: {
      finish: function () {
        res._finishCallbacks.forEach((cb) => cb());
      },
    },
    body: undefined,
  };

  return res as unknown as Response & typeof res;
};

// Mock AsyncLocalStorage
export const createMockAsyncLocalStorage = () => {
  let store: Record<string, unknown> = {};

  return {
    getStore: vi.fn(() => store),
    run: vi.fn(
      (
        newStore: Record<string, unknown>,
        callback: (...args: unknown[]) => unknown,
      ) => {
        const oldStore = store;
        store = newStore;
        try {
          return callback();
        } finally {
          store = oldStore;
        }
      },
    ),
    exit: vi.fn((callback: (...args: unknown[]) => unknown) => {
      const oldStore = store;
      store = {};
      try {
        return callback();
      } finally {
        store = oldStore;
      }
    }),
    store,
    _reset: () => {
      store = {};
    },
  };
};

// Mock tRPC middleware
export const createMockTRPCMiddleware = () => {
  return vi.fn().mockImplementation(({ next }) => {
    return next();
  });
};

// Helper to create mock logger options
export const createMockLoggerOptions = (
  overrides: Partial<LoggerOptions> = {},
): LoggerOptions => {
  return {
    service: "test-service",
    level: "info" as LogLevel,
    logtailToken: "mock-token",
    consoleOutput: true,
    environment: "test",
    sanitize: true,
    defaultMeta: { test: true },
    ...overrides,
  };
};

// Reset all mocks between tests
export const resetMocks = () => {
  vi.resetAllMocks();
};
