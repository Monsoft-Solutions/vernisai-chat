import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChatPage, type ChatSession } from "@vernisai/ui";
import { chatClient } from "../../utils/trpc-chat";

export const Route = createFileRoute("/chat/$id")({
  component: ChatSessionRoute,
});

function ChatSessionRoute() {
  const { id } = Route.useParams();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch sessions and tools using tRPC
  const sessionsQuery = chatClient.chat.getSessions.useQuery();
  const toolsQuery = chatClient.chat.getTools.useQuery();
  const sessionQuery = chatClient.chat.getSessionById.useQuery({ id });

  // Set loading state based on queries
  useEffect(() => {
    if (
      sessionsQuery.isLoading ||
      toolsQuery.isLoading ||
      sessionQuery.isLoading
    ) {
      setLoading(true);
    } else {
      setSession(sessionQuery.data || null);
      setLoading(false);
    }
  }, [
    sessionsQuery.isLoading,
    toolsQuery.isLoading,
    sessionQuery.isLoading,
    sessionQuery.data,
  ]);

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
        sessions={sessionsQuery.data || []}
        currentSessionId={id}
        tools={toolsQuery.data || []}
        onNewChat={() => {
          console.log("New chat requested");
        }}
        onSelectSession={(sessionId) => {
          console.log("Selected session:", sessionId);
        }}
        onSendMessage={(message) => {
          console.log("Message sent:", message);
          // Example of how to use the mutation when ready:
          // chatClient.chat.sendMessage.mutate({
          //   sessionId: id,
          //   content: message,
          // });
        }}
      />
    </div>
  );
}
