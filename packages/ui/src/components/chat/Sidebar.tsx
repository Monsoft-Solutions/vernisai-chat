import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import type { ChatSession } from "./types";

/**
 * Props for the Sidebar component
 */
export type SidebarProps = {
  /**
   * List of available chat sessions
   */
  sessions: ChatSession[];
  /**
   * Current session ID
   */
  currentSessionId?: string;
  /**
   * Handler for creating a new chat
   */
  onNewChat?: () => void;
  /**
   * Handler for selecting a session
   */
  onSelectSession?: (sessionId: string) => void;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * Sidebar component for navigation
 */
export function Sidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  className,
}: SidebarProps) {
  const sessionsRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={cn("flex flex-col bg-background-secondary p-4", className)}>
      <div className="mb-6">
        <Button
          onClick={onNewChat}
          className="w-full justify-start"
          variant="outline"
        >
          <span className="mr-2">+</span>
          New Chat
        </Button>
      </div>

      <div className="space-y-1">
        <h3 className="px-2 text-xs font-semibold text-text-tertiary">
          Recent chats
        </h3>
        <div className="mt-2" ref={sessionsRef}>
          {sessions.length === 0 ? (
            <p className="px-2 text-sm text-text-tertiary">
              No conversations yet
            </p>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession?.(session.id)}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left text-sm",
                  session.id === currentSessionId
                    ? "bg-background-tertiary font-medium text-text-primary"
                    : "text-text-secondary hover:bg-background-tertiary/50",
                )}
              >
                {session.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
