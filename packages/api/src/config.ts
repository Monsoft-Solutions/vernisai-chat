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
 * Default configuration values
 */
const defaultConfig: ApiConfig = {
  serverMode: "serverless",
  port: 3001,
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-organization-id"],
  },
  logging: {
    level: "info",
    format: "pretty",
  },
  openApi: {
    enabled: true,
    path: "/api/openapi.json",
  },
  trpcEndpoint: "/api/trpc",
};

/**
 * Load and validate configuration from environment variables
 */
export const loadConfig = (): ApiConfig => {
  const envConfig: Partial<ApiConfig> = {
    serverMode: (process.env.API_SERVER_MODE || defaultConfig.serverMode) as
      | "serverless"
      | "server",
    port: parseInt(process.env.API_PORT || String(defaultConfig.port), 10),
    trpcEndpoint: process.env.API_TRPC_ENDPOINT || defaultConfig.trpcEndpoint,
  };

  // Process CORS configuration if provided
  if (process.env.API_CORS_ORIGIN) {
    envConfig.cors = {
      ...defaultConfig.cors,
      origin: process.env.API_CORS_ORIGIN,
    };
  }

  // Process logging configuration if provided
  if (process.env.LOG_LEVEL) {
    envConfig.logging = {
      ...defaultConfig.logging,
      level: process.env.LOG_LEVEL as "debug" | "info" | "warn" | "error",
    };
  }

  // Merge default config with environment-based config
  return {
    ...defaultConfig,
    ...envConfig,
  };
};

/**
 * Export config singleton
 */
export const config = loadConfig();
