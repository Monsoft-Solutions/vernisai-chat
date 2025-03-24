import { Agent, agents } from "./agents";

export type OrganizationInfo = {
  name: string;
  activeUsers: number;
  totalUsers: number;
  subscriptionPlan: "Free" | "Pro" | "Enterprise";
  usagePercent: number;
  createdAt: string | Date;
  renewalDate: string | Date;
  usageLimit: number;
};

export type Conversation = {
  id: string;
  title: string;
  lastMessageAt: Date;
  model: string;
  snippet: string;
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
  createdAt: new Date("2025-01-15"),
  renewalDate: new Date("2026-02-15"),
  usageLimit: 10000,
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

export const mockAgents: Agent[] = agents.slice(0, 4);

export const mockUsageData: UsageData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 29 + i);
  return {
    date: date.toISOString().split("T")[0],
    value: Math.floor(Math.random() * 60) + 20, // Random value between 20 and 80
  };
});
