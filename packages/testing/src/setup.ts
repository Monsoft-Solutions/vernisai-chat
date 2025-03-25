/**
 * Global Vitest setup file
 *
 * This file runs before all tests to set up the testing environment.
 */

// Import from Vitest
import { afterAll } from "vitest";

// Define custom matchers
import "./matchers";

// Configure console mocks to avoid noise during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Filter out known React warnings during testing
console.error = (...args) => {
  // Filter out specific React warnings that we don't care about in tests
  const suppressedWarnings = [
    "Warning: ReactDOM.render is no longer supported",
    "Warning: useLayoutEffect does nothing on the server",
  ];

  if (
    typeof args[0] === "string" &&
    suppressedWarnings.some((warning) => args[0].includes(warning))
  ) {
    return;
  }

  originalConsoleError(...args);
};

console.warn = (...args) => {
  // Filter out specific warnings
  const suppressedWarnings = [
    "Warning: React does not recognize the",
    "Warning: The tag <",
  ];

  if (
    typeof args[0] === "string" &&
    suppressedWarnings.some((warning) => args[0].includes(warning))
  ) {
    return;
  }

  originalConsoleWarn(...args);
};

// Restore original console methods after all tests
// This is handled by the test framework's afterAll hook
afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
