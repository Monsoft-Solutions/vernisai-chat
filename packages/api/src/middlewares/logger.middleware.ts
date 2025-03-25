import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { initTRPC } from "@trpc/server";
import logger from "../utils/logger";

// Initialize tRPC for the middleware
const t = initTRPC
  .context<{ session: { userId: string } | null; organizationId?: string }>()
  .create();

// Type for potentially extended error object
type ErrorWithData = {
  code: string;
  message: string;
  data?: unknown;
};

/**
 * TRPC middleware for logging requests and responses
 */
export const loggerMiddleware = t.middleware(
  async ({ path, type, next, ctx }) => {
    const start = Date.now();

    // Log the request
    logger.info(`TRPC ${type} request started`, {
      path,
      type,
      user: ctx.session?.userId,
      organizationId: ctx.organizationId,
    });

    // Execute the request and catch errors
    const result = await next();

    const durationMs = Date.now() - start;

    if (!result.ok) {
      // Log errors
      const error = result.error;
      const httpCode = getHTTPStatusCodeFromError(error);
      const errorData = error as unknown as ErrorWithData;

      logger.error(`TRPC ${type} request failed`, {
        path,
        type,
        error: {
          code: errorData.code,
          message: errorData.message,
          ...(errorData.data ? { data: errorData.data } : {}),
        },
        httpStatus: httpCode,
        durationMs,
        user: ctx.session?.userId,
        organizationId: ctx.organizationId,
      });
    } else {
      // Log successful requests
      logger.info(`TRPC ${type} request completed`, {
        path,
        type,
        durationMs,
        user: ctx.session?.userId,
        organizationId: ctx.organizationId,
      });
    }

    return result;
  },
);
