# API Testing

This document provides specific guidelines and best practices for testing the API package in the VernisAI Chat monorepo.

## Overview

The API package (`@vernisai/api`) is built using tRPC and provides the core server-side functionality for the application. Testing this package thoroughly is critical as it serves as the communication layer between the frontend and the database.

## Test Structure

API tests should be organized in the following structure:

```
packages/api/
├── src/
│   ├── routers/
│   │   ├── users.ts
│   │   └── ...
└── tests/
    ├── unit/
    │   ├── routers/
    │   │   ├── users.test.ts
    │   │   └── ...
    └── integration/
        ├── routers/
        │   ├── users.integration.test.ts
        │   └── ...
```

## Unit Testing tRPC Routers

### Test Setup

Each tRPC router should have corresponding unit tests that mock dependencies (like database access):

```typescript
// tests/unit/routers/users.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockTRPCContext, mockPrisma } from "@vernisai/testing/mocks";
import { createUsersRouter } from "../../../src/routers/users";

describe("Users Router", () => {
  let usersRouter;
  let mockContext;

  beforeEach(() => {
    // Mock the database
    const mockDb = mockPrisma({
      user: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    });

    // Create a mock context
    mockContext = mockTRPCContext({
      prisma: mockDb,
      session: {
        user: { id: "user-1", role: "USER" },
      },
    });

    // Create the router with dependencies injected
    usersRouter = createUsersRouter();
  });

  describe("getUser", () => {
    it("should return a user when found", async () => {
      // Arrange
      const mockUser = { id: "user-1", name: "Test User" };
      mockContext.prisma.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await usersRouter.getUser.call(mockContext, {
        id: "user-1",
      });

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockContext.prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-1" },
      });
    });

    it("should throw when user not found", async () => {
      // Arrange
      mockContext.prisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        usersRouter.getUser.call(mockContext, { id: "nonexistent" }),
      ).rejects.toThrow("User not found");
    });
  });

  // Additional tests...
});
```

### Testing Authentication and Authorization

Test that your API endpoints properly enforce authentication and authorization:

```typescript
import { describe, it, expect } from "vitest";
import { mockTRPCContext } from "@vernisai/testing/mocks";
import { createUsersRouter } from "../../../src/routers/users";
import { TRPCError } from "@trpc/server";

describe("Users Router Authentication", () => {
  it("should throw UNAUTHORIZED when no session exists", async () => {
    // Arrange
    const mockContext = mockTRPCContext({
      session: null,
    });

    const usersRouter = createUsersRouter();

    // Act & Assert
    await expect(usersRouter.listUsers.call(mockContext, {})).rejects.toThrow(
      TRPCError,
    );

    await expect(
      usersRouter.listUsers.call(mockContext, {}),
    ).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("should throw FORBIDDEN when user lacks permissions", async () => {
    // Arrange
    const mockContext = mockTRPCContext({
      session: {
        user: { id: "user-1", role: "USER" },
      },
    });

    const usersRouter = createUsersRouter();

    // Act & Assert
    await expect(
      usersRouter.deleteUser.call(mockContext, { id: "another-user" }),
    ).rejects.toThrow(TRPCError);

    await expect(
      usersRouter.deleteUser.call(mockContext, { id: "another-user" }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
```

### Testing Input Validation

Test that your API endpoints properly validate input:

```typescript
import { describe, it, expect } from "vitest";
import { mockTRPCContext } from "@vernisai/testing/mocks";
import { createUsersRouter } from "../../../src/routers/users";
import { TRPCError } from "@trpc/server";

describe("Users Router Input Validation", () => {
  it("should throw BAD_REQUEST when invalid email is provided", async () => {
    // Arrange
    const mockContext = mockTRPCContext({
      session: {
        user: { id: "user-1", role: "ADMIN" },
      },
    });

    const usersRouter = createUsersRouter();

    // Act & Assert
    await expect(
      usersRouter.createUser.call(mockContext, {
        name: "Test User",
        email: "not-an-email",
      }),
    ).rejects.toThrow(TRPCError);

    await expect(
      usersRouter.createUser.call(mockContext, {
        name: "Test User",
        email: "not-an-email",
      }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });
});
```

## Integration Testing

Integration tests verify that your API endpoints work correctly with real dependencies. These tests use a test database instance (typically an in-memory SQLite database via Prisma).

### Setup

```typescript
// tests/integration/setup.ts
import { PrismaClient } from "@prisma/client";
import { beforeAll, afterAll, beforeEach } from "vitest";
import { createTestDatabase } from "@vernisai/testing/db";

// Create an isolated test database
const testDb = createTestDatabase();

// Export for use in tests
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: testDb.url,
    },
  },
});

beforeAll(async () => {
  // Set up the database
  await testDb.setup();

  // Run migrations
  await prisma.$executeRawUnsafe(`
    -- Your test schema setup SQL
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `);
});

afterAll(async () => {
  // Clean up
  await prisma.$disconnect();
  await testDb.teardown();
});

beforeEach(async () => {
  // Clear tables before each test
  await prisma.$executeRawUnsafe("DELETE FROM users");
});
```

### Testing API Endpoints

```typescript
// tests/integration/routers/users.integration.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { createTRPCContext } from "../../../src/context";
import { appRouter } from "../../../src/router";
import { prisma } from "../setup";

describe("Users Router Integration", () => {
  let caller;

  beforeEach(() => {
    // Create a TRPC caller with admin session
    const ctx = createTRPCContext({
      prisma,
      session: {
        user: { id: "admin-1", role: "ADMIN" },
      },
    });

    caller = appRouter.createCaller(ctx);
  });

  it("should create and retrieve a user", async () => {
    // Create a user
    const newUser = await caller.users.createUser({
      name: "Test User",
      email: "test@example.com",
    });

    expect(newUser.name).toBe("Test User");
    expect(newUser.email).toBe("test@example.com");
    expect(newUser.id).toBeDefined();

    // Get the user
    const retrievedUser = await caller.users.getUser({
      id: newUser.id,
    });

    expect(retrievedUser).toEqual(newUser);
  });

  it("should list all users", async () => {
    // Create multiple users
    await caller.users.createUser({
      name: "User 1",
      email: "user1@example.com",
    });

    await caller.users.createUser({
      name: "User 2",
      email: "user2@example.com",
    });

    // List users
    const users = await caller.users.listUsers({});

    expect(users).toHaveLength(2);
    expect(users.map((u) => u.name)).toContain("User 1");
    expect(users.map((u) => u.name)).toContain("User 2");
  });

  it("should update a user", async () => {
    // Create a user
    const newUser = await caller.users.createUser({
      name: "Original Name",
      email: "test@example.com",
    });

    // Update the user
    const updatedUser = await caller.users.updateUser({
      id: newUser.id,
      name: "Updated Name",
    });

    expect(updatedUser.name).toBe("Updated Name");
    expect(updatedUser.email).toBe("test@example.com");

    // Verify the update
    const retrievedUser = await caller.users.getUser({
      id: newUser.id,
    });

    expect(retrievedUser.name).toBe("Updated Name");
  });

  it("should delete a user", async () => {
    // Create a user
    const newUser = await caller.users.createUser({
      name: "To Be Deleted",
      email: "delete@example.com",
    });

    // Delete the user
    await caller.users.deleteUser({
      id: newUser.id,
    });

    // Verify the user was deleted
    await expect(
      caller.users.getUser({
        id: newUser.id,
      }),
    ).rejects.toThrow("User not found");
  });
});
```

## Testing Serverless Adapters

The API can run in both serverless and server environments. Test both adapters:

```typescript
// tests/unit/adapters/vercel.test.ts
import { describe, it, expect, vi } from "vitest";
import { createVercelAdapter } from "../../../src/adapters/vercel";
import { appRouter } from "../../../src/router";

describe("Vercel Adapter", () => {
  it("should handle HTTP requests", async () => {
    // Arrange
    const adapter = createVercelAdapter({
      router: appRouter,
    });

    const mockRequest = {
      method: "POST",
      body: JSON.stringify({
        json: {
          path: "users.getUser",
          input: { id: "user-1" },
        },
      }),
    };

    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
    };

    // Mock the router response
    vi.spyOn(appRouter, "createCaller").mockImplementation(() => ({
      users: {
        getUser: vi.fn().mockResolvedValue({ id: "user-1", name: "Test User" }),
      },
    }));

    // Act
    await adapter(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        result: {
          data: { id: "user-1", name: "Test User" },
        },
      }),
    );
  });

  it("should handle errors", async () => {
    // Arrange
    const adapter = createVercelAdapter({
      router: appRouter,
    });

    const mockRequest = {
      method: "POST",
      body: JSON.stringify({
        json: {
          path: "users.getUser",
          input: { id: "nonexistent" },
        },
      }),
    };

    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
    };

    // Mock the router to throw an error
    vi.spyOn(appRouter, "createCaller").mockImplementation(() => ({
      users: {
        getUser: vi.fn().mockRejectedValue(new Error("User not found")),
      },
    }));

    // Act
    await adapter(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          message: "User not found",
        }),
      }),
    );
  });
});
```

## Testing the Express Server

Test the Express server implementation:

```typescript
// tests/unit/server.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { createExpressServer } from "../../../src/server";
import { appRouter } from "../../../src/router";

describe("Express Server", () => {
  let app;

  beforeEach(() => {
    // Create a test Express app
    app = createExpressServer({
      router: appRouter,
      createContext: vi.fn().mockReturnValue({
        prisma: {},
        session: { user: { id: "user-1", role: "USER" } },
      }),
    });

    // Mock the router
    vi.spyOn(appRouter, "createCaller").mockImplementation(() => ({
      users: {
        getUser: vi.fn().mockResolvedValue({ id: "user-1", name: "Test User" }),
      },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should respond to API requests", async () => {
    const response = await request(app)
      .post("/api/trpc/users.getUser")
      .send({ id: "user-1" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        result: {
          data: { id: "user-1", name: "Test User" },
        },
      }),
    );
  });

  it("should handle CORS headers", async () => {
    const response = await request(app)
      .options("/api/trpc/users.getUser")
      .set("Origin", "http://localhost:3000");

    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.status).toBe(204);
  });

  it("should handle health check endpoint", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
```

## Testing with Multi-Tenancy

Test that your API handles organization-based multi-tenancy correctly:

```typescript
// tests/unit/multi-tenancy.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { mockTRPCContext } from "@vernisai/testing/mocks";
import { createConversationsRouter } from "../../../src/routers/conversations";

describe("Multi-tenancy", () => {
  it("should filter conversations by organization", async () => {
    // Arrange
    const mockDb = {
      conversation: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "conv-1",
            title: "Org 1 Conversation",
            organizationId: "org-1",
          },
          {
            id: "conv-2",
            title: "Org 2 Conversation",
            organizationId: "org-2",
          },
        ]),
      },
    };

    const mockContext = mockTRPCContext({
      prisma: mockDb,
      session: {
        user: { id: "user-1", role: "USER" },
        organizationId: "org-1",
      },
    });

    const conversationsRouter = createConversationsRouter();

    // Act
    const result = await conversationsRouter.listConversations.call(
      mockContext,
      {},
    );

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Org 1 Conversation");
    expect(mockDb.conversation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          organizationId: "org-1",
        }),
      }),
    );
  });

  it("should allow ADMIN users to access any organization", async () => {
    // Arrange
    const mockDb = {
      conversation: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "conv-1",
            title: "Org 1 Conversation",
            organizationId: "org-1",
          },
          {
            id: "conv-2",
            title: "Org 2 Conversation",
            organizationId: "org-2",
          },
        ]),
      },
    };

    const mockContext = mockTRPCContext({
      prisma: mockDb,
      session: {
        user: { id: "admin-1", role: "ADMIN" },
      },
    });

    const conversationsRouter = createConversationsRouter();

    // Act
    const result = await conversationsRouter.listConversations.call(
      mockContext,
      { organizationId: "org-2" },
    );

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Org 2 Conversation");
  });
});
```

## Load Testing

For API endpoints that might experience high load, implement load tests:

```typescript
// tests/load/api.load.test.ts
import { describe, it } from "vitest";
import { autocannon } from "@vernisai/testing/load";
import { createExpressServer } from "../../src/server";
import { appRouter } from "../../src/router";

describe("API Load Testing", () => {
  it("should handle high load on the messages endpoint", async () => {
    // Create a test server
    const app = createExpressServer({ router: appRouter });
    const server = await app.listen(4000);

    try {
      // Run load test
      const results = await autocannon({
        url: "http://localhost:4000/api/trpc/messages.listMessages",
        connections: 100,
        duration: 10,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: "test-conversation",
        }),
      });

      // Assert performance metrics
      expect(results.errors).toBe(0);
      expect(results.timeouts).toBe(0);
      expect(results.non2xx).toBe(0);
      expect(results.latency.p99).toBeLessThan(500); // 99th percentile < 500ms
    } finally {
      // Clean up
      await server.close();
    }
  });
});
```

## Best Practices

1. **Separate unit from integration tests**: Unit tests should mock dependencies, while integration tests use real implementations.
2. **Test all API endpoints**: Ensure each endpoint has both positive and negative test cases.
3. **Test error handling**: Verify that errors are handled gracefully and return appropriate status codes.
4. **Test authentication and authorization**: Ensure that protected endpoints properly validate permissions.
5. **Test input validation**: Ensure that input validation works correctly.
6. **Use transaction isolation**: For database tests, use transactions to roll back changes after each test.
7. **Test adapters**: Verify that serverless adapters work correctly.
8. **Test performance**: Include load tests for critical endpoints.

## Testing Tools

The `@vernisai/testing` package provides several utilities for API testing:

- `mockTRPCContext`: Creates a mock tRPC context for testing
- `mockPrisma`: Creates a mock Prisma client
- `createTestDatabase`: Sets up an in-memory test database
- `trpcRequest`: Helper for making tRPC requests
- `loadTest`: Utilities for API load testing

## Testing tRPC Routers with Database

When testing tRPC routers that interact with the database, you can use the Drizzle ORM mocks from the base testing package:

```typescript
// src/server/api/routers/user.ts
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { users } from "@vernisai/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.db.select().from(users);
    return allUsers;
  }),

  getUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .then((res) => res[0] || null);

      if (!user) {
        throw new Error(`User with ID ${input.id} not found`);
      }

      return user;
    }),

  createUser: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .insert(users)
        .values({
          email: input.email,
          name: input.name,
        })
        .returning();

      return user;
    }),
});
```

Test implementation:

```typescript
// tests/unit/api/routers/user.test.ts
import { expect, describe, it, beforeEach } from "vitest";
import { userRouter } from "../../../../src/server/api/routers/user";
import { createInnerTRPCContext } from "../../../../src/server/api/trpc";
import { mockDrizzle } from "@vernisai/testing/db";
import { users } from "@vernisai/db/schema";

describe("User Router", () => {
  // Mock the database
  const mockDb = mockDrizzle();
  const mockUser = {
    id: "user_123",
    name: "Test User",
    email: "test@example.com",
    createdAt: new Date(),
  };

  // Set up the context with our mock database
  const createContext = () =>
    createInnerTRPCContext({
      session: {
        user: { id: "test-user-id", email: "tester@example.com" },
        expires: new Date().toISOString(),
      },
      db: mockDb,
    });

  // Reset mocks before each test
  beforeEach(() => {
    mockDb.reset();
  });

  describe("getUsers", () => {
    it("should return all users", async () => {
      // Setup mock to return test users
      mockDb.select.mockResolvedValueOnce([mockUser]);

      // Call the procedure
      const caller = userRouter.createCaller(createContext());
      const result = await caller.getUsers();

      // Verify results
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockUser);

      // Verify database calls
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.select().from).toHaveBeenCalledWith(users);
    });
  });

  describe("getUserById", () => {
    it("should return a user when found", async () => {
      // Setup mock to return a user
      mockDb.select.mockImplementationOnce(() => ({
        from: () => ({
          where: () => Promise.resolve([mockUser]),
        }),
      }));

      // Call the procedure
      const caller = userRouter.createCaller(createContext());
      const result = await caller.getUserById({ id: "user_123" });

      // Verify results
      expect(result).toEqual(mockUser);
    });

    it("should throw an error when user not found", async () => {
      // Setup mock to return empty array (user not found)
      mockDb.select.mockImplementationOnce(() => ({
        from: () => ({
          where: () => Promise.resolve([]),
        }),
      }));

      // Call the procedure
      const caller = userRouter.createCaller(createContext());
      const promise = caller.getUserById({ id: "nonexistent" });

      // Verify error thrown
      await expect(promise).rejects.toThrow(
        "User with ID nonexistent not found",
      );
    });
  });

  describe("createUser", () => {
    it("should create and return a new user", async () => {
      // Setup mock to return the created user
      mockDb.insert.mockImplementationOnce(() => ({
        values: () => ({
          returning: () => Promise.resolve([mockUser]),
        }),
      }));

      // Call the procedure
      const caller = userRouter.createCaller(createContext());
      const result = await caller.createUser({
        email: "test@example.com",
        name: "Test User",
      });

      // Verify results
      expect(result).toEqual(mockUser);

      // Verify database calls
      expect(mockDb.insert).toHaveBeenCalledTimes(1);
      expect(mockDb.insert().values).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "Test User",
      });
    });
  });
});
```

## Integration Testing tRPC Routers

For integration tests that need an actual database:

```typescript
// tests/integration/api/routers/user.test.ts
import { expect, describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import { userRouter } from "../../../../src/server/api/routers/user";
import { createInnerTRPCContext } from "../../../../src/server/api/trpc";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { createTestDatabase } from "@vernisai/testing/db";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { users } from "@vernisai/db/schema";

describe("User Router Integration Tests", () => {
  let testDb;
  let db;
  let pool;

  beforeAll(async () => {
    // Create test database
    testDb = createTestDatabase();
    await testDb.setup();

    // Connect to test database
    pool = new Pool({ connectionString: testDb.url });
    db = drizzle(pool);

    // Run migrations
    await migrate(db, { migrationsFolder: "./drizzle" });
  });

  afterAll(async () => {
    await pool.end();
    await testDb.teardown();
  });

  beforeEach(async () => {
    // Clear users table before each test
    await pool.query("DELETE FROM users");
  });

  // Create a test context with the real database
  const createContext = () =>
    createInnerTRPCContext({
      session: {
        user: { id: "test-user-id", email: "tester@example.com" },
        expires: new Date().toISOString(),
      },
      db,
    });

  describe("User CRUD operations", () => {
    it("should create, read, and delete users", async () => {
      const caller = userRouter.createCaller(createContext());

      // Create a user
      const user = await caller.createUser({
        email: "integration@example.com",
        name: "Integration Test User",
      });

      expect(user.id).toBeDefined();
      expect(user.email).toBe("integration@example.com");

      // Get all users
      const allUsers = await caller.getUsers();
      expect(allUsers).toHaveLength(1);
      expect(allUsers[0].id).toBe(user.id);

      // Get user by ID
      const foundUser = await caller.getUserById({ id: user.id });
      expect(foundUser).toEqual(user);
    });
  });
});
```
