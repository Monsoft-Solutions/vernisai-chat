/**
 * @vernisai/logger - Unified logging solution for VernisAI applications
 */

// Export all types
export * from "./types";

// Export core functionality
export * from "./core/logger";
export * from "./core/context";
export * from "./core/metrics";

// Export utilities
export * from "./utils/sanitizer";
export * from "./utils/formatters";

// Export transports
export * from "./transports/console";
export * from "./transports/logtail";

// Default export for convenience
import { logger } from "./core/logger";
export default logger;
