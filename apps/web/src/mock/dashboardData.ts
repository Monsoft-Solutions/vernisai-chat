export type OrganizationInfo = {
  name: string;
  activeUsers: number;
  totalUsers: number;
  subscriptionPlan: "Free" | "Pro" | "Enterprise";
  usagePercent: number;
};

export type Conversation = {
  id: string;
  title: string;
  lastMessageAt: Date;
  model: string;
  snippet: string;
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatarUrl?: string;
};

export type UsageData = {
  date: string;
  value: number;
};

export const mockOrganizationInfo: OrganizationInfo = {
  name: "VernisAI Inc.",
  activeUsers: 12,
  totalUsers: 15,
  subscriptionPlan: "Pro",
  usagePercent: 68,
};

export const mockRecentConversations: Conversation[] = [
  {
    id: "1",
    title: "Marketing Campaign Ideas",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    model: "GPT-4",
    snippet:
      "We could try a social media approach focused on user testimonials...",
  },
  {
    id: "2",
    title: "Product Roadmap Review",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    model: "Claude 3",
    snippet: "The Q3 priorities should focus on improving user onboarding...",
  },
  {
    id: "3",
    title: "Customer Support Training",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    model: "GPT-4",
    snippet: "Here are the key points to cover in the training session...",
  },
  {
    id: "4",
    title: "Website Copy Review",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    model: "Claude 3",
    snippet:
      "The homepage messaging could be more direct and benefit-focused...",
  },
];

export const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Marketing Assistant",
    description: "Helps create and refine marketing campaigns and content",
    capabilities: [
      "Content Creation",
      "Campaign Planning",
      "Audience Analysis",
    ],
    avatarUrl: "/avatars/marketing-agent.svg",
  },
  {
    id: "2",
    name: "Data Analyst",
    description: "Analyzes data and generates insights and visualizations",
    capabilities: ["Data Analysis", "Chart Generation", "Trend Identification"],
    avatarUrl: "/avatars/data-agent.svg",
  },
  {
    id: "3",
    name: "Customer Support",
    description: "Assists with customer queries and support ticket management",
    capabilities: ["Query Resolution", "Ticket Management", "Knowledge Base"],
    avatarUrl: "/avatars/support-agent.svg",
  },
  {
    id: "4",
    name: "Code Assistant",
    description: "Helps write, review, and debug code across various languages",
    capabilities: ["Code Generation", "Code Review", "Debugging"],
    avatarUrl: "/avatars/code-agent.svg",
  },
];

export const mockUsageData: UsageData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 29 + i);
  return {
    date: date.toISOString().split("T")[0],
    value: Math.floor(Math.random() * 60) + 20, // Random value between 20 and 80
  };
});
