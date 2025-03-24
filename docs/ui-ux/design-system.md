# Design System Implementation

## Overview

The Design System is the foundation of the UI implementation, providing a consistent set of components, styles, and patterns for building the AI Chatbot application. It ensures visual consistency, accessibility, and efficient development through reusable components.

## Design Tokens

Design tokens are the atomic values that make up the design system. They are implemented as CSS variables and Tailwind theme extensions.

### Color System

```tsx
// To be implemented in packages/ui/src/styles/colors.ts
export const colors = {
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6", // Primary brand color
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
    950: "#172554",
  },
  secondary: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#34D399",
    500: "#10B981", // Secondary brand color
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
    950: "#022C22",
  },
  accent: {
    50: "#F5F3FF",
    100: "#EDE9FE",
    200: "#DDD6FE",
    300: "#C4B5FD",
    400: "#A78BFA",
    500: "#8B5CF6", // Accent color
    600: "#7C3AED",
    700: "#6D28D9",
    800: "#5B21B6",
    900: "#4C1D95",
    950: "#2E1065",
  },
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
    950: "#030712",
  },
  success: "#34D399", // Emerald 400
  warning: "#FBBF24", // Amber 400
  error: "#F87171", // Red 400
  info: "#60A5FA", // Blue 400
};
```

### Typography

```tsx
// To be implemented in packages/ui/src/styles/typography.ts
export const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    mono: ["Roboto Mono", "monospace"],
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
  },
};
```

### Spacing

```tsx
// To be implemented in packages/ui/src/styles/spacing.ts
export const spacing = {
  0: "0px",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
};
```

### Shadows

```tsx
// To be implemented in packages/ui/src/styles/shadows.ts
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  none: "none",
};
```

## Tailwind Configuration

The design system is implemented using Tailwind CSS, with customizations for our specific design tokens:

```typescript
// To be implemented in packages/ui/tailwind.config.js
import { colors, typography, spacing, shadows } from "./src/styles";

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      letterSpacing: typography.letterSpacing,
      spacing,
      boxShadow: shadows,
      borderRadius: {
        none: "0",
        sm: "0.125rem", // 2px
        DEFAULT: "0.25rem", // 4px
        md: "0.375rem", // 6px
        lg: "0.5rem", // 8px
        xl: "0.75rem", // 12px
        "2xl": "1rem", // 16px
        full: "9999px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

## Core Components

### Button Component

```tsx
// To be implemented in packages/ui/components/ui/Button.tsx
import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
        ghost: "bg-transparent hover:bg-gray-50",
        destructive: "bg-error text-white hover:bg-red-600",
        link: "bg-transparent text-primary-500 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="mr-2">
            {/* Spinner icon */}
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
```

### Card Component

```tsx
// To be implemented in packages/ui/components/ui/Card.tsx
import * as React from "react";
import { cn } from "../../lib/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "bordered" | "elevated";
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg",
          variant === "default" && "bg-white dark:bg-gray-800",
          variant === "bordered" &&
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          variant === "elevated" && "bg-white dark:bg-gray-800 shadow-md",
          className
        )}
        {...props}
      />
    );
  }
);

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
      className
    )}
    {...props}
  />
));

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 py-4", className)} {...props} />
));

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-6 py-4 border-t border-gray-200 dark:border-gray-700",
      className
    )}
    {...props}
  />
));

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";
```

### Input Component

```tsx
// To be implemented in packages/ui/components/ui/Input.tsx
import * as React from "react";
import { cn } from "../../lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  helperText?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, leftElement, rightElement, error, helperText, ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        <div className="relative">
          {leftElement && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftElement}
            </div>
          )}
          <input
            className={cn(
              "w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100",
              leftElement && "pl-10",
              rightElement && "pr-10",
              error && "border-error focus:border-error focus:ring-error",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "mt-1 text-sm",
              error ? "text-error" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
```

## Component Library Structure

The UI component library is structured following atomic design principles:

```bash
packages/ui/
├── src/
│   ├── styles/       # Design tokens and themes
│   ├── lib/          # Utility functions
│   ├── hooks/        # Custom hooks
│   ├── components/
│   │   ├── ui/       # Atomic components (atoms)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── forms/    # Form components (molecules)
│   │   │   ├── FormField.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   └── ...
│   │   ├── data/     # Data display components
│   │   │   ├── Table.tsx
│   │   │   ├── Chart.tsx
│   │   │   └── ...
│   │   ├── layout/   # Layout components
│   │   │   ├── Grid.tsx
│   │   │   ├── Stack.tsx
│   │   │   └── ...
│   │   ├── navigation/ # Navigation components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   ├── feedback/  # Feedback components
│   │   │   ├── Alert.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ...
│   │   └── composite/ # Complex components (organisms)
│   │       ├── chat/
│   │       ├── agents/
│   │       ├── organizations/
│   │       └── ...
│   └── index.ts      # Main export file
└── package.json
```

## Theme Implementation

The application supports both light and dark themes through CSS variables and Tailwind's dark mode:

```tsx
// To be implemented in packages/ui/src/styles/theme.ts
const createThemeVars = (mode: "light" | "dark") => {
  return {
    background: {
      primary:
        mode === "light" ? "var(--color-white)" : "var(--color-gray-900)",
      secondary:
        mode === "light" ? "var(--color-gray-50)" : "var(--color-gray-800)",
      tertiary:
        mode === "light" ? "var(--color-gray-100)" : "var(--color-gray-700)",
    },
    text: {
      primary:
        mode === "light" ? "var(--color-gray-900)" : "var(--color-gray-50)",
      secondary:
        mode === "light" ? "var(--color-gray-600)" : "var(--color-gray-400)",
      tertiary:
        mode === "light" ? "var(--color-gray-400)" : "var(--color-gray-500)",
    },
    border: {
      default:
        mode === "light" ? "var(--color-gray-200)" : "var(--color-gray-700)",
      strong:
        mode === "light" ? "var(--color-gray-300)" : "var(--color-gray-600)",
    },
    // Add other theme variables
  };
};

// CSS variables will be injected into :root and .dark selectors
```

## Accessibility Implementation

The design system implements accessibility features through consistent patterns:

```tsx
// To be implemented in packages/ui/src/lib/a11y.ts
export const srOnly = "sr-only";

export const focusRing =
  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";

export const ariaExpanded = (expanded: boolean) => ({
  "aria-expanded": expanded,
});

export const ariaControls = (id: string) => ({
  "aria-controls": id,
});

export const ariaSelected = (selected: boolean) => ({
  "aria-selected": selected,
});

export const ariaLabelledBy = (id: string) => ({
  "aria-labelledby": id,
});

// Additional accessibility utilities
```

## Animation System

The design system includes a set of standardized animations:

```tsx
// To be implemented in packages/ui/src/lib/animations.ts
export const fadeIn = "animate-fade-in";
export const slideUp = "animate-slide-up";
export const slideDown = "animate-slide-down";
export const scaleIn = "animate-scale-in";
export const spin = "animate-spin";
export const spinSlow = "animate-spin-slow";

// Custom animation hook
export const useAnimationControls = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const open = React.useCallback(() => {
    if (!isOpen && !isAnimating) {
      setIsAnimating(true);
      setIsOpen(true);
    }
  }, [isOpen, isAnimating]);

  const close = React.useCallback(() => {
    if (isOpen && !isAnimating) {
      setIsAnimating(true);
      setIsOpen(false);
    }
  }, [isOpen, isAnimating]);

  const onAnimationEnd = React.useCallback(() => {
    setIsAnimating(false);
  }, []);

  return {
    isOpen,
    isAnimating,
    open,
    close,
    onAnimationEnd,
  };
};
```

## Responsive Utilities

The design system includes utilities for responsive design:

```tsx
// To be implemented in packages/ui/src/lib/responsive.ts
import { useEffect, useState } from "react";

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const useBreakpoint = (breakpoint: keyof typeof breakpoints) => {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsAboveBreakpoint(window.innerWidth >= breakpoints[breakpoint]);
    };

    // Check initially
    checkBreakpoint();

    // Add event listener for resize
    window.addEventListener("resize", checkBreakpoint);

    // Cleanup
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [breakpoint]);

  return isAboveBreakpoint;
};

export const useIsMobile = () => !useBreakpoint("md");
export const useIsTablet = () => useBreakpoint("md") && !useBreakpoint("lg");
export const useIsDesktop = () => useBreakpoint("lg");
```

## Implementation Roadmap

### Phase 1: Design Tokens & Core Setup

1. Set up the UI package structure
2. Configure Tailwind with design tokens
3. Implement theme switching functionality

### Phase 2: Base Components

1. Implement layout components
2. Create form components
3. Develop feedback components

### Phase 3: Complex Components

1. Build navigation components
2. Implement data visualization components
3. Create specialized components for chat interfaces

### Phase 4: Documentation & Testing

1. Set up Storybook for component documentation
2. Create accessibility tests
3. Implement visual regression testing

## Storybook Integration

The design system will be documented using Storybook:

```tsx
// To be implemented in packages/ui/stories/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../src/components/ui/Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"],
    },
    isLoading: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
    variant: "secondary",
  },
};

// Additional stories
```

## Next Steps

1. Set up the UI package with Tailwind configuration
2. Implement design tokens (colors, typography, spacing, shadows)
3. Create core atomic components (Button, Input, Card, etc.)
4. Develop theme switching functionality
5. Set up Storybook for component documentation
