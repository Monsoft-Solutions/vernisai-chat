import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/agent/")({
  beforeLoad: () => {
    // For now, just redirect to create page
    throw redirect({ to: "/agent/create" });
  },
});
