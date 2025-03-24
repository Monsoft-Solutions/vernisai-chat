import * as React from "react";
import { cn } from "../../lib/utils";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";
import { ContextPanel } from "./ContextPanel";
import { Sidebar } from "./Sidebar";
import type { ChatSession, Tool } from "./types";

/**
 * Props for the ChatPage component
 */
export type ChatPageProps = {
  /**
   * List of chat sessions
   */
  sessions?: ChatSession[];
  /**
   * Current session ID
   */
  currentSessionId?: string;
  /**
   * List of available tools
   */
  tools?: Tool[];
  /**
   * Handler for creating a new chat
   */
  onNewChat?: () => void;
  /**
   * Handler for selecting a chat session
   */
  onSelectSession?: (sessionId: string) => void;
  /**
   * Handler for sending a message
   */
  onSendMessage?: (message: string) => void;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * ChatPage component - main layout for the chat interface
 */
export function ChatPage({
  sessions = [],
  currentSessionId,
  tools = [],
  onNewChat,
  onSelectSession,
  onSendMessage,
  className,
}: ChatPageProps) {
  const currentSession = React.useMemo(() => {
    return sessions.find((session) => session.id === currentSessionId);
  }, [sessions, currentSessionId]);

  return (
    <div className={cn("flex h-full", className)}>
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={onNewChat}
        onSelectSession={onSelectSession}
        className="w-64 border-r border-border-default"
      />

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat history */}
        <ChatHistory
          messages={currentSession?.messages || []}
          className="flex-1 overflow-y-auto"
        />

        {/* Chat input */}
        <ChatInput
          placeholder="Message the assistant..."
          onSubmit={onSendMessage}
          disabled={!currentSessionId}
          className="border-t border-border-default p-4"
        />
      </div>

      {/* Context panel */}
      <ContextPanel
        agentName={currentSession?.agentName}
        agentDescription={currentSession?.agentDescription}
        tools={tools}
        className="w-80 border-l border-border-default"
      />
    </div>
  );
}
