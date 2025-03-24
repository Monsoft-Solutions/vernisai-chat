import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { PlusIcon, Search, ArrowRightIcon } from "lucide-react";
import { useState } from "react";

// Define the Dashboard route
export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [conversationFilter, setConversationFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const navigate = useNavigate();

  // Filter conversations based on the selected filter
  const filteredConversations =
    conversationFilter === "all"
      ? mockRecentConversations
      : mockRecentConversations.filter((conv) =>
          conv.model.toLowerCase().includes(conversationFilter),
        );

  // Enhanced agent filtering with case-insensitive matching
  const filteredAgents =
    agentFilter === "all"
      ? mockAgents
      : mockAgents.filter((agent) =>
          agent.capabilities.some((cap) =>
            cap.toLowerCase().includes(agentFilter.toLowerCase()),
          ),
        );

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Welcome back!</h1>
            <p className="text-text-secondary">
              You have {mockRecentConversations.length} recent conversations and{" "}
              {mockAgents.length} agents available.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              <PlusIcon size={16} /> New Chat
            </button>
            <button className="flex items-center gap-2 bg-white border border-border-default px-4 py-2 rounded-md hover:bg-background-secondary transition-colors">
              <PlusIcon size={16} /> New Agent
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Organization Information */}
        <div className="md:col-span-1">
          <OrganizationInfoCard
            name={mockOrganizationInfo.name}
            activeUsers={mockOrganizationInfo.activeUsers}
            totalUsers={mockOrganizationInfo.totalUsers}
            subscriptionPlan={mockOrganizationInfo.subscriptionPlan}
            usagePercent={mockOrganizationInfo.usagePercent}
          />

          {/* Quick Actions */}
        </div>

        {/* Recent Conversations */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-medium">Recent Conversations</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-8 pr-4 py-1.5 text-sm rounded-md border border-border-default w-full focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <select
                className="text-sm border border-border-default rounded-md py-1.5 px-2"
                value={conversationFilter}
                onChange={(e) => setConversationFilter(e.target.value)}
              >
                <option value="all">All Models</option>
                <option value="gpt">GPT Models</option>
                <option value="claude">Claude Models</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                id={conversation.id}
                title={conversation.title}
                lastMessageAt={conversation.lastMessageAt}
                model={conversation.model}
                snippet={conversation.snippet}
                onClick={() => {
                  navigate({
                    to: "/chat/$id",
                    params: { id: conversation.id },
                  });
                }}
              />
            ))}
            {filteredConversations.length === 0 && (
              <div className="col-span-full py-10 text-center text-text-tertiary">
                No conversations matching the current filter.
              </div>
            )}
          </div>
          {mockRecentConversations.length > 3 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mx-auto">
                View all conversations <ArrowRightIcon size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-20">
        {/* Available Agents */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-medium">Available Agents</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                className="text-sm border border-border-default rounded-md py-1.5 px-2"
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
              >
                <option value="all">All Capabilities</option>
                <option value="content creation">Content Creation</option>
                <option value="campaign planning">Campaign Planning</option>
                <option value="audience analysis">Audience Analysis</option>
                <option value="data analysis">Data Analysis</option>
                <option value="chart generation">Chart Generation</option>
                <option value="trend identification">
                  Trend Identification
                </option>
                <option value="code generation">Code Generation</option>
                <option value="code review">Code Review</option>
                <option value="debugging">Debugging</option>
                <option value="query resolution">Query Resolution</option>
                <option value="ticket management">Ticket Management</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                description={agent.description}
                capabilities={agent.capabilities}
                avatarUrl={agent.avatarUrl}
                icon={agent.icon}
                onStartConversation={() => {
                  navigate({
                    to: "/chat",
                    search: { agent: agent.id },
                  });
                }}
              />
            ))}
            {filteredAgents.length === 0 && (
              <div className="col-span-full py-10 text-center text-text-tertiary">
                No agents matching the current filter.
              </div>
            )}
          </div>
          {mockAgents.length > 4 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mx-auto">
                View all agents <ArrowRightIcon size={14} />
              </button>
            </div>
          )}
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
