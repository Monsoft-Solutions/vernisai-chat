import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../router";
import { createExpressContext } from "../trpc";
import { config } from "../config";

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

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
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
    console.log(`Express server listening on port ${port}`);
    console.log(`API endpoint available at ${config.trpcEndpoint}`);
    if (config.openApi.enabled) {
      console.log(`OpenAPI documentation available at ${config.openApi.path}`);
    }
  });

  // Handle graceful shutdown
  const handleShutdown = () => {
    console.log("Shutting down Express server...");
    server.close(() => {
      console.log("Express server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", handleShutdown);
  process.on("SIGINT", handleShutdown);

  return server;
};
