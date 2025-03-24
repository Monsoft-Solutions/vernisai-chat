import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Button component with various style variants
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600",
        outline:
          "border border-border-default bg-transparent hover:bg-background-secondary text-text-primary",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
        ghost: "hover:bg-background-secondary text-text-primary",
        link: "text-primary-500 underline-offset-4 hover:underline",
        destructive: "bg-error text-white hover:bg-red-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Props for the Button component
 */
export type ButtonProps = {
  /**
   * Optional click handler
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * If true, will use a native <a> tag
   */
  asChild?: boolean;
  /**
   * Optional class name for custom styling
   */
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

/**
 * Primary UI component for user interaction
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
