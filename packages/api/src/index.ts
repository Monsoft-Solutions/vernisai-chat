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

/**
 * Export type for OpenAPI document
 */
export { generateOpenApiDocument } from "trpc-openapi";
