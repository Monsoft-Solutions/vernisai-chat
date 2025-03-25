import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
// Import UI package's global styles first
import "@vernisai/ui/styles/global.css";
import "./style.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { trpc, useCreateTrpcClient } from "./utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { initSentry, SentryErrorBoundary } from "./utils/sentry";

// Initialize Sentry
initSentry();

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
      <SentryErrorBoundary
        fallback={({ error }) => (
          <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="mb-4 text-red-500">
              {(error as Error)?.message || "Unknown error occurred"}
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        )}
      >
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </trpc.Provider>
      </SentryErrorBoundary>
    );
  };

  root.render(<App />);
}
