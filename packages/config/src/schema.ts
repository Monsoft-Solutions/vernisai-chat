import { z } from "zod";

/**
 * Server mode options
 */
const serverModeSchema = z.enum(["serverless", "server"]);

/**
 * Logging level options
 */
const logLevelSchema = z.enum(["debug", "info", "warn", "error"]);

/**
 * Zod schema for validating environment variables
 */
export const environmentSchema = z.object({
  database: z.object({
    url: z
      .string()
      .min(1, "DATABASE_URL is required")
      .refine((url) => url.startsWith("postgresql://"), {
        message: "DATABASE_URL must be a valid PostgreSQL connection string",
      }),
  }),

  api: z
    .object({
      serverMode: serverModeSchema.default("serverless"),
      port: z.coerce
        .number()
        .int()
        .positive()
        .default(3001)
        .describe("Port for server mode"),
      cors: z
        .object({
          origin: z
            .union([z.string(), z.array(z.string())])
            .default("*")
            .describe("CORS origin configuration"),
          methods: z
            .array(z.string())
            .default(["GET", "POST", "PUT", "DELETE", "PATCH"])
            .describe("Allowed HTTP methods"),
          allowedHeaders: z
            .array(z.string())
            .default(["Content-Type", "Authorization", "x-organization-id"])
            .describe("Allowed HTTP headers"),
        })
        .default({}),
      logging: z
        .object({
          level: logLevelSchema.default("info"),
          format: z.enum(["json", "pretty"]).default("pretty"),
        })
        .default({}),
      openApi: z
        .object({
          enabled: z.boolean().default(true),
          path: z.string().default("/api/openapi.json"),
        })
        .default({}),
      trpcEndpoint: z.string().default("/api/trpc"),
    })
    .default({}),

  supabase: z
    .object({
      url: z.string().min(1, "SUPABASE_URL is required"),
      key: z.string().min(1, "SUPABASE_KEY is required"),
    })
    .optional(),

  langfuse: z
    .object({
      secretKey: z.string().min(1, "LANGFUSE_SECRET_KEY is required"),
      publicKey: z.string().min(1, "LANGFUSE_PUBLIC_KEY is required"),
      host: z.string().url("LANGFUSE_HOST must be a valid URL"),
    })
    .optional(),
});
