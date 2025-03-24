import { defineConfig } from "drizzle-kit";
import { env } from "@monsoft/vernisai-config";

export default defineConfig({
  schema: "./src/tables/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.database.url,
  },
});
