import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Props for the Input component
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * Input component for user text input
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-border-default bg-background-primary px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
