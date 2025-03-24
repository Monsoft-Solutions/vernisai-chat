/**
 * Common environment configuration for all packages
 */
export type Environment = {
  /**
   * Database connection string
   */
  database: {
    /**
     * PostgreSQL connection string
     */
    url: string;
  };

  /**
   * API configuration
   */
  api: {
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
  };

  /**
   * Supabase configuration
   */
  supabase?: {
    /**
     * Supabase URL
     */
    url: string;

    /**
     * Supabase API key
     */
    key: string;
  };

  /**
   * LangFuse configuration for observability
   */
  langfuse?: {
    /**
     * LangFuse secret key
     */
    secretKey: string;

    /**
     * LangFuse public key
     */
    publicKey: string;

    /**
     * LangFuse host
     */
    host: string;
  };
};
