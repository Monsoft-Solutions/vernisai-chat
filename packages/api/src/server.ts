import { config } from "./config";
import { startExpressServer } from "./adapters/express";
import logger from "./utils/logger";

/**
 * Start the server if running in server mode
 * This function will automatically determine whether to start in server mode
 * based on the API_SERVER_MODE environment variable
 *
 * @returns The server instance if started, or null if in serverless mode
 */
export const startServer = () => {
  logger.info("Starting the server...", {
    serverMode: config.serverMode,
    environment: process.env.NODE_ENV,
  });

  if (config.serverMode === "server") {
    return startExpressServer();
  }

  logger.info("API is configured for serverless mode. Server not started.");
  return null;
};

// Auto-start if this file is executed directly (not imported)
if (require.main === module) {
  startServer();
}
