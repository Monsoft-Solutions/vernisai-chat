import * as React from "react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { MessageSender, MessageStatus, ToolUsage } from "./types";

/**
 * Props for the MessageActions component
 */
export type MessageActionsProps = {
  /**
   * List of available actions
   */
  actions?: string[];
  /**
   * Handler for action clicks
   */
  onActionClick?: (action: string) => void;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * MessageActions component for message-specific actions
 */
export function MessageActions({
  actions = ["copy", "edit", "regenerate"],
  onActionClick,
  className,
}: MessageActionsProps) {
  return (
    <div
      className={cn(
        "flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        className,
      )}
    >
      {actions.map((action) => (
        <Button
          key={action}
          onClick={() => onActionClick?.(action)}
          className="h-7 px-2 text-xs"
          variant="ghost"
          size="sm"
        >
          {action === "copy"
            ? "Copy"
            : action === "edit"
              ? "Edit"
              : action === "regenerate"
                ? "Regenerate"
                : action.charAt(0).toUpperCase() + action.slice(1)}
        </Button>
      ))}
    </div>
  );
}

/**
 * Props for the ToolUsageItem component
 */
export type ToolUsageItemProps = {
  /**
   * Tool usage data
   */
  toolUsage: ToolUsage;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * ToolUsageItem component for displaying tool usage information
 */
export function ToolUsageItem({ toolUsage, className }: ToolUsageItemProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        "mt-2 rounded-md border border-border-default bg-background-secondary p-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-medium">
            {toolUsage.toolName}
          </Badge>
          <span className="text-xs text-text-tertiary">Tool</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Details" : "Show Details"}
        </Button>
      </div>

      {expanded && (
        <>
          <div className="mt-2 text-xs">
            <div className="flex items-center text-text-tertiary mb-1">
              <div className="w-16">Input:</div>
              <div className="h-px flex-1 bg-border-default mx-2"></div>
            </div>
            <pre className="mt-1 overflow-x-auto rounded bg-background-tertiary p-2 text-text-secondary text-xs">
              {JSON.stringify(toolUsage.toolInput, null, 2)}
            </pre>
          </div>
          <div className="mt-3 text-xs">
            <div className="flex items-center text-text-tertiary mb-1">
              <div className="w-16">Output:</div>
              <div className="h-px flex-1 bg-border-default mx-2"></div>
            </div>
            <pre className="mt-1 overflow-x-auto rounded bg-background-tertiary p-2 text-text-secondary text-xs">
              {JSON.stringify(toolUsage.toolOutput, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Props for the MessageItem component
 */
export type MessageItemProps = {
  /**
   * Message ID
   */
  id: string;
  /**
   * Message content
   */
  content: React.ReactNode;
  /**
   * Message sender
   */
  sender: MessageSender;
  /**
   * Message timestamp
   */
  timestamp: Date;
  /**
   * Message status
   */
  status?: MessageStatus;
  /**
   * Tool usage information
   */
  toolUsage?: ToolUsage[];
  /**
   * Available actions for this message
   */
  actions?: string[];
  /**
   * Handler for action clicks
   */
  onActionClick?: (action: string) => void;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * MessageItem component for displaying chat messages
 */
export function MessageItem({
  content,
  sender,
  timestamp,
  status,
  toolUsage,
  actions,
  onActionClick,
  className,
}: MessageItemProps) {
  return (
    <div
      className={cn(
        "group flex py-6 px-6 transition-colors",
        sender === "user"
          ? "bg-background-primary hover:bg-background-primary/90"
          : "bg-background-secondary hover:bg-background-secondary/95",
        className,
      )}
    >
      <div className="mr-4 flex-shrink-0 pt-1">
        <Avatar className="border border-border-default">
          {sender === "user" ? (
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              U
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-secondary/10 text-secondary font-medium">
              AI
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      <div className="flex-1 max-w-4xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-text-primary">
              {sender === "user"
                ? "You"
                : sender === "assistant"
                  ? "Assistant"
                  : "System"}
            </div>
            <div className="text-xs text-text-tertiary">
              {timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            {status === "error" && (
              <Badge variant="destructive" className="text-xs">
                Error
              </Badge>
            )}
          </div>
          <MessageActions actions={actions} onActionClick={onActionClick} />
        </div>
        <div className="mt-2 prose prose-sm max-w-none text-text-primary">
          {content}
        </div>

        {/* Tool usage */}
        {toolUsage && toolUsage.length > 0 && (
          <div className="mt-4 space-y-3">
            {toolUsage.map((tool, index) => (
              <ToolUsageItem key={index} toolUsage={tool} />
            ))}
          </div>
        )}

        {/* Status indicator */}
        {status && status !== "sent" && (
          <div className="mt-3 text-xs flex items-center gap-2">
            {status === "sending" && (
              <>
                <div className="animate-pulse w-1.5 h-1.5 rounded-full bg-text-tertiary"></div>
                <span className="text-text-tertiary">Sending...</span>
              </>
            )}
            {status === "error" && (
              <span className="text-destructive">Error sending message</span>
            )}
            {status === "generating" && (
              <div className="flex items-center gap-2 text-text-tertiary">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <span>Generating response...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
