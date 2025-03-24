import { users } from "../tables/users";

/**
 * Represents a user in the system
 */
export type User = typeof users.$inferSelect;

/**
 * Represents data required to create a new user
 */
export type NewUser = typeof users.$inferInsert;
