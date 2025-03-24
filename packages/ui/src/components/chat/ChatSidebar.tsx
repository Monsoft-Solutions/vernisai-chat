import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import type { Conversation, Agent } from "./types";

/**
 * Props for the ConversationItem component
 */
export type ConversationItemProps = {
  /**
   * Conversation data
   */
  conversation: Conversation;
  /**
   * Whether the conversation is selected
   */
  isSelected?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * ConversationItem component for displaying individual conversations
 */
export function ConversationItem({
  conversation,
  isSelected,
  onClick,
  className,
}: ConversationItemProps) {
  return (
    <div
      className={cn(
        "cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-background-tertiary",
        isSelected && "bg-background-tertiary",
        className,
      )}
      onClick={onClick}
    >
      <div className="font-medium text-text-primary truncate">
        {conversation.title}
      </div>
      <div className="text-xs text-text-tertiary">
        {new Date(conversation.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}

/**
 * Props for the AgentItem component
 */
export type AgentItemProps = {
  /**
   * Agent data
   */
  agent: Agent;
  /**
   * Whether the agent is selected
   */
  isSelected?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * AgentItem component for displaying individual agents
 */
export function AgentItem({
  agent,
  isSelected,
  onClick,
  className,
}: AgentItemProps) {
  return (
    <div
      className={cn(
        "cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-background-tertiary",
        isSelected && "bg-background-tertiary",
        className,
      )}
      onClick={onClick}
    >
      <div className="font-medium text-text-primary">{agent.name}</div>
    </div>
  );
}

/**
 * Props for the ChatSidebar component
 */
export type ChatSidebarProps = {
  /**
   * List of conversations
   */
  conversations: Conversation[];
  /**
   * List of agents
   */
  agents: Agent[];
  /**
   * ID of the selected conversation
   */
  selectedConversationId?: string;
  /**
   * Handler for selecting a conversation
   */
  onSelectConversation?: (conversationId: string) => void;
  /**
   * Handler for selecting an agent
   */
  onSelectAgent?: (agentId: string) => void;
  /**
   * Handler for creating a new conversation
   */
  onNewChat?: () => void;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * ChatSidebar component for navigation between conversations and agents
 */
export function ChatSidebar({
  conversations,
  agents,
  selectedConversationId,
  onSelectConversation,
  onSelectAgent,
  onNewChat,
  className,
}: ChatSidebarProps) {
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={sidebarRef} className={cn("flex h-full flex-col", className)}>
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start"
          variant="outline"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-2">
        <div className="mb-2">
          <h2 className="px-3 text-xs font-semibold uppercase text-text-tertiary">
            Conversations
          </h2>
          <div className="mt-2 space-y-1">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation?.(conversation.id)}
              />
            ))}
            {conversations.length === 0 && (
              <div className="px-3 py-2 text-sm text-text-secondary">
                No conversations yet
              </div>
            )}
          </div>
        </div>

        <div className="mb-2">
          <h2 className="px-3 text-xs font-semibold uppercase text-text-tertiary">
            Agents
          </h2>
          <div className="mt-2 space-y-1">
            {agents.map((agent) => (
              <AgentItem
                key={agent.id}
                agent={agent}
                onClick={() => onSelectAgent?.(agent.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
