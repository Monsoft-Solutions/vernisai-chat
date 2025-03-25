/**
 * API Testing setup - configures the test environment
 *
 * This file sets up global mocks and configurations for API tests.
 */
import { setupCustomMatchers } from "@vernisai/testing/matchers";

// Set up custom matchers for the tests
setupCustomMatchers();

// Configure console mocks to avoid noise during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Filter out specific warning messages
console.error = (...args: unknown[]) => {
  // Silence specific errors that are expected during tests
  const messages = args.map(String);
  if (
    messages.some(
      (msg) =>
        msg.includes("Error: Not implemented") ||
        msg.includes("Test environment error"),
    )
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args: unknown[]) => {
  // Silence specific warnings that are expected during tests
  const messages = args.map(String);
  if (messages.some((msg) => msg.includes("Warning: This is a test"))) {
    return;
  }
  originalConsoleWarn(...args);
};

// Restore original console methods after all tests
// This is handled by the test framework's afterAll hook
