import { randomUUID } from "crypto";

/**
 * Creates a UUID v4 string for use as a unique identifier
 *
 * @returns {string} A random UUID v4 string
 * @example
 * ```typescript
 * const id = createId();
 * // id = "123e4567-e89b-12d3-a456-426614174000"
 * ```
 */
export function createId(): string {
  return randomUUID();
}
