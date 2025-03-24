import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createId } from "../utils";

/**
 * Users table schema
 * Stores basic information about system users
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(createId()),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
