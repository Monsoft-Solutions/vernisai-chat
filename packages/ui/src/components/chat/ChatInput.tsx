import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { SendIcon } from "lucide-react";

/**
 * Props for the ChatInput component
 */
export type ChatInputProps = {
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Handler for message submission
   */
  onSubmit?: (message: string) => void;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * ChatInput component for typing and sending messages
 */
export function ChatInput({
  placeholder = "Type a message...",
  onSubmit,
  disabled = false,
  className,
}: ChatInputProps) {
  const [message, setMessage] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = React.useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (message.trim() && onSubmit) {
        onSubmit(message);
        setMessage("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    },
    [message, onSubmit],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleTextareaChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);

      // Auto-resize the textarea
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    },
    [],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col space-y-2", className)}
    >
      <div className="relative flex items-end rounded-md border border-border-default bg-background-primary">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[60px] max-h-[200px] resize-none border-0 py-3 focus-visible:ring-0"
        />
        <div className="absolute bottom-2 right-2">
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={disabled || !message.trim()}
            className="h-8 w-8 rounded-full"
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}
