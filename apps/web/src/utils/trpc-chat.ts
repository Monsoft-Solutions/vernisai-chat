import { trpc } from "./trpc";

/**
 * Utility for accessing the chat API endpoints while we wait for tRPC types to be regenerated
 *
 * This is a temporary workaround until proper type generation is set up
 */
// @typescript-eslint/no-explicit-any
export const chatClient = {
  chat: {
    getSessions: {
      useQuery: () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (trpc as any).chat?.getSessions.useQuery();
      },
    },
    getTools: {
      useQuery: () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (trpc as any).chat?.getTools.useQuery();
      },
    },
    getSessionById: {
      useQuery: (params: { id: string }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (trpc as any).chat?.getSessionById.useQuery(params);
      },
    },
    sendMessage: {
      mutate: (params: { sessionId: string; content: string }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (trpc as any).chat?.sendMessage.mutate(params);
      },
    },
  },
};
