# Proxy Testing

This document provides specific guidelines and best practices for testing the proxy package in the VernisAI Chat monorepo.

## Overview

The proxy package (`@vernisai/proxy`) serves as an HTTP proxy that routes requests between the client and server. Testing this package is important to ensure proper request routing, error handling, and performance.

## Test Structure

Proxy tests should be organized in the following structure:

```
packages/proxy/
├── src/
│   ├── index.ts
│   ├── server.ts
│   └── ...
└── tests/
    ├── unit/
    │   ├── routing.test.ts
    │   ├── error-handling.test.ts
    │   └── ...
    └── integration/
        ├── proxy.integration.test.ts
        └── ...
```

## Unit Testing

### Testing Routing Logic

Test the routing logic that determines which requests should be forwarded to the API server and which should be served by the client:

```typescript
// tests/unit/routing.test.ts
import { describe, it, expect, vi } from "vitest";
import { shouldProxyRequest } from "../../../src/routing";

describe("Proxy Routing", () => {
  it("should proxy API requests", () => {
    const apiRequest = {
      url: "/api/users",
      method: "GET",
    };

    expect(shouldProxyRequest(apiRequest)).toBe(true);
  });

  it("should proxy tRPC requests", () => {
    const trpcRequest = {
      url: "/api/trpc/users.getUser",
      method: "POST",
    };

    expect(shouldProxyRequest(trpcRequest)).toBe(true);
  });

  it("should not proxy static assets", () => {
    const staticRequest = {
      url: "/assets/logo.png",
      method: "GET",
    };

    expect(shouldProxyRequest(staticRequest)).toBe(false);
  });

  it("should not proxy client-side routes", () => {
    const clientRouteRequest = {
      url: "/dashboard",
      method: "GET",
    };

    expect(shouldProxyRequest(clientRouteRequest)).toBe(false);
  });
});
```

### Testing Configuration Loading

Test that the proxy correctly loads and applies configuration:

```typescript
// tests/unit/config.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadProxyConfig } from "../../../src/config";

// Mock environment variables
vi.mock("@vernisai/config", () => ({
  env: {
    PROXY_PORT: "4000",
    API_URL: "http://localhost:3001",
    CLIENT_URL: "http://localhost:3000",
    LOG_LEVEL: "info",
  },
}));

describe("Proxy Configuration", () => {
  it("should load config from environment", () => {
    const config = loadProxyConfig();

    expect(config.port).toBe(4000);
    expect(config.apiUrl).toBe("http://localhost:3001");
    expect(config.clientUrl).toBe("http://localhost:3000");
    expect(config.logLevel).toBe("info");
  });

  it("should apply default values for missing config", () => {
    // Mock missing environment variables
    vi.mocked("@vernisai/config").env = {
      API_URL: "http://localhost:3001",
    };

    const config = loadProxyConfig();

    expect(config.port).toBe(3002); // Default port
    expect(config.apiUrl).toBe("http://localhost:3001");
    expect(config.clientUrl).toBe("http://localhost:8080"); // Default client URL
    expect(config.logLevel).toBe("error"); // Default log level
  });
});
```

### Testing Request Transformation

Test any request or response transformation logic:

```typescript
// tests/unit/transform.test.ts
import { describe, it, expect } from "vitest";
import { transformRequest, transformResponse } from "../../../src/transform";

describe("Request/Response Transformation", () => {
  it("should add headers to outgoing requests", () => {
    const originalReq = {
      headers: {
        "content-type": "application/json",
      },
    };

    const transformedReq = transformRequest(originalReq);

    expect(transformedReq.headers["x-proxy-version"]).toBeDefined();
    expect(transformedReq.headers["content-type"]).toBe("application/json");
  });

  it("should transform response headers", () => {
    const originalRes = {
      headers: {
        "content-type": "application/json",
        server: "Express",
      },
    };

    const transformedRes = transformResponse(originalRes);

    expect(transformedRes.headers["server"]).toBeUndefined(); // Remove server header
    expect(transformedRes.headers["content-type"]).toBe("application/json");
    expect(transformedRes.headers["x-powered-by"]).toBe("VernisAI");
  });
});
```

### Testing Error Handling

Test how the proxy handles various error scenarios:

```typescript
// tests/unit/error-handling.test.ts
import { describe, it, expect, vi } from "vitest";
import { handleProxyError } from "../../../src/error-handling";

describe("Proxy Error Handling", () => {
  it("should handle connection refused errors", () => {
    const err = new Error("ECONNREFUSED");
    const req = { url: "/api/users" };
    const res = {
      writeHead: vi.fn(),
      end: vi.fn(),
    };

    handleProxyError(err, req, res);

    expect(res.writeHead).toHaveBeenCalledWith(503, {
      "Content-Type": "application/json",
    });
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "Service Unavailable",
        message: "The API server is not responding",
      }),
    );
  });

  it("should handle timeout errors", () => {
    const err = new Error("ETIMEDOUT");
    const req = { url: "/api/users" };
    const res = {
      writeHead: vi.fn(),
      end: vi.fn(),
    };

    handleProxyError(err, req, res);

    expect(res.writeHead).toHaveBeenCalledWith(504, {
      "Content-Type": "application/json",
    });
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "Gateway Timeout",
        message: "The API server took too long to respond",
      }),
    );
  });

  it("should handle general errors", () => {
    const err = new Error("Unknown error");
    const req = { url: "/api/users" };
    const res = {
      writeHead: vi.fn(),
      end: vi.fn(),
    };

    handleProxyError(err, req, res);

    expect(res.writeHead).toHaveBeenCalledWith(500, {
      "Content-Type": "application/json",
    });
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      }),
    );
  });
});
```

### Testing Logging

Test that the proxy logs important information:

```typescript
// tests/unit/logging.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "../../../src/logger";

describe("Proxy Logging", () => {
  beforeEach(() => {
    // Mock console methods
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should log proxy requests", () => {
    const req = {
      method: "GET",
      url: "/api/users",
      headers: {
        "user-agent": "Test Agent",
      },
    };

    logger.logRequest(req);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("GET /api/users"),
    );
  });

  it("should log proxy errors", () => {
    const err = new Error("Test error");
    const req = {
      method: "GET",
      url: "/api/users",
    };

    logger.logError(err, req);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("Error proxying GET /api/users"),
      expect.objectContaining({ message: "Test error" }),
    );
  });
});
```

## Integration Testing

Integration tests for the proxy should verify that it correctly routes requests between the client and API server.

### Setup

```typescript
// tests/integration/setup.ts
import { createServer } from "http";
import { beforeAll, afterAll } from "vitest";
import { createProxyServer } from "../../../src/server";

// Mock API server
const apiServer = createServer((req, res) => {
  if (req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  } else if (req.url === "/api/users") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify([{ id: "1", name: "Test User" }]));
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Mock client server
const clientServer = createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<html><body>Client</body></html>");
  } else if (req.url === "/assets/style.css") {
    res.writeHead(200, { "Content-Type": "text/css" });
    res.end("body { color: red; }");
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Create proxy server
const proxyServer = createProxyServer({
  port: 4000,
  apiUrl: "http://localhost:4001",
  clientUrl: "http://localhost:4002",
});

// Export for use in tests
export const servers = {
  api: apiServer,
  client: clientServer,
  proxy: proxyServer,
};

beforeAll(async () => {
  // Start mock servers
  await new Promise((resolve) => apiServer.listen(4001, resolve));
  await new Promise((resolve) => clientServer.listen(4002, resolve));

  // Start proxy server
  await new Promise((resolve) => proxyServer.listen(4000, resolve));
});

afterAll(async () => {
  // Close all servers
  await new Promise((resolve) => apiServer.close(resolve));
  await new Promise((resolve) => clientServer.close(resolve));
  await new Promise((resolve) => proxyServer.close(resolve));
});
```

### Testing API Proxying

```typescript
// tests/integration/proxy.integration.test.ts
import { describe, it, expect } from "vitest";
import fetch from "node-fetch";
import { servers } from "./setup";

describe("Proxy Integration", () => {
  it("should proxy API requests to the API server", async () => {
    const response = await fetch("http://localhost:4000/api/users");
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([{ id: "1", name: "Test User" }]);
  });

  it("should serve client assets from the client server", async () => {
    const response = await fetch("http://localhost:4000/assets/style.css");
    const data = await response.text();

    expect(response.status).toBe(200);
    expect(data).toBe("body { color: red; }");
  });

  it("should serve the client index for client routes", async () => {
    const response = await fetch("http://localhost:4000/");
    const data = await response.text();

    expect(response.status).toBe(200);
    expect(data).toBe("<html><body>Client</body></html>");
  });

  it("should handle API errors", async () => {
    const response = await fetch("http://localhost:4000/api/nonexistent");

    expect(response.status).toBe(404);
  });
});
```

### Testing Headers and CORS

```typescript
// tests/integration/headers.integration.test.ts
import { describe, it, expect } from "vitest";
import fetch from "node-fetch";
import { servers } from "./setup";

describe("Proxy Headers and CORS", () => {
  it("should add CORS headers to API responses", async () => {
    const response = await fetch("http://localhost:4000/api/health", {
      headers: {
        Origin: "http://example.com",
      },
    });

    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("access-control-allow-methods")).toBe(
      "GET,HEAD,PUT,PATCH,POST,DELETE",
    );
  });

  it("should handle preflight requests", async () => {
    const response = await fetch("http://localhost:4000/api/users", {
      method: "OPTIONS",
      headers: {
        Origin: "http://example.com",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("access-control-allow-methods")).toBe(
      "GET,HEAD,PUT,PATCH,POST,DELETE",
    );
    expect(response.headers.get("access-control-allow-headers")).toBe(
      "Content-Type",
    );
  });

  it("should pass authorization headers to the API server", async () => {
    const response = await fetch("http://localhost:4000/api/users", {
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    // This is a bit tricky to test without mocking the API server to inspect headers
    // In a real test, you might need to modify the mock API server to verify headers
    expect(response.status).toBe(200);
  });
});
```

## Load Testing

Test how the proxy performs under load:

```typescript
// tests/load/proxy.load.test.ts
import { describe, it, expect } from "vitest";
import { autocannon } from "@vernisai/testing/load";
import { servers } from "../integration/setup";

describe("Proxy Load Testing", () => {
  it("should handle high load on API endpoints", async () => {
    const results = await autocannon({
      url: "http://localhost:4000/api/health",
      connections: 100,
      duration: 10,
    });

    expect(results.errors).toBe(0);
    expect(results.timeouts).toBe(0);
    expect(results.non2xx).toBe(0);
    expect(results.latency.p99).toBeLessThan(500); // 99th percentile < 500ms
  });

  it("should handle high load on client assets", async () => {
    const results = await autocannon({
      url: "http://localhost:4000/assets/style.css",
      connections: 100,
      duration: 10,
    });

    expect(results.errors).toBe(0);
    expect(results.timeouts).toBe(0);
    expect(results.non2xx).toBe(0);
    expect(results.latency.p99).toBeLessThan(300); // 99th percentile < 300ms
  });
});
```

## End-to-End Testing

Test the proxy working with real client and API servers (using ports and configuration close to production):

```typescript
// tests/e2e/proxy.e2e.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn } from "child_process";
import fetch from "node-fetch";

describe("Proxy E2E", () => {
  let clientProcess;
  let apiProcess;
  let proxyProcess;

  beforeAll(async () => {
    // Start the client server
    clientProcess = spawn("npm", ["run", "start:web"], {
      env: {
        ...process.env,
        PORT: "8080",
      },
    });

    // Start the API server
    apiProcess = spawn("npm", ["run", "start:api"], {
      env: {
        ...process.env,
        PORT: "3001",
      },
    });

    // Start the proxy server
    proxyProcess = spawn("npm", ["run", "start:proxy"], {
      env: {
        ...process.env,
        PROXY_PORT: "3000",
        API_URL: "http://localhost:3001",
        CLIENT_URL: "http://localhost:8080",
      },
    });

    // Wait for servers to start
    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  afterAll(() => {
    // Kill all processes
    clientProcess?.kill();
    apiProcess?.kill();
    proxyProcess?.kill();
  });

  it("should proxy API requests in a real environment", async () => {
    const response = await fetch("http://localhost:3000/api/health");
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ status: "ok" });
  });

  it("should serve client assets in a real environment", async () => {
    const response = await fetch("http://localhost:3000/");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
  });
});
```

## Best Practices

1. **Test all routing logic**: Ensure requests are routed to the correct server.
2. **Test error handling**: Verify the proxy handles failures gracefully.
3. **Test CORS handling**: Ensure CORS headers are correctly applied.
4. **Test request modification**: If the proxy modifies requests, test these changes.
5. **Test response modification**: If the proxy modifies responses, test these changes.
6. **Test header passing**: Verify that important headers are passed through correctly.
7. **Test performance**: Include load tests to verify proxy performance.
8. **Test with real servers**: Include some end-to-end tests with actual client and API servers.

## Common Pitfalls

1. **Port conflicts**: Ensure tests use different ports to avoid conflicts.
2. **Not cleaning up servers**: Always close servers in `afterAll` or `afterEach`.
3. **Race conditions**: Be cautious of race conditions in proxy tests.
4. **Missing error handling**: Error handling is a critical aspect of proxy testing.
5. **Not testing timeouts**: Test how the proxy handles slow or unresponsive servers.

## Testing Tools

The `@vernisai/testing` package provides several utilities for proxy testing:

- `createMockServer`: Creates a mock HTTP server for testing
- `proxyRequest`: Helper for making HTTP requests through the proxy
- `createApiSimulator`: Simulates an API server with configurable responses
- `loadTest`: Utilities for load testing HTTP services
