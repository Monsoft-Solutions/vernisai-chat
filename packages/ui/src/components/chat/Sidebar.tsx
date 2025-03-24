import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  PlusIcon,
  SearchIcon,
  ClockIcon,
  MessageSquareIcon,
  ArchiveIcon,
  FolderIcon,
} from "lucide-react";
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
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  // Filter sessions based on search query
  const filteredSessions = React.useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    return sessions.filter((session) =>
      session.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [sessions, searchQuery]);

  // Sort sessions with most recent first
  const sortedSessions = React.useMemo(() => {
    return [...filteredSessions].sort((a, b) => {
      const dateA = a.updatedAt || a.createdAt || new Date();
      const dateB = b.updatedAt || b.createdAt || new Date();
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredSessions]);

  // Group sessions by date (today, yesterday, older)
  const groupedSessions = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const groups: Record<string, ChatSession[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    sortedSessions.forEach((session) => {
      const sessionDate = session.updatedAt || session.createdAt || new Date();
      if (sessionDate >= today) {
        groups.today.push(session);
      } else if (sessionDate >= yesterday) {
        groups.yesterday.push(session);
      } else if (sessionDate >= oneWeekAgo) {
        groups.thisWeek.push(session);
      } else {
        groups.older.push(session);
      }
    });

    return groups;
  }, [sortedSessions]);

  return (
    <div
      className={cn("flex h-full flex-col bg-background-secondary", className)}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border-default">
        <Button
          onClick={onNewChat}
          className="w-full h-10 justify-center gap-2 bg-primary hover:bg-primary/90"
          variant="default"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border-default">
        <div
          className={cn(
            "flex items-center px-3 py-1 rounded-md border transition-all",
            isSearchFocused
              ? "border-primary/30 ring-1 ring-primary/20 bg-background-primary"
              : "border-border-default bg-background-tertiary/30",
          )}
        >
          <SearchIcon className="h-4 w-4 text-text-tertiary mr-2" />
          <Input
            type="text"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="border-0 bg-transparent p-0 text-sm h-8 focus-visible:ring-0 placeholder:text-text-tertiary"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-1 hover:bg-background-tertiary"
              onClick={() => setSearchQuery("")}
            >
              <span className="text-xs text-text-tertiary">×</span>
            </Button>
          )}
        </div>
      </div>

      {/* Quick nav */}
      <div className="p-3 gap-1 flex border-b border-border-default">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 gap-1 text-xs justify-start"
        >
          <ClockIcon className="h-3 w-3" />
          <span>Recent</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 gap-1 text-xs justify-start"
        >
          <FolderIcon className="h-3 w-3" />
          <span>Folders</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 gap-1 text-xs justify-start"
        >
          <ArchiveIcon className="h-3 w-3" />
          <span>Archived</span>
        </Button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto p-1" ref={sessionsRef}>
        {sortedSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 p-4 text-center">
            {searchQuery ? (
              <>
                <p className="text-sm text-text-secondary mb-2">
                  No conversations found
                </p>
                <p className="text-xs text-text-tertiary">
                  Try a different search term
                </p>
              </>
            ) : (
              <>
                <MessageSquareIcon className="h-8 w-8 text-text-tertiary mb-2 opacity-50" />
                <p className="text-sm text-text-secondary mb-1">
                  No conversations yet
                </p>
                <p className="text-xs text-text-tertiary">
                  Start a new chat to get started
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Today's sessions */}
            {groupedSessions.today.length > 0 && (
              <div>
                <h3 className="px-3 py-1 text-xs font-medium text-text-tertiary">
                  Today
                </h3>
                <div className="space-y-1">
                  {groupedSessions.today.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === currentSessionId}
                      onClick={() => onSelectSession?.(session.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday's sessions */}
            {groupedSessions.yesterday.length > 0 && (
              <div>
                <h3 className="px-3 py-1 text-xs font-medium text-text-tertiary">
                  Yesterday
                </h3>
                <div className="space-y-1">
                  {groupedSessions.yesterday.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === currentSessionId}
                      onClick={() => onSelectSession?.(session.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* This week's sessions */}
            {groupedSessions.thisWeek.length > 0 && (
              <div>
                <h3 className="px-3 py-1 text-xs font-medium text-text-tertiary">
                  This Week
                </h3>
                <div className="space-y-1">
                  {groupedSessions.thisWeek.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === currentSessionId}
                      onClick={() => onSelectSession?.(session.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Older sessions */}
            {groupedSessions.older.length > 0 && (
              <div>
                <h3 className="px-3 py-1 text-xs font-medium text-text-tertiary">
                  Older
                </h3>
                <div className="space-y-1">
                  {groupedSessions.older.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === currentSessionId}
                      onClick={() => onSelectSession?.(session.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border-default">
        <div className="text-xs text-text-tertiary text-center">
          <p>
            Model: <span className="text-text-secondary">GPT-4</span>
          </p>
        </div>
      </div>
    </div>
  );
}

type SessionItemProps = {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
};

function SessionItem({ session, isActive, onClick }: SessionItemProps) {
  const date = session.updatedAt || session.createdAt;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-md px-3 py-2 text-left flex justify-between items-center group transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-text-secondary hover:bg-background-tertiary/50",
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <MessageSquareIcon
            className={cn(
              "h-3.5 w-3.5 mr-2",
              isActive ? "text-primary-foreground" : "text-text-tertiary",
            )}
          />
          <span className="truncate text-sm">{session.name}</span>
        </div>
        {session.agentName && (
          <div
            className={cn(
              "text-xs mt-0.5 truncate pl-5",
              isActive ? "text-primary-foreground/70" : "text-text-tertiary",
            )}
          >
            {session.agentName}
          </div>
        )}
      </div>
      {date && (
        <div
          className={cn(
            "text-xs opacity-70",
            isActive ? "text-primary-foreground" : "text-text-tertiary",
          )}
        >
          {formatDate(date)}
        </div>
      )}
    </button>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date >= today) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (date >= yesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}
