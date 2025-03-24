import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ChatPage,
  type ChatSession,
  type Tool,
  type MessageSender,
} from "@vernisai/ui";

export const Route = createFileRoute("/chat/$id")({
  component: ChatSessionRoute,
});

function ChatSessionRoute() {
  const { id } = Route.useParams();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock tools data
  const mockTools: Tool[] = [
    {
      id: "tool1",
      name: "Web Search",
      description: "Search the web for information",
      icon: "search",
    },
    {
      id: "tool2",
      name: "Code Interpreter",
      description: "Run and analyze code",
      icon: "code",
    },
    {
      id: "tool3",
      name: "Knowledge Base",
      description: "Access internal knowledge base",
      icon: "database",
    },
  ];

  // Mock sessions data (in real app, this would come from an API)
  const mockSessions: ChatSession[] = [
    {
      id: "1",
      name: "General conversation",
      agentName: "VernisAI Assistant",
      agentDescription:
        "A helpful AI assistant that can answer questions and perform tasks.",
      messages: [
        {
          id: "msg1",
          content: "Hello! How can I help you today?",
          sender: "assistant" as MessageSender,
          timestamp: new Date(Date.now() - 3600000),
          status: "sent",
        },
        {
          id: "msg2",
          content: "I'm looking for information about machine learning.",
          sender: "user" as MessageSender,
          timestamp: new Date(Date.now() - 3000000),
          status: "sent",
        },
        {
          id: "msg3",
          content:
            "Machine learning is a field of inquiry devoted to understanding and building methods that 'learn', that is, methods that leverage data to improve performance on some set of tasks. It is seen as a part of artificial intelligence.",
          sender: "assistant" as MessageSender,
          timestamp: new Date(Date.now() - 2400000),
          status: "sent",
        },
      ],
    },
    {
      id: "2",
      name: "Code assistance",
      agentName: "VernisAI Code Helper",
      agentDescription:
        "An AI assistant specialized in helping with coding tasks and debugging.",
      messages: [
        {
          id: "msg1",
          content:
            "I can help you with programming questions and code reviews. What do you need help with?",
          sender: "assistant" as MessageSender,
          timestamp: new Date(Date.now() - 86400000),
          status: "sent",
        },
      ],
    },
  ];

  // Simulate fetching the session data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const foundSession = mockSessions.find((s) => s.id === id);
      setSession(foundSession || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading chat session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center">
        Chat session not found
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)]">
      <ChatPage
        sessions={mockSessions}
        currentSessionId={id}
        tools={mockTools}
        onNewChat={() => {
          console.log("New chat requested");
        }}
        onSelectSession={(sessionId) => {
          console.log("Selected session:", sessionId);
        }}
        onSendMessage={(message) => {
          console.log("Message sent:", message);
        }}
      />
    </div>
  );
}
