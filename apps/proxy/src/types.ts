/**
 * Proxy server configuration types
 */

export type ProxyConfig = {
  /**
   * Port the proxy server listens on
   */
  port: number;

  /**
   * URL of the client application
   */
  clientUrl: string;

  /**
   * URL of the API server
   */
  serverUrl: string;

  /**
   * API path pattern to route to the server
   */
  apiPathPattern: string;

  /**
   * Log level for the proxy server
   */
  logLevel: "debug" | "info" | "warn" | "error";
};
