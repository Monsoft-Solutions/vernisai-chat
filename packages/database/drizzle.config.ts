import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import path from "path";

// Load environment variables from root .env.local file
import { config } from "dotenv";
config({
  path: path.resolve(process.cwd(), "../../.env.local"),
});

export default defineConfig({
  schema: "./src/tables/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
