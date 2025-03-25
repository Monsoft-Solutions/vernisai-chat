import * as Sentry from "@sentry/react";
import * as SentryBrowser from "@sentry/browser";

/**
 * Initialize Sentry for client-side error tracking
 */
export const initSentry = (): void => {
  // Get environment variables
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || "development";
  const enabled = Boolean(dsn) && environment !== "development";

  if (enabled) {
    Sentry.init({
      dsn,
      // @ts-expect-error - Type mismatch but works at runtime
      integrations: [new SentryBrowser.BrowserTracing()],

      // Set tracesSampleRate to 1.0 for development, lower for production
      tracesSampleRate: environment === "production" ? 0.2 : 1.0,

      // Set environment
      environment,

      // Configure PII filtering
      beforeSend(event) {
        // Remove user IP address if it exists
        if (event.request && typeof event.request === "object") {
          // @ts-expect-error - Dynamic property access
          delete event.request.ip_address;
        }
        return event;
      },
    });

    console.info(`Sentry initialized in ${environment} environment`);
  } else {
    console.info(
      "Sentry disabled: No DSN provided or running in development mode",
    );
  }
};

/**
 * Set user context in Sentry for connecting errors with specific users
 * @param user User information to associate with errors
 */
export const setUserContext = (user: {
  id: string;
  email?: string;
  username?: string;
}): void => {
  Sentry.setUser(user);
};

/**
 * Clear user context when user logs out
 */
export const clearUserContext = (): void => {
  // Simply use setUser with null value
  Sentry.setUser(null);
};

/**
 * Manually capture an exception with additional context
 * @param error The error object to capture
 * @param context Additional context information
 */
export const captureException = (
  error: unknown,
  context?: Record<string, unknown>,
): void => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureException(error);
  });
};

/**
 * Capture a custom event with additional context
 * @param message Event message
 * @param level Severity level
 * @param context Additional context information
 */
export const captureEvent = (
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: Record<string, unknown>,
): void => {
  Sentry.captureEvent({
    message,
    level,
    extra: context,
  });
};

/**
 * Add a breadcrumb for better debugging context
 * @param category Breadcrumb category
 * @param message Breadcrumb message
 * @param data Additional data
 * @param level Severity level
 */
export const addBreadcrumb = (
  category: string,
  message: string,
  data?: Record<string, unknown>,
  level: Sentry.SeverityLevel = "info",
): void => {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
  });
};

/**
 * Check if user has given consent for error reporting
 * Used for GDPR compliance
 */
export const userHasGivenConsent = (): boolean => {
  return localStorage.getItem("errorReportingConsent") === "true";
};

/**
 * Update user consent for error reporting
 * @param consent New consent value
 */
export const updateErrorReportingConsent = (consent: boolean): void => {
  localStorage.setItem("errorReportingConsent", String(consent));

  // If Sentry was previously disabled due to lack of consent,
  // reinitialize it when consent is given
  if (consent) {
    initSentry();
  }
};

/**
 * Sentry Error Boundary wrapper for React components
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;
