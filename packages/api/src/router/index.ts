import { router } from "../trpc";
import { userRouter } from "./user";
import { organizationRouter } from "./organization";
import { conversationRouter } from "./conversation";
import { messageRouter } from "./message";
import { agentRouter } from "./agent";
import { billingRouter } from "./billing";
import { testRouter } from "./test";
import { dashboardRouter } from "./dashboard";

/**
 * Main application router that combines all sub-routers
 */
export const appRouter = router({
  user: userRouter,
  organization: organizationRouter,
  conversation: conversationRouter,
  message: messageRouter,
  agent: agentRouter,
  billing: billingRouter,
  test: testRouter,
  dashboard: dashboardRouter,
});

/**
 * Export type for client usage
 */
export type AppRouter = typeof appRouter;
