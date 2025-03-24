import {
  MessageSquareText,
  BarChart3,
  Headset,
  Code,
  Bot,
  Brain,
  Search,
  Pencil,
  type LucideIcon,
} from "lucide-react";

export type Agent = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatarUrl?: string;
  // Adding icon for each agent
  icon: LucideIcon;
};

export const agents: Agent[] = [
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
    icon: MessageSquareText,
  },
  {
    id: "2",
    name: "Data Analyst",
    description: "Analyzes data and generates insights and visualizations",
    capabilities: ["Data Analysis", "Chart Generation", "Trend Identification"],
    avatarUrl: "/avatars/data-agent.svg",
    icon: BarChart3,
  },
  {
    id: "3",
    name: "Customer Support",
    description: "Assists with customer queries and support ticket management",
    capabilities: ["Query Resolution", "Ticket Management", "Knowledge Base"],
    avatarUrl: "/avatars/support-agent.svg",
    icon: Headset,
  },
  {
    id: "4",
    name: "Code Assistant",
    description: "Helps write, review, and debug code across various languages",
    capabilities: ["Code Generation", "Code Review", "Debugging"],
    avatarUrl: "/avatars/code-agent.svg",
    icon: Code,
  },
  {
    id: "5",
    name: "Research Assistant",
    description:
      "Conducts research, summarizes findings, and provides insights",
    capabilities: [
      "Information Retrieval",
      "Summarization",
      "Critical Analysis",
    ],
    avatarUrl: "/avatars/research-agent.svg",
    icon: Search,
  },
  {
    id: "6",
    name: "Creative Writer",
    description: "Generates creative content for various purposes",
    capabilities: ["Content Generation", "Storytelling", "Editing"],
    avatarUrl: "/avatars/creative-agent.svg",
    icon: Pencil,
  },
  {
    id: "7",
    name: "AI Tutor",
    description:
      "Provides educational assistance and explanations on various topics",
    capabilities: [
      "Topic Explanation",
      "Practice Problems",
      "Educational Resources",
    ],
    avatarUrl: "/avatars/tutor-agent.svg",
    icon: Brain,
  },
  {
    id: "8",
    name: "General Assistant",
    description: "A general-purpose assistant that can help with various tasks",
    capabilities: [
      "Task Management",
      "Information Lookup",
      "General Assistance",
    ],
    avatarUrl: "/avatars/general-agent.svg",
    icon: Bot,
  },
];
