/**
 * @vernisai/logger - Unified logging solution for VernisAI applications
 */

// Export all types
export * from "./types";

// Export core functionality (where the correct createContextFormat is defined)
export * from "./core/logger";
export * from "./core/context";
export * from "./core/metrics";

// Export utilities
export * from "./utils/sanitizer";
// Export only the functions we need from formatters, not including its createContextFormat
export { createConsoleFormat, createJsonFormat } from "./utils/formatters";

// Export transports
export * from "./transports/console";
export * from "./transports/logtail";

// Export middleware
export * from "./middleware/express";
export * from "./middleware/trpc";

// Default export for convenience
import { logger } from "./core/logger";
export default logger;
