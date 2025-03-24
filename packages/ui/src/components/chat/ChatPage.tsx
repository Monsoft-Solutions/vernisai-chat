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
  XIcon,
} from "lucide-react";
import type { ChatSession, Tool } from "./types";

/**
 * Props for the PageHeader component
 */
type PageHeaderProps = {
  /**
   * Title of the conversation
   */
  title?: string;
  /**
   * Name of the agent being used
   */
  agentName?: string;
  /**
   * Handler for toggling the sidebar
   */
  onToggleSidebar?: () => void;
  /**
   * Handler for toggling the context panel
   */
  onToggleContext?: () => void;
  /**
   * Whether the sidebar is currently shown
   */
  sidebarVisible?: boolean;
  /**
   * Whether the context panel is currently shown
   */
  contextVisible?: boolean;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * PageHeader component for navigation and context
 */
function PageHeader({
  title = "New Conversation",
  agentName,
  onToggleSidebar,
  onToggleContext,
  sidebarVisible,
  contextVisible,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-3 sm:px-4 py-2 h-14 border-b border-border-default bg-background-primary",
        className,
      )}
    >
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-2 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
          aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
          title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
        >
          {sidebarVisible ? (
            <XIcon className="h-4 w-4" />
          ) : (
            <MenuIcon className="h-4 w-4" />
          )}
        </Button>
        <div className="flex items-center min-w-0">
          {agentName && (
            <Avatar className="h-7 w-7 mr-2 border border-border-default hidden sm:flex">
              <AvatarFallback className="text-xs bg-secondary/10 text-secondary">
                AI
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-medium truncate max-w-[160px] sm:max-w-[200px] md:max-w-md">
              {title}
            </h1>
            {agentName && (
              <span className="text-xs text-text-tertiary truncate max-w-[160px] sm:max-w-[200px] md:max-w-md">
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
          className="h-8 w-8 text-text-tertiary hidden sm:flex"
          title="Share conversation"
        >
          <Share2Icon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-tertiary hidden sm:flex"
          title="Conversation info"
        >
          <InfoIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-tertiary"
          onClick={onToggleContext}
          aria-label={
            contextVisible ? "Hide context panel" : "Show context panel"
          }
          title={contextVisible ? "Hide context panel" : "Show context panel"}
        >
          {contextVisible ? (
            <XIcon className="h-4 w-4" />
          ) : (
            <SlidersHorizontalIcon className="h-4 w-4" />
          )}
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
  // State for sidebar and context panel visibility
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showContext, setShowContext] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(
    globalThis.innerWidth || 0,
  );

  // Current chat session
  const currentSession = React.useMemo(() => {
    return sessions.find((session) => session.id === currentSessionId);
  }, [sessions, currentSessionId]);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Automatically adjust sidebar and context visibility based on screen size
  React.useEffect(() => {
    if (windowWidth >= 1024) {
      // Desktop
      setShowSidebar(true);
      setShowContext(true);
    } else if (windowWidth >= 768) {
      // Tablet
      setShowSidebar(true);
      setShowContext(false);
    } else {
      // Mobile
      setShowSidebar(false);
      setShowContext(false);
    }
  }, [windowWidth]);

  // Toggle sidebar
  const toggleSidebar = React.useCallback(() => {
    setShowSidebar((prev) => !prev);
    // Close context panel on mobile when opening sidebar
    if (windowWidth < 768 && !showSidebar) {
      setShowContext(false);
    }
  }, [showSidebar, windowWidth]);

  // Toggle context panel
  const toggleContext = React.useCallback(() => {
    setShowContext((prev) => !prev);
    // Close sidebar on mobile when opening context panel
    if (windowWidth < 768 && !showContext) {
      setShowSidebar(false);
    }
  }, [showContext, windowWidth]);

  return (
    <div className={cn("flex h-full bg-background-primary", className)}>
      {/* Sidebar */}
      <div
        className={cn(
          "w-72 md:w-80 border-r border-border-default fixed inset-y-0 z-30 bg-background-secondary transition-transform duration-300 ease-in-out",
          windowWidth >= 1024
            ? "lg:relative lg:translate-x-0"
            : showSidebar
              ? "translate-x-0"
              : "-translate-x-full",
        )}
      >
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewChat={onNewChat}
          onSelectSession={(id) => {
            onSelectSession?.(id);
            // Auto-close sidebar on mobile after selection
            if (windowWidth < 768) {
              setShowSidebar(false);
            }
          }}
          className="h-full w-full"
        />
      </div>

      {/* Main chat area */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden relative",
          windowWidth >= 1024
            ? showSidebar && showContext
              ? "lg:mx-0"
              : showSidebar || showContext
                ? "lg:mx-0"
                : "lg:mx-auto lg:max-w-4xl"
            : "mx-0",
        )}
      >
        {/* Chat header */}
        <PageHeader
          title={currentSession?.name || "New Conversation"}
          agentName={currentSession?.agentName}
          onToggleSidebar={toggleSidebar}
          onToggleContext={toggleContext}
          sidebarVisible={showSidebar}
          contextVisible={showContext}
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
          "w-72 lg:w-80 border-l border-border-default fixed right-0 inset-y-0 z-30 bg-background-secondary transition-transform duration-300 ease-in-out",
          windowWidth >= 1024
            ? "lg:relative lg:translate-x-0"
            : showContext
              ? "translate-x-0"
              : "translate-x-full",
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
      {(showSidebar || showContext) && windowWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/30 z-20 transition-opacity duration-300 ease-in-out"
          onClick={() => {
            setShowSidebar(false);
            setShowContext(false);
          }}
        />
      )}
    </div>
  );
}
