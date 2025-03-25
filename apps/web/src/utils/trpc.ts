import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@vernisai/api";
import { QueryClient } from "@tanstack/react-query";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

export const useCreateTrpcClient = () => {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: import.meta.env.VITE_API_URL || "http://localhost:3000/api/trpc",
        headers: () => {
          const headers: Record<string, string> = {};

          // Add any required headers like authentication
          // For example, if you have an auth token in localStorage
          // const token = localStorage.getItem('token');
          // if (token) headers.Authorization = `Bearer ${token}`;

          // Add organization ID header if needed
          const orgId = localStorage.getItem("organizationId");
          if (orgId) headers["x-organization-id"] = orgId;

          return headers;
        },
      }),
    ],
    transformer: superjson,
  });

  return { trpcClient, queryClient };
};
