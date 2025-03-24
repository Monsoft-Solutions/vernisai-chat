import { createFileRoute } from "@tanstack/react-router";
import { AgentBuilderForm } from "../components/AgentBuilderForm";

export const Route = createFileRoute("/agent-builder")({
  component: AgentBuilder,
});

function AgentBuilder() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Agent</h1>
      <AgentBuilderForm />
    </div>
  );
}
