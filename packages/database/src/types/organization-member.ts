import { organizationMembers, roleEnum } from "../tables/relations";

/**
 * Represents a role a user can have in an organization
 */
export type Role = (typeof roleEnum.enumValues)[number];

/**
 * Represents a membership between a user and an organization
 */
export type OrganizationMember = typeof organizationMembers.$inferSelect;

/**
 * Represents data required to create a new organization membership
 */
export type NewOrganizationMember = typeof organizationMembers.$inferInsert;
