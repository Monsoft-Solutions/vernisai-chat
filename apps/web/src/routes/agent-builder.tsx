import { createFileRoute, redirect } from "@tanstack/react-router";

// Define search params type to include id
type SearchParams = {
  id?: string;
};

export const Route = createFileRoute("/agent-builder")({
  beforeLoad: ({ search }) => {
    const typedSearch = search as SearchParams;

    // If there's an id in the search params, redirect to the detail page
    if (typedSearch.id) {
      throw redirect({
        to: "/agent/$id",
        params: { id: typedSearch.id },
      });
    }
    // Otherwise redirect to the create page
    throw redirect({ to: "/agent/create" });
  },
});
