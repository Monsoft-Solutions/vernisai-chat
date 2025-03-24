import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

/**
 * Context interface for tRPC requests
 */
export type CreateContextOptions = {
  session: { userId: string } | null;
  organizationId?: string;
};

/**
 * Creates context for incoming requests
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    organizationId: opts.organizationId,
  };
};

/**
 * Creates context for Next.js server requests
 */
export const createTRPCContext = async ({ req }: CreateNextContextOptions) => {
  // Extract authorization information from headers or cookies
  // This is a placeholder and should be replaced with actual auth logic
  const session = null; // Will be replaced with actual auth logic using req.headers.authorization

  // Extract organization ID from headers, query params, etc.
  const organizationId = req.headers["x-organization-id"] as string | undefined;

  return createInnerTRPCContext({
    session,
    organizationId,
  });
};

/**
 * Initialize tRPC
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Middleware to check if user is authenticated
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session },
    },
  });
});

/**
 * Middleware to check if organization is specified
 */
const enforceOrganizationIsSpecified = t.middleware(({ ctx, next }) => {
  if (!ctx.organizationId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Organization ID is required",
    });
  }
  return next({
    ctx: {
      ...ctx,
      organizationId: ctx.organizationId,
    },
  });
});

/**
 * Protected procedure - requires user to be authenticated
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

/**
 * Organization procedure - requires both user auth and organization ID
 */
export const organizationProcedure = protectedProcedure.use(
  enforceOrganizationIsSpecified
);

/**
 * Merge routers helper function
 */
export const mergeRouters = t.mergeRouters;
