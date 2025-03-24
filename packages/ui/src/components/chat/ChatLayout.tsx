import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Props for the ChatLayout component
 */
export type ChatLayoutProps = {
  /**
   * Sidebar content (conversations, agents)
   */
  sidebarContent: React.ReactNode;
  /**
   * Main content (chat messages)
   */
  mainContent: React.ReactNode;
  /**
   * Optional context panel content
   */
  contextContent?: React.ReactNode;
  /**
   * Whether to show the context panel
   */
  showContextPanel?: boolean;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * Chat layout component with a three-column design
 */
export function ChatLayout({
  sidebarContent,
  mainContent,
  contextContent,
  showContextPanel = true,
  className,
}: ChatLayoutProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full overflow-hidden bg-background-primary",
        className,
      )}
    >
      {/* Sidebar */}
      <div className="hidden w-64 flex-shrink-0 border-r border-border-default bg-background-secondary md:block">
        {sidebarContent}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">{mainContent}</div>

      {/* Context panel */}
      {showContextPanel && (
        <div className="hidden w-80 flex-shrink-0 border-l border-border-default bg-background-secondary xl:block">
          {contextContent}
        </div>
      )}
    </div>
  );
}
