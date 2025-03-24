import * as React from "react";
import { cn } from "../../lib/utils";
import { MessageItem } from "./MessageItem";
import type { Message } from "./types";

/**
 * Props for the ChatHistory component
 */
export type ChatHistoryProps = {
  /**
   * List of messages to display
   */
  messages: Message[];
  /**
   * Handler for message actions
   */
  onMessageAction?: (messageId: string, action: string) => void;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * ChatHistory component for displaying the message history
 */
export function ChatHistory({
  messages,
  onMessageAction,
  className,
}: ChatHistoryProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={cn("flex flex-col p-4", className)}>
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-center text-text-tertiary">
            No messages yet. Start a conversation!
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            id={message.id}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            status={message.status}
            toolUsage={message.toolUsage}
            actions={["copy", "regenerate"]}
            onActionClick={(action) => {
              if (onMessageAction) {
                onMessageAction(message.id, action);
              }
            }}
            className="mb-4 last:mb-0"
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
