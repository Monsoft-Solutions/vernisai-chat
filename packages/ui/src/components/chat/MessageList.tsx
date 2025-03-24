import * as React from "react";
import { cn } from "../../lib/utils";
import { MessageItem } from "./MessageItem";
import type { Message } from "./types";

/**
 * Props for the MessageSkeleton component
 */
export type MessageSkeletonProps = {
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * MessageSkeleton component for showing loading state
 */
export function MessageSkeleton({ className }: MessageSkeletonProps) {
  return (
    <div
      className={cn(
        "flex animate-pulse py-6 px-4 bg-background-secondary",
        className,
      )}
    >
      <div className="mr-4 h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
      <div className="flex-1">
        <div className="mb-2 h-4 w-24 rounded bg-gray-300"></div>
        <div className="space-y-2">
          <div className="h-3 w-full max-w-[400px] rounded bg-gray-300"></div>
          <div className="h-3 w-full max-w-[350px] rounded bg-gray-300"></div>
          <div className="h-3 w-full max-w-[300px] rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Props for the MessageList component
 */
export type MessageListProps = {
  /**
   * List of messages to display
   */
  messages: Message[];
  /**
   * Whether a message is currently being generated
   */
  isGenerating?: boolean;
  /**
   * Handler for message action clicks
   */
  onMessageAction?: (messageId: string, action: string) => void;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * MessageList component for displaying a conversation
 */
export function MessageList({
  messages,
  isGenerating,
  onMessageAction,
  className,
}: MessageListProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when generating
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  return (
    <div
      className={cn("flex flex-col divide-y divide-border-default", className)}
    >
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          id={message.id}
          content={message.content}
          sender={message.sender}
          timestamp={message.timestamp}
          status={message.status}
          toolUsage={message.toolUsage}
          onActionClick={(action) => onMessageAction?.(message.id, action)}
        />
      ))}

      {isGenerating && <MessageSkeleton />}

      <div ref={messagesEndRef} />
    </div>
  );
}
