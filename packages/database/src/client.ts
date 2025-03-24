import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "@supabase/supabase-js";
import * as schema from "./tables";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from root .env.local file
dotenv.config({ path: path.resolve(process.cwd(), "../../.env.local") });

// For direct Postgres connection using postgres.js
const connectionString = process.env.DATABASE_URL;
export const queryClient = postgres(connectionString || "");
export const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, {
  schema,
});

// For Supabase connection
// const supabaseUrl = process.env.SUPABASE_URL || "";
// const supabaseKey = process.env.SUPABASE_KEY || "";
// export const supabase = createClient(supabaseUrl, supabaseKey);
