import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../router";
import { createExpressContext } from "../trpc";
import { config } from "../config";
import { setupRequestLogging } from "../utils/request-logger";
import logger from "../utils/logger";

/**
 * Create an Express application with tRPC middleware
 */
export const createExpressApp = () => {
  const app = express();

  // Apply middleware
  app.use(
    cors({
      origin: config.cors.origin,
      methods: config.cors.methods,
      allowedHeaders: config.cors.allowedHeaders,
    }),
  );
  app.use(express.json());

  // Set up request logging middleware
  setupRequestLogging(app);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Test error endpoint
  app.get("/test-error", (req, res, next) => {
    logger.error("Test error triggered");
    const error = new Error("Test error");
    next(error);
  });

  // OpenAPI documentation endpoint if enabled
  if (config.openApi.enabled) {
    app.get(config.openApi.path, (req, res) => {
      // This should be replaced with actual OpenAPI document generation
      // using trpc-openapi once implemented
      res.status(200).json({
        openapi: "3.0.0",
        info: {
          title: "VernisAI API",
          version: "1.0.0",
          description: "VernisAI API Documentation",
        },
        paths: {},
      });
    });
  }

  // tRPC middleware
  app.use(
    config.trpcEndpoint,
    createExpressMiddleware({
      router: appRouter,
      createContext: createExpressContext,
    }),
  );

  return app;
};

/**
 * Start the Express server
 */
export const startExpressServer = () => {
  const app = createExpressApp();
  const port = config.port;

  const server = app.listen(port, () => {
    logger.info(`Express server listening on port ${port}`, {
      port,
      apiEndpoint: config.trpcEndpoint,
      openApiEnabled: config.openApi.enabled,
      openApiPath: config.openApi.enabled ? config.openApi.path : null,
    });
  });

  // Handle graceful shutdown
  const handleShutdown = () => {
    logger.info("Shutting down Express server...");
    server.close(() => {
      logger.info("Express server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", handleShutdown);
  process.on("SIGINT", handleShutdown);

  return server;
};
