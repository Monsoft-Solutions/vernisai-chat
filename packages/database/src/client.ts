import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "@supabase/supabase-js";
import * as schema from "./tables";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@monsoft/vernisai-config";

// For direct Postgres connection using postgres.js
const connectionString = env.database.url;
export const queryClient = postgres(connectionString);
export const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, {
  schema,
});

// For Supabase connection (only if configured)
export const supabase = env.supabase
  ? createClient(env.supabase.url, env.supabase.key)
  : null;
