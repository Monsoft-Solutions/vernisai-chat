import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Share2Icon, InfoIcon, MenuIcon, XIcon } from "lucide-react";
import { Badge } from "../ui/badge";

/**
 * Props for the ChatHeader component
 */
export type ChatHeaderProps = {
  /**
   * The agent name
   */
  agentName: string;
  /**
   * Optional status of the agent
   */
  status?: string;
  /**
   * Optional badge for the agent (e.g. "New", "Beta")
   */
  badge?: string;
  /**
   * Optional tooltip text for the information button
   */
  infoTooltip?: string;
  /**
   * Handler for info button click
   */
  onInfoClick?: () => void;
  /**
   * Handler for share button click
   */
  onShareClick?: () => void;
  /**
   * Optional class name for custom styling
   */
  className?: string;
  /**
   * Whether the sidebar is visible (for responsive design)
   */
  sidebarVisible?: boolean;
  /**
   * Handler for toggling sidebar visibility
   */
  onToggleSidebar?: () => void;
  /**
   * Whether the context panel is visible (for responsive design)
   */
  contextVisible?: boolean;
  /**
   * Handler for toggling context panel visibility
   */
  onToggleContext?: () => void;
};

/**
 * ChatHeader component for displaying agent information and actions at the top of chat
 */
export function ChatHeader({
  agentName,
  status,
  badge,
  infoTooltip,
  onInfoClick,
  onShareClick,
  className,
  sidebarVisible,
  onToggleSidebar,
  contextVisible,
  onToggleContext,
}: ChatHeaderProps) {
  const [windowWidth, setWindowWidth] = React.useState(
    globalThis.innerWidth || 0,
  );
  const isMobile = windowWidth < 768;

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

  return (
    <div
      className={cn(
        "bg-background-primary border-b border-border-default flex justify-between items-center h-14 px-3 sm:px-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-text-tertiary hover:text-text-secondary md:hidden"
            onClick={onToggleSidebar}
            title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarVisible ? (
              <XIcon className="h-4 w-4" />
            ) : (
              <MenuIcon className="h-4 w-4" />
            )}
          </Button>
        )}
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-base text-text-primary line-clamp-1">
            {agentName}
          </h2>
          {badge && (
            <Badge
              variant="secondary"
              className="h-5 text-2xs font-medium uppercase"
            >
              {badge}
            </Badge>
          )}
        </div>
        {status && (
          <div className="text-xs text-text-tertiary hidden sm:block">
            {status}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {onShareClick && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 text-text-tertiary hover:text-text-secondary",
              isMobile && "hidden sm:flex",
            )}
            onClick={onShareClick}
            title="Share conversation"
          >
            <Share2Icon className="h-4 w-4" />
          </Button>
        )}

        {onInfoClick && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 text-text-tertiary hover:text-text-secondary",
              isMobile && "hidden sm:flex",
            )}
            onClick={onInfoClick}
            title={infoTooltip || "Agent information"}
          >
            <InfoIcon className="h-4 w-4" />
          </Button>
        )}

        {onToggleContext && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-text-tertiary hover:text-text-secondary sm:ml-1"
            onClick={onToggleContext}
            title={contextVisible ? "Hide context panel" : "Show context panel"}
          >
            {contextVisible ? (
              <XIcon className="h-4 w-4" />
            ) : (
              <InfoIcon className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Mobile action button */}
        {isMobile && (onShareClick || onInfoClick) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-text-tertiary hover:text-text-secondary sm:hidden"
            onClick={onShareClick || onInfoClick}
            title="Actions"
          >
            <MenuIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
