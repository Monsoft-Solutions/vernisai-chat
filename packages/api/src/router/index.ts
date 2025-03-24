import { router } from "../trpc";
import { userRouter } from "./user";
import { organizationRouter } from "./organization";
import { conversationRouter } from "./conversation";
import { messageRouter } from "./message";
import { agentRouter } from "./agent";
import { billingRouter } from "./billing";

/**
 * Main application router that combines all sub-routers
 */
export const appRouter = router({
  users: userRouter,
  organizations: organizationRouter,
  conversations: conversationRouter,
  messages: messageRouter,
  agents: agentRouter,
  billing: billingRouter,
});

/**
 * Export type for client usage
 */
export type AppRouter = typeof appRouter;
