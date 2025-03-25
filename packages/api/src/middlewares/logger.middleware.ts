import { initTRPC } from "@trpc/server";
import { logger } from "../utils/logger";

// Initialize tRPC for the middleware
const t = initTRPC
  .context<{ session: { userId: string } | null; organizationId?: string }>()
  .create();

/**
 * TRPC middleware for logging requests and responses
 *
 * We implement this using a custom middleware approach for better type safety.
 */
export const loggerMiddleware = t.middleware(({ path, type, next, ctx }) => {
  const start = Date.now();

  // Log the request
  logger.debug(`TRPC ${type} request started`, {
    path,
    type,
    userId: ctx.session?.userId,
    organizationId: ctx.organizationId,
  });

  // Execute the request
  return next()
    .then((result) => {
      const durationMs = Date.now() - start;

      // Log successful completion
      logger.info(`TRPC ${type} request completed`, {
        path,
        type,
        durationMs,
        userId: ctx.session?.userId,
        organizationId: ctx.organizationId,
      });

      return result;
    })
    .catch((error) => {
      const durationMs = Date.now() - start;

      // Log error
      logger.error(`TRPC ${type} request failed`, {
        path,
        type,
        durationMs,
        error: {
          message: error.message,
          code: error.code,
          stack: error.stack,
        },
        userId: ctx.session?.userId,
        organizationId: ctx.organizationId,
      });

      throw error;
    });
});
