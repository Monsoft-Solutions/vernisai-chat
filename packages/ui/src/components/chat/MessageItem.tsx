import * as React from "react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
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
        "flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity",
        className,
      )}
    >
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onActionClick?.(action)}
          className="text-xs text-text-tertiary hover:text-text-secondary"
        >
          {action.charAt(0).toUpperCase() + action.slice(1)}
        </button>
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
  return (
    <div
      className={cn(
        "mt-2 rounded-md border border-border-default bg-background-secondary p-2",
        className,
      )}
    >
      <div className="text-xs font-semibold text-text-secondary">
        {toolUsage.toolName}
      </div>
      <div className="mt-1 text-xs">
        <div className="text-text-tertiary">Input:</div>
        <pre className="mt-1 overflow-x-auto rounded bg-background-tertiary p-2 text-text-secondary">
          {JSON.stringify(toolUsage.toolInput, null, 2)}
        </pre>
      </div>
      <div className="mt-2 text-xs">
        <div className="text-text-tertiary">Output:</div>
        <pre className="mt-1 overflow-x-auto rounded bg-background-tertiary p-2 text-text-secondary">
          {JSON.stringify(toolUsage.toolOutput, null, 2)}
        </pre>
      </div>
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
        "group flex py-6 px-4",
        sender === "user" ? "bg-background-primary" : "bg-background-secondary",
        className,
      )}
    >
      <div className="mr-4 flex-shrink-0">
        <Avatar>
          {sender === "user" ? (
            <AvatarFallback>U</AvatarFallback>
          ) : (
            <AvatarFallback>AI</AvatarFallback>
          )}
        </Avatar>
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="text-sm font-medium text-text-primary">
            {sender === "user"
              ? "You"
              : sender === "assistant"
                ? "Assistant"
                : "System"}
          </div>
          <div className="flex space-x-4">
            <div className="text-xs text-text-tertiary">
              {timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <MessageActions actions={actions} onActionClick={onActionClick} />
          </div>
        </div>
        <div className="mt-2 prose prose-sm max-w-none text-text-primary">
          {content}
        </div>

        {/* Tool usage */}
        {toolUsage && toolUsage.length > 0 && (
          <div className="mt-4 space-y-2">
            {toolUsage.map((tool, index) => (
              <ToolUsageItem key={index} toolUsage={tool} />
            ))}
          </div>
        )}

        {/* Status indicator */}
        {status && status !== "sent" && (
          <div className="mt-2 text-xs text-text-tertiary">
            {status === "sending"
              ? "Sending..."
              : status === "error"
                ? "Error sending message"
                : status === "generating"
                  ? "Generating response..."
                  : null}
          </div>
        )}
      </div>
    </div>
  );
}
