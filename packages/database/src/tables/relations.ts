import { pgTable, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "../utils";
import { users } from "./users";
import { organizations } from "./organizations";

/**
 * Role enum for organization memberships
 * Defines the possible roles a user can have in an organization
 */
export const roleEnum = pgEnum("role", ["owner", "admin", "member"]);

/**
 * Organization memberships table schema
 * Stores the relationships between users and organizations
 */
export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().default(createId()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  role: roleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
