import { env } from "@monsoft/vernisai-config";

/**
 * API configuration options
 */
export interface ApiConfig {
  /**
   * Server mode - determines how the API is deployed and run
   */
  serverMode: "serverless" | "server";

  /**
   * Port for Express server when running in server mode
   */
  port: number;

  /**
   * CORS configuration for server mode
   */
  cors: {
    /**
     * Allowed origins
     */
    origin: string | string[];

    /**
     * Allowed HTTP methods
     */
    methods: string[];

    /**
     * Allowed headers
     */
    allowedHeaders: string[];
  };

  /**
   * Logging configuration
   */
  logging: {
    /**
     * Logging level
     */
    level: "debug" | "info" | "warn" | "error";

    /**
     * Logging format
     */
    format: "json" | "pretty";
  };

  /**
   * OpenAPI configuration
   */
  openApi: {
    /**
     * Whether OpenAPI documentation is enabled
     */
    enabled: boolean;

    /**
     * Path to serve OpenAPI JSON
     */
    path: string;
  };

  /**
   * tRPC endpoint path
   */
  trpcEndpoint: string;
}

/**
 * Export config directly from the centralized environment configuration
 */
export const config: ApiConfig = env.api;
