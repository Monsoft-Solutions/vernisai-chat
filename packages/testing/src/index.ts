/**
 * VernisAI Testing Utilities
 *
 * A collection of testing utilities for VernisAI Chat
 */

// Re-export all modules
export * from "./config";
export * from "./fixtures";
export * from "./mocks";
export * from "./utils";
export * from "./types";

// Export mock APIs
import { mockApi } from "./mocks/api";
import { mockDatabase } from "./mocks/database";

// Bundle mocks in a single object
export const mocks = {
  api: mockApi,
  database: mockDatabase,
};

// Re-export from fixtures
import { fixtures } from "./fixtures";
export { fixtures };
