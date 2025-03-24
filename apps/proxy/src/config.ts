import { env } from "@monsoft/vernisai-config";
import { ProxyConfig } from "./types";

// Defaults for the proxy configuration
const DEFAULT_PROXY_PORT = 3000;
const DEFAULT_API_PATH_PATTERN = "/api/";
const DEFAULT_CLIENT_URL = "http://localhost:5173";
const DEFAULT_LOG_LEVEL = "info";

/**
 * Loads and validates the proxy configuration
 * Uses environment variables with sensible defaults
 */
export function loadProxyConfig(): ProxyConfig {
  // Get the API port from the environment or vernisai-config
  const apiPort = process.env.API_PORT || env.api.port || 3005;
  const serverUrl = `http://localhost:${apiPort}`;

  console.log(`API port detected as: ${apiPort}`);

  return {
    // Use PROXY_PORT from environment or default to 3000
    port: process.env.PROXY_PORT
      ? parseInt(process.env.PROXY_PORT, 10)
      : DEFAULT_PROXY_PORT,

    // Use CLIENT_URL from environment or default to localhost:5173
    clientUrl: process.env.CLIENT_URL || DEFAULT_CLIENT_URL,

    // Use SERVER_URL from environment or build it from API port
    serverUrl: process.env.SERVER_URL || serverUrl,

    // Use API_PATH_PATTERN from environment or default to /api/
    apiPathPattern: process.env.API_PATH_PATTERN || DEFAULT_API_PATH_PATTERN,

    // Use LOG_LEVEL from environment or default to info
    logLevel: (process.env.LOG_LEVEL ||
      env.api.logging.level ||
      DEFAULT_LOG_LEVEL) as "debug" | "info" | "warn" | "error",
  };
}

// Export the configuration
export const config = loadProxyConfig();
