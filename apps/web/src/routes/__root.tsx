import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <header className="border-b border-border-default p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">VernisAI Chat</h1>
          <nav className="flex gap-4">
            <Link
              to="/"
              activeProps={{ className: "font-bold text-primary-500" }}
              activeOptions={{ exact: true }}
              className="hover:text-primary-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              activeProps={{ className: "font-bold text-primary-500" }}
              className="hover:text-primary-500 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/chat"
              activeProps={{ className: "font-bold text-primary-500" }}
              className="hover:text-primary-500 transition-colors"
            >
              Chat
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Outlet />
      </main>

      {process.env.NODE_ENV !== "production" && <TanStackRouterDevtools />}
    </div>
  ),
});
