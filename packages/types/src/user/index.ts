/**
 * User domain types
 */

/**
 * Basic user profile information
 */
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
};

/**
 * User roles in the system
 */
export type UserRole = "user" | "admin" | "owner";
