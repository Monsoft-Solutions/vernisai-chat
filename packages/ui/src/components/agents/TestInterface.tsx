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
      <div className="flex items-center justify-between">
        <Label
          htmlFor="test-agent"
          className="text-gray-700 flex items-center gap-2"
        >
          Test Your Agent
          <span className="text-xs text-muted-foreground">
            (Try prompting your agent to see how it responds)
          </span>
        </Label>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearConversation}
            className="text-xs h-8"
          >
            Clear conversation
          </Button>
        )}
      </div>
      <div className="border rounded-md overflow-hidden shadow-sm">
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/20">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
              <div className="text-4xl">💬</div>
              <div className="text-muted-foreground text-sm max-w-md">
                Start a conversation to test your agent. Try asking questions
                related to the agent's purpose.
              </div>
              <div className="text-xs text-muted-foreground/70 bg-muted/20 p-2 rounded-md max-w-xs">
                Example: "Can you help me understand quantum computing?"
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {isRunning && (
            <div className="flex justify-start">
              <div className="bg-secondary text-secondary-foreground rounded-lg p-3 max-w-[85%] relative overflow-hidden">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-current animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-current animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
          <div className="flex gap-2">
            <Textarea
              id="test-agent"
              placeholder="Type a message to test your agent..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[80px] flex-grow resize-none"
              disabled={isRunning}
            />
            <div className="flex flex-col justify-end gap-2">
              {isRunning ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onStopTest}
                  className="w-20"
                >
                  Stop
                </Button>
              ) : (
                <Button type="submit" disabled={!input.trim()} className="w-20">
                  Send
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="text-xs text-muted-foreground p-2">
        Note: This is a simulation. In production, your agent will respond based
        on its model and instructions.
      </div>
    </div>
  );
};

type MessageBubbleProps = {
  message: ChatMessage;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`rounded-lg p-3 max-w-[85%] ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {!isUser && (
          <div className="font-medium text-xs opacity-70 mb-1">Assistant</div>
        )}
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={`text-xs mt-1 opacity-0 group-hover:opacity-70 transition-opacity ${
            isUser ? "text-primary-foreground" : "text-secondary-foreground"
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};
