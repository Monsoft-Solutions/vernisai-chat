import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
// Import UI package's global styles first
import "@vernisai/ui/styles/global.css";
import "./style.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { trpc, useCreateTrpcClient } from "./utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  // Create a wrapper component to use the hook
  const App = () => {
    const { trpcClient, queryClient } = useCreateTrpcClient();

    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </trpc.Provider>
    );
  };

  root.render(<App />);
}
