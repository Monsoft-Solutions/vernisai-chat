/**
 * @vernisai/types
 *
 * Shared TypeScript types for VernisAI's applications
 */

// Export chat-related types
export * from "./chat";

// Export dashboard-related types
export * from "./dashboard";

// Export user-related types
export * from "./user";

// Export common utility types
export * from "./common";

// Re-export specific types to ensure backward compatibility
// as we split types into proper domains
export type { TestMessage } from "./chat/message";
export type { AgentTemplate } from "./dashboard/agent";
export type { ConversationSummary } from "./dashboard/conversation";
