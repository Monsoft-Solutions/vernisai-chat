import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, queryClient } from "./client";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from root .env.local file
dotenv.config({ path: path.resolve(process.cwd(), "../../.env.local") });

async function runMigration() {
  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await queryClient.end();
    process.exit(0);
  }
}

runMigration();
