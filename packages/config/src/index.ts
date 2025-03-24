import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { z } from "zod";
import { environmentSchema } from "./schema";
import type { Environment } from "./types";

// Export types
export * from "./types";

/**
 * Load and validate environment variables from .env files
 * Prioritize environment vars over .env files for production environments
 */
export const loadEnv = (localEnvPath?: string): Environment => {
  // First load from .env file if available
  const rootDir = findRootDir();

  // Load .env files in order of priority (later ones override earlier ones)
  dotenv.config({ path: path.resolve(rootDir, ".env") });
  dotenv.config({ path: path.resolve(rootDir, ".env.local") });

  // Allow custom .env path if provided
  if (localEnvPath) {
    dotenv.config({ path: path.resolve(rootDir, localEnvPath) });
  }

  // Map environment variables to our schema
  const rawEnv = {
    database: {
      url: process.env.DATABASE_URL || "",
    },
    api: {
      serverMode: process.env.API_SERVER_MODE,
      port: process.env.API_PORT,
      cors: {
        origin: process.env.API_CORS_ORIGIN,
      },
      logging: {
        level: process.env.LOG_LEVEL,
      },
      trpcEndpoint: process.env.API_TRPC_ENDPOINT,
    },
    supabase: process.env.SUPABASE_URL
      ? {
          url: process.env.SUPABASE_URL,
          key: process.env.SUPABASE_KEY || "",
        }
      : undefined,
    langfuse: process.env.LANGFUSE_SECRET_KEY
      ? {
          secretKey: process.env.LANGFUSE_SECRET_KEY || "",
          publicKey: process.env.LANGFUSE_PUBLIC_KEY || "",
          host: process.env.LANGFUSE_HOST || "",
        }
      : undefined,
  };

  // Validate and transform with Zod schema
  try {
    return environmentSchema.parse(rawEnv) as Environment;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      console.error(JSON.stringify(error.format(), null, 2));
      throw new Error(
        "Invalid environment configuration. See above for details.",
      );
    }

    throw new Error(
      `Failed to load environment configuration: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Find the root directory of the project
 * This looks for the root package.json by traversing up the directory tree
 */
function findRootDir(startPath: string = process.cwd()): string {
  // Check if we have a package.json file with workspaces
  const packageJsonPath = path.resolve(startPath, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      // If we found workspaces, this is the root
      if (packageJson.workspaces) {
        return startPath;
      }
    } catch (error) {
      // Ignore JSON parse errors
    }
  }

  // Stop if we're at the filesystem root
  const parentDir = path.resolve(startPath, "..");
  if (parentDir === startPath) {
    throw new Error("Could not find project root directory");
  }

  // Otherwise, continue looking up the directory tree
  return findRootDir(parentDir);
}

/**
 * The loaded and validated environment configuration
 */
export const env = loadEnv();
