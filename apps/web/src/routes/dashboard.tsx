import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  OrganizationInfoCard,
  ConversationCard,
  AgentCard,
  UsageChart,
} from "@vernisai/ui";
import {
  PlusIcon,
  Search,
  ArrowRightIcon,
  MessageSquareText,
  BarChart3,
  Headset,
  Code,
  Bot,
  Brain,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import type { Conversation, Agent } from "../types/dashboard";

// Define the Dashboard route
export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

// Map string icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  MessageSquareText,
  BarChart3,
  Headset,
  Code,
  Bot,
  Brain,
  Search,
  Pencil,
};

function Dashboard() {
  const [conversationFilter, setConversationFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch data using tRPC
  const orgInfo = trpc.dashboard.getOrganizationInfo.useQuery();
  const recentConversations = trpc.dashboard.getRecentConversations.useQuery();
  const agents = trpc.dashboard.getAgents.useQuery();
  const usageData = trpc.dashboard.getUsageData.useQuery();

  // Loading state
  if (
    orgInfo.isLoading ||
    recentConversations.isLoading ||
    agents.isLoading ||
    usageData.isLoading
  ) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Error state
  if (
    orgInfo.isError ||
    recentConversations.isError ||
    agents.isError ||
    usageData.isError
  ) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen text-red-500">
        Error loading dashboard data. Please try again.
      </div>
    );
  }

  // Filter conversations based on the selected filter and search term
  const filteredConversations =
    recentConversations.data
      ?.filter(
        (conv: Conversation) =>
          searchTerm === "" ||
          conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.snippet.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter(
        (conv: Conversation) =>
          conversationFilter === "all" ||
          conv.model.toLowerCase().includes(conversationFilter),
      ) || [];

  // Enhanced agent filtering with case-insensitive matching
  const filteredAgents =
    agentFilter === "all"
      ? agents.data || []
      : (agents.data || []).filter((agent: Agent) =>
          agent.capabilities.some((cap: string) =>
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
              You have {recentConversations.data?.length || 0} recent
              conversations and {agents.data?.length || 0} agents available.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => navigate({ to: "/chat" })}
            >
              <PlusIcon size={16} /> New Chat
            </button>
            <button
              className="flex items-center gap-2 bg-white border border-border-default px-4 py-2 rounded-md hover:bg-background-secondary transition-colors"
              onClick={() => navigate({ to: "/agent/create" })}
            >
              <PlusIcon size={16} /> New Agent
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Organization Information */}
        <div className="md:col-span-1">
          <OrganizationInfoCard
            name={orgInfo.data?.name || ""}
            activeUsers={orgInfo.data?.activeUsers || 0}
            totalUsers={orgInfo.data?.totalUsers || 0}
            subscriptionPlan={orgInfo.data?.subscriptionPlan || "Free"}
            usagePercent={orgInfo.data?.usagePercent || 0}
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search conversations"
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
            {filteredConversations.map((conversation: Conversation) => (
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
          {(recentConversations.data?.length || 0) > 3 && (
            <div className="mt-4 text-center">
              <button
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mx-auto"
                onClick={() => navigate({ to: "/chat" })}
                aria-label="View all conversations"
              >
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
            {filteredAgents.map((agent: Agent) => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                description={agent.description}
                capabilities={agent.capabilities}
                avatarUrl={agent.avatarUrl}
                icon={agent.icon ? iconMap[agent.icon] : undefined}
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
        </div>

        {/* Usage Chart */}
        <div>
          <h2 className="text-xl font-medium mb-4">Usage This Month</h2>
          <div className="bg-white p-4 rounded-lg border border-border-default">
            <UsageChart data={usageData.data || []} title="Message Usage" />
          </div>
          <div className="mt-4 text-sm text-text-tertiary">
            <p>
              You've used{" "}
              <span className="font-medium text-text-primary">
                {orgInfo.data?.usagePercent || 0}%
              </span>{" "}
              of your monthly limit.
            </p>
            <div className="w-full bg-background-tertiary rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{
                  width: `${orgInfo.data?.usagePercent || 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
