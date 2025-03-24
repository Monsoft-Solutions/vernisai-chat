import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { env } from "@monsoft/vernisai-config";
import { TRPCError } from "@trpc/server";

/**
 * Test router for development purposes
 */
export const testRouter = router({
  /**
   * Get environment configuration (only in development)
   */
  getEnv: publicProcedure
    .input(
      z
        .object({
          section: z.enum(["api", "database"]).optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      // Only allow in development mode
      if (process.env.NODE_ENV === "production") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This endpoint is only available in development mode",
        });
      }

      // Return requested section or all environment info
      if (input?.section === "api") {
        return {
          api: env.api,
        };
      } else if (input?.section === "database") {
        return {
          database: {
            // Only return the type of DB, not the full connection string for security
            type: "PostgreSQL",
            connected: !!env.database.url,
          },
        };
      }

      // Return safe subset of environment config
      return {
        api: env.api,
        database: {
          type: "PostgreSQL",
          connected: !!env.database.url,
        },
        hasSupabase: !!env.supabase,
        hasLangfuse: !!env.langfuse,
        nodeEnv: process.env.NODE_ENV,
      };
    }),
});
