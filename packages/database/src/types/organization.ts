import { organizations } from "../tables/organizations";

/**
 * Represents an organization in the system
 */
export type Organization = typeof organizations.$inferSelect;

/**
 * Represents data required to create a new organization
 */
export type NewOrganization = typeof organizations.$inferInsert;
