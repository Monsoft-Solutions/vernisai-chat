import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";
import { ContextPanel } from "./ContextPanel";
import { Sidebar } from "./Sidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  MenuIcon,
  MoreHorizontalIcon,
  SlidersHorizontalIcon,
  Share2Icon,
  InfoIcon,
  ArrowLeftIcon,
} from "lucide-react";
import type { ChatSession, Tool } from "./types";

/**
 * Props for the ChatHeader component
 */
type ChatHeaderProps = {
  title?: string;
  agentName?: string;
  onToggleSidebar?: () => void;
  onToggleContext?: () => void;
  className?: string;
};

/**
 * ChatHeader component for navigation and context
 */
function ChatHeader({
  title = "New Conversation",
  agentName,
  onToggleSidebar,
  onToggleContext,
  className,
}: ChatHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 py-2 h-14 border-b border-border-default bg-background-primary",
        className,
      )}
    >
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-2 md:hidden h-9 w-9"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-2 hidden md:flex h-9 w-9"
          aria-label="Back to chats"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          {agentName && (
            <Avatar className="h-7 w-7 mr-2 border border-border-default">
              <AvatarFallback className="text-xs bg-secondary/10 text-secondary">
                AI
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col">
            <h1 className="text-sm font-medium truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              {title}
            </h1>
            {agentName && (
              <span className="text-xs text-text-tertiary">
                Using {agentName}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-tertiary"
          title="Share conversation"
        >
          <Share2Icon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-tertiary"
          title="Conversation info"
        >
          <InfoIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-tertiary"
          onClick={onToggleContext}
          title="Toggle context panel"
        >
          <SlidersHorizontalIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-tertiary"
          title="More options"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

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
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showContext, setShowContext] = React.useState(true);

  const currentSession = React.useMemo(() => {
    return sessions.find((session) => session.id === currentSessionId);
  }, [sessions, currentSessionId]);

  // Toggle sidebar on mobile
  const toggleSidebar = React.useCallback(() => {
    setShowSidebar((prev) => !prev);
  }, []);

  // Toggle context panel
  const toggleContext = React.useCallback(() => {
    setShowContext((prev) => !prev);
  }, []);

  return (
    <div className={cn("flex h-full", className)}>
      {/* Sidebar */}
      <div
        className={cn(
          "w-64 md:w-80 border-r border-border-default fixed inset-y-0 z-20 bg-background-secondary transition-transform md:relative md:translate-x-0",
          showSidebar ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewChat={onNewChat}
          onSelectSession={onSelectSession}
          className="h-full w-full"
        />
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Chat header */}
        <ChatHeader
          title={currentSession?.name || "New Conversation"}
          agentName={currentSession?.agentName}
          onToggleSidebar={toggleSidebar}
          onToggleContext={toggleContext}
        />

        {/* Message history */}
        <ChatHistory
          messages={currentSession?.messages || []}
          className="flex-1 overflow-y-auto"
        />

        {/* Chat input */}
        <ChatInput
          placeholder="Message the assistant..."
          onSubmit={onSendMessage}
          disabled={!currentSessionId}
          maxLength={4000}
          className="border-t border-border-default"
        />
      </div>

      {/* Context panel */}
      <div
        className={cn(
          "w-80 lg:w-96 border-l border-border-default fixed right-0 inset-y-0 z-20 bg-background-secondary transition-transform lg:relative lg:translate-x-0",
          showContext ? "translate-x-0" : "translate-x-full",
        )}
      >
        <ContextPanel
          agentName={currentSession?.agentName}
          agentDescription={currentSession?.agentDescription}
          tools={tools}
          className="h-full w-full"
        />
      </div>

      {/* Backdrop for mobile sidebar/context panel */}
      {(showSidebar || showContext) && (
        <div
          className="fixed inset-0 bg-black/20 z-10 lg:hidden"
          onClick={() => {
            setShowSidebar(false);
            setShowContext(false);
          }}
        />
      )}
    </div>
  );
}
