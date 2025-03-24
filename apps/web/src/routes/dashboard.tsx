import { createFileRoute } from "@tanstack/react-router";
import {
  OrganizationInfoCard,
  ConversationCard,
  AgentCard,
  UsageChart,
} from "@vernisai/ui";
import {
  mockOrganizationInfo,
  mockRecentConversations,
  mockAgents,
  mockUsageData,
} from "../mock/dashboardData";

// Define the Dashboard route
export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Organization Information */}
        <div className="md:col-span-1">
          <OrganizationInfoCard
            name={mockOrganizationInfo.name}
            activeUsers={mockOrganizationInfo.activeUsers}
            totalUsers={mockOrganizationInfo.totalUsers}
            subscriptionPlan={mockOrganizationInfo.subscriptionPlan}
            usagePercent={mockOrganizationInfo.usagePercent}
          />
        </div>

        {/* Recent Conversations */}
        <div className="md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-medium mb-4">Recent Conversations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRecentConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                id={conversation.id}
                title={conversation.title}
                lastMessageAt={conversation.lastMessageAt}
                model={conversation.model}
                snippet={conversation.snippet}
                onClick={() =>
                  console.log(`Navigate to conversation ${conversation.id}`)
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Available Agents */}
        <div>
          <h2 className="text-xl font-medium mb-4">Available Agents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockAgents.slice(0, 4).map((agent) => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                description={agent.description}
                capabilities={agent.capabilities}
                avatarUrl={agent.avatarUrl}
                onStartConversation={() =>
                  console.log(`Start conversation with agent ${agent.id}`)
                }
              />
            ))}
          </div>
        </div>

        {/* Usage Statistics */}
        <div>
          <h2 className="text-xl font-medium mb-4">Usage Statistics</h2>
          <UsageChart data={mockUsageData} title="Message Usage" />
        </div>
      </div>
    </div>
  );
}
