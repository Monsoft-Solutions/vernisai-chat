import { createFileRoute, useParams } from "@tanstack/react-router";
import { AgentBuilderForm } from "../../components/AgentBuilderForm";
import { useEffect, useState } from "react";
import { Agent, agents } from "../../mock/agents";

export const Route = createFileRoute("/agent/$id")({
  component: AgentDetail,
});

function AgentDetail() {
  const { id } = useParams({ from: "/agent/$id" });
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call to load agent data
    const foundAgent = agents.find((a: Agent) => a.id === id);
    setAgent(foundAgent || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-text-secondary">Loading agent details...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Agent Not Found</h1>
        <p className="text-text-secondary">
          The agent with ID {id} could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Agent: {agent.name}</h1>
      <AgentBuilderForm />
    </div>
  );
}
