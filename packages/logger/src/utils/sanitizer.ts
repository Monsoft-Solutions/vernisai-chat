import { LogData } from "../types";

/**
 * Default fields to sanitize in logs
 */
const DEFAULT_SENSITIVE_FIELDS = [
  "password",
  "token",
  "apiKey",
  "api_key",
  "key",
  "secret",
  "credential",
  "credit_card",
  "creditcard",
  "cvv",
  "ssn",
  "auth",
];

/**
 * Sanitize sensitive data in logs
 *
 * @param data - The data to sanitize
 * @param sensitiveFields - Field names to redact (case-insensitive substring match)
 * @returns Sanitized data
 */
export function sanitize(
  data: LogData | unknown,
  sensitiveFields: string[] = DEFAULT_SENSITIVE_FIELDS,
): LogData | unknown {
  if (!data || typeof data !== "object") return data;

  const result = { ...(data as Record<string, unknown>) };

  for (const [key, value] of Object.entries(result)) {
    // Check if the key contains any sensitive field name
    if (
      sensitiveFields.some((field) =>
        key.toLowerCase().includes(field.toLowerCase()),
      )
    ) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      // Recursively sanitize nested objects
      result[key] = sanitize(value, sensitiveFields);
    }
  }

  return result;
}

/**
 * Sanitize an error object for logging
 *
 * @param error - Error object to sanitize
 * @returns Sanitized error object suitable for logging
 */
export function sanitizeError(error: Error | unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { error: String(error) };
  }

  const sanitizedError: Record<string, unknown> = {
    message: error.message,
    name: error.name,
    stack: error.stack,
  };

  // Include any other properties from the error
  if (error instanceof Object) {
    for (const [key, value] of Object.entries(error)) {
      if (!["message", "name", "stack"].includes(key)) {
        sanitizedError[key] = value;
      }
    }
  }

  return sanitize(sanitizedError) as Record<string, unknown>;
}

/**
 * Redact personally identifiable information (PII) from text
 *
 * @param text - Text that might contain PII
 * @returns Text with PII replaced with placeholders
 */
export function redactPII(text: string): string {
  if (!text) return text;

  // Email addresses
  text = text.replace(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g,
    "[EMAIL]",
  );

  // Phone numbers (various formats)
  text = text.replace(
    /(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
    "[PHONE]",
  );

  // IP addresses
  text = text.replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, "[IP_ADDRESS]");

  // URLs containing auth
  text = text.replace(
    /(https?:\/\/)([^:@/\n]+):([^:@/\n]+)@/g,
    "$1[REDACTED]:[REDACTED]@",
  );

  return text;
}

export const SENSITIVE_FIELDS = DEFAULT_SENSITIVE_FIELDS;
