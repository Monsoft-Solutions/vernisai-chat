/**
 * Export core tRPC components
 */
export * from "./trpc";

/**
 * Export routers
 */
export * from "./router";

/**
 * Export adapters
 */
export * from "./adapters/vercel";
export * from "./adapters/aws-lambda";
export * from "./adapters/express";

/**
 * Export server
 */
export * from "./server";

/**
 * Export config
 */
export * from "./config";

/**
 * Export type for OpenAPI document
 */
export { generateOpenApiDocument } from "trpc-openapi";
