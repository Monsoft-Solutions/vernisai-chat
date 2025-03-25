import { createFileRoute } from "@tanstack/react-router";
import { ChatPage } from "@vernisai/ui";
import { useState, useEffect } from "react";
import { chatClient } from "../../utils/trpc-chat";

export const Route = createFileRoute("/chat/")({
  component: ChatRoute,
});

function ChatRoute() {
  const [isLoading, setIsLoading] = useState(true);

  // Fetch chat sessions and tools using tRPC
  const sessionsQuery = chatClient.chat.getSessions.useQuery();
  const toolsQuery = chatClient.chat.getTools.useQuery();

  // Set loading state based on queries
  useEffect(() => {
    if (sessionsQuery.isLoading || toolsQuery.isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [sessionsQuery.isLoading, toolsQuery.isLoading]);

  // Handle loading state
  if (isLoading || sessionsQuery.isError || toolsQuery.isError) {
    return (
      <div className="flex h-full items-center justify-center">
        {sessionsQuery.isError || toolsQuery.isError
          ? "Error loading chat data"
          : "Loading chat data..."}
      </div>
    );
  }

  // If we have sessions and tools, render the chat page
  const sessions = sessionsQuery.data || [];
  const tools = toolsQuery.data || [];

  return (
    <div className="h-[calc(100vh-120px)]">
      <ChatPage
        sessions={sessions}
        currentSessionId={sessions.length > 0 ? sessions[0].id : ""}
        tools={tools}
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
