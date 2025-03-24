import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type TestInterfaceProps = {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isRunning: boolean;
  onStopTest: () => void;
  onClearConversation: () => void;
};

export const TestInterface: React.FC<TestInterfaceProps> = ({
  messages,
  onSendMessage,
  isRunning,
  onStopTest,
  onClearConversation,
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="test-agent">Test Your Agent</Label>
      <div className="border rounded-md overflow-hidden">
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/20">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              Start a conversation to test your agent.
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
          <div className="flex gap-2">
            <Textarea
              id="test-agent"
              placeholder="Type a message to test your agent..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[80px] flex-grow"
              disabled={isRunning}
            />
            <div className="flex flex-col justify-end gap-2">
              {isRunning ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onStopTest}
                >
                  Stop
                </Button>
              ) : (
                <Button type="submit" disabled={!input.trim()}>
                  Send
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClearConversation}
                disabled={messages.length === 0}
              >
                Clear
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

type MessageBubbleProps = {
  message: ChatMessage;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg p-3 max-w-[85%] ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={`text-xs mt-1 ${isUser ? "text-primary-foreground/70" : "text-secondary-foreground/70"}`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
