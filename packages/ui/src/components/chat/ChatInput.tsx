import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { SendIcon, MicIcon, PaperclipIcon, PlusIcon } from "lucide-react";

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
   * Maximum character count (optional)
   */
  maxLength?: number;
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
  maxLength = 4000,
  className,
}: ChatInputProps) {
  const [message, setMessage] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(
    globalThis.innerWidth || 0,
  );

  const characterCount = message.length;
  const isNearLimit = maxLength && characterCount > maxLength * 0.9;
  const isMobile = windowWidth < 640;

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
      const value = e.target.value;
      if (maxLength && value.length > maxLength) {
        return;
      }
      setMessage(value);

      // Auto-resize the textarea
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    },
    [maxLength],
  );

  return (
    <div
      className={cn(
        "bg-background-primary transition-all",
        isFocused ? "shadow-md" : "shadow-sm",
        className,
      )}
    >
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div
            className={cn(
              "relative flex items-end rounded-md border bg-background-primary transition-all",
              isFocused
                ? "border-primary/30 ring-1 ring-primary/20"
                : "border-border-default",
              disabled && "opacity-60",
            )}
          >
            {/* Textarea */}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "min-h-[60px] max-h-[160px] sm:max-h-[200px] resize-none border-0 py-3 text-sm focus-visible:ring-0",
                isMobile ? "pl-3 pr-14" : "pl-4 pr-24",
              )}
            />

            {/* Character count */}
            {maxLength > 0 && !isMobile && (
              <div
                className={cn(
                  "absolute bottom-2 right-20 text-xs opacity-70",
                  isNearLimit ? "text-yellow-500" : "text-text-tertiary",
                )}
              >
                {characterCount}/{maxLength}
              </div>
            )}

            {/* Actions buttons */}
            <div
              className={cn(
                "absolute bottom-2 right-2 flex",
                isMobile ? "space-x-0.5" : "space-x-1",
              )}
            >
              {!isMobile && (
                <>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={disabled}
                    className="h-8 w-8 rounded-full text-text-tertiary hover:text-text-secondary"
                    title="Attach file"
                  >
                    <PaperclipIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={disabled}
                    className="h-8 w-8 rounded-full text-text-tertiary hover:text-text-secondary"
                    title="Voice input"
                  >
                    <MicIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                type="submit"
                size="icon"
                variant={message.trim() ? "default" : "ghost"}
                disabled={disabled || !message.trim()}
                className={cn(
                  isMobile ? "h-7 w-7" : "h-8 w-8",
                  "rounded-full transition-all",
                  message.trim()
                    ? "text-white"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
                title="Send message (Enter)"
              >
                <SendIcon
                  className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4")}
                />
              </Button>
            </div>
          </div>

          {/* Character count for mobile */}
          {maxLength > 0 && isMobile && characterCount > 0 && (
            <div
              className={cn(
                "text-xs text-right pr-2",
                isNearLimit ? "text-yellow-500" : "text-text-tertiary",
              )}
            >
              {characterCount}/{maxLength}
            </div>
          )}

          {/* Keyboard shortcuts help - hide on mobile */}
          <div
            className={cn("flex justify-between px-1", isMobile && "hidden")}
          >
            <div className="text-xs text-text-tertiary">
              <span className="opacity-70">Press </span>
              <kbd className="px-1 py-0.5 text-xs font-medium bg-background-secondary rounded border border-border-default mx-1">
                Enter
              </kbd>
              <span className="opacity-70"> to send, </span>
              <kbd className="px-1 py-0.5 text-xs font-medium bg-background-secondary rounded border border-border-default mx-1">
                Shift+Enter
              </kbd>
              <span className="opacity-70"> for new line</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-text-tertiary"
              disabled={disabled}
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Options
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
