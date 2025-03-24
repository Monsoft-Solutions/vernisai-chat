import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createId } from "../utils";

/**
 * Organizations table schema
 * Stores information about organizations/tenants in the system
 */
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().default(createId()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
