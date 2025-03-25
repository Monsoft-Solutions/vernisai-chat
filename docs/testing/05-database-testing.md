# Database Testing

This document provides specific guidelines and best practices for testing the database package in the VernisAI Chat monorepo.

## Overview

The database package (`@vernisai/database`) uses Drizzle ORM to interact with the database. Testing this package is critical to ensure data integrity and proper database interactions.

## Test Structure

Database tests should be organized in the following structure:

```
packages/database/
├── src/
│   ├── models/
│   │   ├── user.ts
│   │   └── ...
└── tests/
    ├── unit/
    │   ├── models/
    │   │   ├── user.test.ts
    │   │   └── ...
    └── integration/
        ├── migrations/
        │   └── migration.test.ts
        └── client/
            └── client.test.ts
```

## Unit Testing

### Testing Model Definitions

Test your Drizzle model extensions and utility functions:

```typescript
// tests/unit/models/user.test.ts
import { describe, it, expect, vi } from "vitest";
import { User, extendUser } from "../../../src/models/user";
import { PrismaClient } from "@prisma/client";

describe("User Model", () => {
  it("should extend user with fullName getter", () => {
    // Create a mock user
    const user = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    } as User;

    // Apply the extension
    const extendedUser = extendUser(user);

    // Test the getter
    expect(extendedUser.fullName).toBe("John Doe");
  });

  it("should handle missing name components", () => {
    const userWithoutLastName = {
      id: "1",
      firstName: "John",
      lastName: null,
      email: "john@example.com",
    } as User;

    const extendedUser = extendUser(userWithoutLastName);

    expect(extendedUser.fullName).toBe("John");
  });
});
```

### Testing Database Utilities

Test any database utility functions you've created:

```typescript
// tests/unit/utils/pagination.test.ts
import { describe, it, expect } from "vitest";
import { createPaginationParams } from "../../../src/utils/pagination";

describe("Pagination Utilities", () => {
  it("should create correct pagination parameters", () => {
    const params = createPaginationParams({
      page: 2,
      pageSize: 10,
    });

    expect(params).toEqual({
      skip: 10,
      take: 10,
    });
  });

  it("should handle default values", () => {
    const params = createPaginationParams({});

    expect(params).toEqual({
      skip: 0,
      take: 20, // Default page size
    });
  });

  it("should handle invalid page numbers", () => {
    const params = createPaginationParams({
      page: -1,
      pageSize: 10,
    });

    expect(params).toEqual({
      skip: 0, // Should default to page 1
      take: 10,
    });
  });
});
```

## Integration Testing

For database integration tests, use a test database instance:

### Setup for Integration Tests

```typescript
// tests/integration/setup.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { beforeAll, afterAll, beforeEach } from "vitest";
import { createTestDatabase } from "@vernisai/testing/db";
import { Pool } from "pg";

// Create a test database
const testDb = createTestDatabase();

// Create a Drizzle client connected to the test database
const pool = new Pool({ connectionString: testDb.url });
export const db = drizzle(pool);

beforeAll(async () => {
  // Set up the test database
  await testDb.setup();

  // Run migrations or create schema
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

afterAll(async () => {
  // Clean up
  await pool.end();
  await testDb.teardown();
});

beforeEach(async () => {
  // Clear all tables before each test
  await pool.query("DELETE FROM users");
});
```

### Testing Database Operations

```typescript
// tests/integration/client/client.test.ts
import { describe, it, expect } from "vitest";
import { db } from "../setup";
import { eq } from "drizzle-orm";
import { users } from "../../../src/schema";

describe("Database Client Integration", () => {
  it("should create a user", async () => {
    // Create a user
    const [user] = await db
      .insert(users)
      .values({
        email: "test@example.com",
        name: "Test User",
      })
      .returning();

    // Verify the user was created
    expect(user.id).toBeDefined();
    expect(user.email).toBe("test@example.com");
    expect(user.name).toBe("Test User");

    // Retrieve the user to double-check
    const retrievedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .then((res) => res[0]);

    expect(retrievedUser).toEqual(user);
  });

  it("should update a user", async () => {
    // Create a user
    const [user] = await db
      .insert(users)
      .values({
        email: "test@example.com",
        name: "Original Name",
      })
      .returning();

    // Update the user
    const [updatedUser] = await db
      .update(users)
      .set({ name: "Updated Name" })
      .where(eq(users.id, user.id))
      .returning();

    // Verify the update
    expect(updatedUser.name).toBe("Updated Name");
    expect(updatedUser.email).toBe("test@example.com");

    // Retrieve the user to double-check
    const retrievedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .then((res) => res[0]);

    expect(retrievedUser.name).toBe("Updated Name");
  });

  it("should delete a user", async () => {
    // Create a user
    const [user] = await db
      .insert(users)
      .values({
        email: "delete@example.com",
        name: "To Be Deleted",
      })
      .returning();

    // Delete the user
    await db.delete(users).where(eq(users.id, user.id));

    // Verify the user was deleted
    const retrievedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .then((res) => res[0]);

    expect(retrievedUser).toBeUndefined();
  });

  it("should enforce unique constraints", async () => {
    // Create a user
    await db.insert(users).values({
      email: "unique@example.com",
      name: "First User",
    });

    // Try to create another user with the same email
    const createDuplicate = async () => {
      await db.insert(users).values({
        email: "unique@example.com",
        name: "Second User",
      });
    };

    // Should throw due to unique constraint
    await expect(createDuplicate()).rejects.toThrow();
  });
});
```

### Testing Migrations

Test that your migrations apply correctly:

```typescript
// tests/integration/migrations/migration.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { exec } from "child_process";
import { promisify } from "util";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { createTestDatabase } from "@vernisai/testing/db";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const execAsync = promisify(exec);

describe("Database Migrations", () => {
  let testDb;
  let db;
  let pool;

  beforeAll(async () => {
    // Create a fresh test database
    testDb = createTestDatabase();
    await testDb.setup();

    // Set the DATABASE_URL environment variable for the migration
    process.env.DATABASE_URL = testDb.url;

    // Create a database connection
    pool = new Pool({ connectionString: testDb.url });
    db = drizzle(pool);

    // Run Drizzle migrations
    await migrate(db, { migrationsFolder: "./drizzle" });
  });

  afterAll(async () => {
    await pool.end();
    await testDb.teardown();
    delete process.env.DATABASE_URL;
  });

  it("should create all tables", async () => {
    // Query the database to check if tables exist
    const tables = await pool.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `);

    // Check that all expected tables exist
    const tableNames = tables.rows.map((row) => row.tablename);
    expect(tableNames).toContain("users");
    expect(tableNames).toContain("organizations");
    expect(tableNames).toContain("conversations");
    expect(tableNames).toContain("messages");
  });

  it("should set up foreign key constraints", async () => {
    // Create test data
    const [organization] = await db
      .insert(organizations)
      .values({
        name: "Test Organization",
      })
      .returning();

    await db.insert(users).values({
      name: "Test User",
      email: "test@example.com",
      organizationId: organization.id,
    });

    // Test foreign key constraint by trying to delete the organization
    // This should fail because the user references it
    const deleteOrg = async () => {
      await db
        .delete(organizations)
        .where(eq(organizations.id, organization.id));
    };

    await expect(deleteOrg()).rejects.toThrow();
  });
});
```

## Testing Connection Management

Test database connection management:

```typescript
// tests/unit/connection.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createDatabaseClient,
  closeDatabaseConnection,
} from "../../../src/connection";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// Mock Pool and drizzle
vi.mock("pg", () => {
  const mockEnd = vi.fn().mockResolvedValue(undefined);

  return {
    Pool: vi.fn().mockImplementation(() => ({
      connect: vi.fn().mockResolvedValue(undefined),
      end: mockEnd,
    })),
  };
});

vi.mock("drizzle-orm/node-postgres", () => {
  return {
    drizzle: vi.fn().mockImplementation(() => ({
      // Mock drizzle client
    })),
  };
});

describe("Database Connection Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a database client", async () => {
    const client = await createDatabaseClient();

    expect(client).toBeDefined();
    expect(Pool).toHaveBeenCalledTimes(1);
    expect(drizzle).toHaveBeenCalledTimes(1);
  });

  it("should close the database connection", async () => {
    const client = await createDatabaseClient();
    await closeDatabaseConnection(client);

    // We expect the internal pool to have been closed
    expect(client.pool.end).toHaveBeenCalledTimes(1);
  });

  it("should reuse the same client when called multiple times", async () => {
    const firstClient = await createDatabaseClient();
    const secondClient = await createDatabaseClient();

    expect(firstClient).toBe(secondClient);
    expect(Pool).toHaveBeenCalledTimes(1);
  });
});
```

## Testing Transactions

Test that transactions work correctly:

```typescript
// tests/integration/transactions.test.ts
import { describe, it, expect } from "vitest";
import { db, pool } from "./setup";
import { eq } from "drizzle-orm";
import { users, organizations } from "../../../src/schema";

describe("Database Transactions", () => {
  it("should commit successful transactions", async () => {
    // Start a transaction
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Create a user
      const insertUserResult = await client.query(
        `
        INSERT INTO users (name, email) 
        VALUES ($1, $2) 
        RETURNING *
      `,
        ["Transaction User", "transaction@example.com"],
      );

      const user = insertUserResult.rows[0];

      // Create an organization for the user
      const insertOrgResult = await client.query(
        `
        INSERT INTO organizations (name)
        VALUES ($1)
        RETURNING *
      `,
        ["Transaction Org"],
      );

      const organization = insertOrgResult.rows[0];

      // Link user to organization
      await client.query(
        `
        UPDATE users SET organization_id = $1 WHERE id = $2
      `,
        [organization.id, user.id],
      );

      await client.query("COMMIT");

      // Verify both objects were created
      expect(user.id).toBeDefined();
      expect(organization.id).toBeDefined();
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }

    // Verify they exist outside the transaction
    const retrievedUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "transaction@example.com"))
      .then((res) => res[0]);

    const retrievedOrg = await db
      .select()
      .from(organizations)
      .where(eq(organizations.name, "Transaction Org"))
      .then((res) => res[0]);

    expect(retrievedUser).toBeDefined();
    expect(retrievedOrg).toBeDefined();
  });

  it("should rollback failed transactions", async () => {
    // Create a user outside the transaction for reference
    const [existingUser] = await db
      .insert(users)
      .values({
        name: "Existing User",
        email: "existing@example.com",
      })
      .returning();

    // Start a transaction that will fail
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Create a user
      await client.query(
        `
        INSERT INTO users (name, email) 
        VALUES ($1, $2)
      `,
        ["Will Rollback", "rollback@example.com"],
      );

      // Try to create another user with a duplicate email (which will fail)
      await client.query(
        `
        INSERT INTO users (name, email) 
        VALUES ($1, $2)
      `,
        ["Duplicate Email", "existing@example.com"],
      );

      await client.query("COMMIT");
    } catch (error) {
      // Expected to fail
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }

    // Verify the first user was not created due to rollback
    const rollbackUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, "rollback@example.com"));

    expect(rollbackUsers.length).toBe(0);
  });
});
```

## Testing with Seed Data

Test seeding functionality:

```typescript
// tests/integration/seed.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { seed } from "../../../src/seed";
import { db } from "../setup";
import { eq } from "drizzle-orm";
import { users, organizations } from "../../../src/schema";

describe("Database Seed", () => {
  beforeAll(async () => {
    // Run the seed function
    await seed(db);
  });

  it("should create default users", async () => {
    const allUsers = await db.select().from(users);

    expect(allUsers.length).toBeGreaterThan(0);

    const adminUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@example.com"))
      .then((res) => res[0]);

    expect(adminUser).toBeDefined();
  });

  it("should create default organizations", async () => {
    const allOrgs = await db.select().from(organizations);

    expect(allOrgs.length).toBeGreaterThan(0);

    const defaultOrg = await db
      .select()
      .from(organizations)
      .where(eq(organizations.name, "Default Organization"))
      .then((res) => res[0]);

    expect(defaultOrg).toBeDefined();
  });

  it("should associate users with organizations", async () => {
    const adminUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@example.com"))
      .then((res) => res[0]);

    expect(adminUser.organizationId).not.toBeNull();

    // Query the organization
    const organization = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, adminUser.organizationId))
      .then((res) => res[0]);

    expect(organization).toBeDefined();
  });
});
```

## Performance Testing

Test database query performance:

```typescript
// tests/performance/queries.test.ts
import { describe, it, expect } from "vitest";
import { db, pool } from "../integration/setup";
import { createPerformanceTest } from "@vernisai/testing/performance";
import {
  users,
  organizations,
  conversations,
  messages,
} from "../../../src/schema";
import { eq, like, inArray } from "drizzle-orm";

describe("Database Query Performance", () => {
  it("should have acceptable performance for user listing", async () => {
    // Create a large number of test users
    const userValues = [];
    for (let i = 0; i < 100; i++) {
      userValues.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
      });
    }

    await db.insert(users).values(userValues);

    // Measure query performance
    const { duration } = await createPerformanceTest(async () => {
      await db
        .select()
        .from(users)
        .leftJoin(organizations, eq(users.organizationId, organizations.id));
    });

    // Assert that the query executes in under 200ms
    expect(duration).toBeLessThan(200);
  });

  it("should have acceptable performance for complex query", async () => {
    // Measure performance of a complex query
    const { duration } = await createPerformanceTest(async () => {
      await db
        .select()
        .from(conversations)
        .leftJoin(
          organizations,
          eq(conversations.organizationId, organizations.id),
        )
        .where(like(organizations.name, "%Test%"))
        .leftJoin(messages, eq(conversations.id, messages.conversationId))
        .where(like(messages.content, "%important%"))
        .limit(10);
    });

    // Assert performance
    expect(duration).toBeLessThan(500);
  });
});
```

## Best Practices

1. **Use transactions for test isolation**: Each test should run in its own transaction that gets rolled back afterward.
2. **Test all CRUD operations**: Ensure you have tests for creating, reading, updating, and deleting data.
3. **Test constraints and validations**: Verify that database constraints (like unique indexes) work as expected.
4. **Test relationships**: Verify that relationships between models work correctly.
5. **Test migrations**: Ensure that migrations apply correctly and produce the expected schema.
6. **Test seed data**: Verify that seeding functionality works correctly.
7. **Test error handling**: Verify that database errors are handled properly.
8. **Test connection management**: Verify that database connections are managed properly.
9. **Test query performance**: Include tests for query performance to catch slow queries early.

## Testing Tools

The `@vernisai/testing` package provides several utilities for database testing:

- `createTestDatabase`: Creates an isolated test database (SQLite, PostgreSQL)
- `mockDatabase`: Creates a mock Drizzle database client for unit tests
- `seedTestData`: Seeds a test database with test data
- `createDatabaseFixture`: Creates database fixtures for reuse across tests
- `performanceTest`: Measures query performance

## Common Pitfalls

1. **Sharing database state**: Not properly isolating tests can lead to flaky tests
2. **Slow tests**: Database tests can be slow, so focus on unit testing when possible
3. **Over-mocking**: For integration tests, use a real database to catch real issues
4. **Hardcoded test data**: Use factories or fixtures for test data
5. **Not testing migrations**: Migrations can be a source of production issues
6. **Not testing error cases**: Test both successful and error cases

## Mocking the Database

Use the mock utilities from the base testing package:

```typescript
import { describe, it, expect } from "vitest";
import { mockDatabase } from "@vernisai/testing/mocks";
import { getUserById } from "../../../src/users";

describe("User queries", () => {
  it("should get user by id", async () => {
    // Arrange
    const mockDb = mockDatabase({
      users: [{ id: "1", name: "Test User", email: "test@example.com" }],
    });

    // Act
    const user = await getUserById(mockDb, "1");

    // Assert
    expect(user).toEqual({
      id: "1",
      name: "Test User",
      email: "test@example.com",
    });
  });

  it("should return null for non-existent user", async () => {
    // Arrange
    const mockDb = mockDatabase({
      users: [],
    });

    // Act
    const user = await getUserById(mockDb, "1");

    // Assert
    expect(user).toBeNull();
  });
});
```

## Testing Database Migrations

Drizzle migrations should also be tested:

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@vernisai/database/client";
import { applyMigrations } from "@vernisai/database/migrate";
import { createTestDatabase } from "@vernisai/testing/db";

describe("Database migrations", () => {
  let dbClient;
  let dbUrl;

  beforeAll(async () => {
    // Create a temporary test database
    const testDb = await createTestDatabase();
    dbUrl = testDb.url;
    dbClient = createClient({ url: dbUrl });

    // Apply migrations
    await applyMigrations(dbUrl);
  });

  afterAll(async () => {
    // Close the client
    await dbClient.close();
  });

  it("should create the users table", async () => {
    // Query the database to check if the users table exists
    const result = await dbClient.execute(
      sql`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );`,
    );

    expect(result[0].exists).toBe(true);
  });

  it("should create the organizations table", async () => {
    // Query the database to check if the organizations table exists
    const result = await dbClient.execute(
      sql`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'organizations'
      );`,
    );

    expect(result[0].exists).toBe(true);
  });
});
```

import { mockDatabaseClient } from "@vernisai/testing/mocks";

describe("Transaction testing", () => {
it("should commit transaction when all operations succeed", async () => {
// Arrange
const mockDb = mockDatabaseClient();

    // Act
    const result = await withTransaction(mockDb, async (tx) => {
      await createUser(tx, { name: "Test User", email: "test@example.com" });
      await createOrganization(tx, { name: "Test Org" });
      return true;
    });

    // Assert
    expect(result).toBe(true);
    expect(mockDb.commit).toHaveBeenCalledTimes(1);
    expect(mockDb.rollback).not.toHaveBeenCalled();

});

// ... existing code ...
});
