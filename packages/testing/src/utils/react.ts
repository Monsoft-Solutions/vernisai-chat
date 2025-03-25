import { ReactElement } from "react";

/**
 * Generic render result type
 */
export type RenderResult = {
  container: HTMLElement;
  unmount: () => void;
  rerender: (ui: ReactElement) => void;
  [key: string]: unknown;
};

/**
 * Options for rendering React components
 */
export type RenderOptions = {
  /**
   * Custom route path for routing tests
   */
  route?: string;
  /**
   * Custom route parameters
   */
  routeParams?: Record<string, string>;
  /**
   * Whether to include user event setup
   */
  user?: boolean;
  /**
   * Container to render into
   */
  container?: HTMLElement;
  /**
   * Any additional options
   */
  [key: string]: unknown;
};

/**
 * Mock implementation of render function for type definition
 * Actual implementation will be provided by the test framework
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function render(
  _ui: ReactElement,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options: RenderOptions = {},
): RenderResult {
  // This is just a stub for type checking
  // The actual implementation should be provided by the testing framework
  throw new Error(
    "render function not implemented - this is just a type definition",
  );
}

/**
 * Mock user event interface for type definition
 */
export interface UserEvent {
  setup(): UserEventMethods;
}

export interface UserEventMethods {
  click(element: HTMLElement): Promise<void>;
  type(element: HTMLElement, text: string): Promise<void>;
  selectOptions(element: HTMLElement, values: string[]): Promise<void>;
  clear(element: HTMLElement): Promise<void>;
  [key: string]: unknown;
}

/**
 * Mock userEvent for type definition
 */
export const userEvent: UserEvent = {
  setup: () => {
    throw new Error(
      "userEvent.setup not implemented - this is just a type definition",
    );
  },
} as UserEvent;

/**
 * Wait for a condition to be true
 *
 * @param callback - Condition to wait for
 * @param options - Options for waiting
 * @returns Promise that resolves when condition is true
 */
export async function waitFor(
  callback: () => boolean | undefined | Promise<boolean | undefined>,
  options: {
    timeout?: number;
    interval?: number;
    onTimeout?: () => void;
  } = {},
): Promise<void> {
  const { timeout = 1000, interval = 50, onTimeout } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = await callback();
      if (result !== false) {
        return;
      }
    } catch (e) {
      // Ignore errors and continue waiting
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  if (onTimeout) {
    onTimeout();
  }

  throw new Error(`Timed out after ${timeout}ms waiting for condition`);
}

/**
 * Create an event wrapper for common events
 */
export const createEvent = {
  click: (element: HTMLElement) => {
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(clickEvent);
    return clickEvent;
  },

  change: (element: HTMLElement, value: string) => {
    // If it's an input element, set the value property directly
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    ) {
      element.value = value;
    } else {
      // For other elements, use Object.defineProperty as a fallback
      Object.defineProperty(element, "value", {
        value,
        writable: true,
      });
    }

    const event = new Event("change", { bubbles: true });
    element.dispatchEvent(event);
    return event;
  },

  submit: (formElement: HTMLFormElement) => {
    const event = new Event("submit", { bubbles: true, cancelable: true });
    formElement.dispatchEvent(event);
    return event;
  },
};
