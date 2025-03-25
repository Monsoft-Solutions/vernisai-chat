import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import { LogtailTransportConfig } from "../types";

/**
 * Create a Logtail transport with options
 */
export function createLogtailTransport(
  options: LogtailTransportConfig,
): LogtailTransport {
  const { sourceToken, endpoint, level, batchSize, batchInterval } = options;

  if (!sourceToken) {
    throw new Error("Logtail source token is required");
  }

  // Create a Logtail client
  const logtail = new Logtail(sourceToken, {
    endpoint,
    batchSize,
    batchInterval,
  });

  // Create and return the Winston transport
  return new LogtailTransport(logtail, { level });
}
