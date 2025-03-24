import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

// Define the expected structure of the environment configuration
type EnvConfig = {
  api: {
    serverMode: string;
    port: number;
    cors: {
      origin: string | string[];
      methods: string[];
      allowedHeaders: string[];
    };
    logging: {
      level: string;
      format: string;
    };
    openApi: {
      enabled: boolean;
      path: string;
    };
    trpcEndpoint: string;
  };
  database: {
    type: string;
    connected: boolean;
  };
  hasSupabase: boolean;
  hasLangfuse: boolean;
  nodeEnv: string;
  error?: string;
};

// This is a simple mock for the tRPC call since we don't have the actual client set up
const fetchEnvConfig = async (): Promise<EnvConfig> => {
  try {
    // In a real app, this would use the tRPC client
    const response = await fetch("/api/trpc/test.getEnv");
    if (!response.ok) {
      throw new Error("Failed to fetch environment configuration");
    }
    const data = await response.json();
    return data.result.data;
  } catch (error) {
    console.error("Error fetching environment config:", error);
    return {
      error:
        "Failed to fetch environment configuration. Make sure the API is running.",
      api: {
        serverMode: "unknown",
        port: 0,
        cors: { origin: "", methods: [], allowedHeaders: [] },
        logging: { level: "", format: "" },
        openApi: { enabled: false, path: "" },
        trpcEndpoint: "",
      },
      database: { type: "unknown", connected: false },
      hasSupabase: false,
      hasLangfuse: false,
      nodeEnv: "",
    };
  }
};

export const Route = createFileRoute("/env-test")({
  component: EnvTestPage,
});

function EnvTestPage() {
  const [envConfig, setEnvConfig] = useState<EnvConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEnvConfig = async () => {
      try {
        setLoading(true);
        const config = await fetchEnvConfig();
        setEnvConfig(config);
        if (config.error) {
          setError(config.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadEnvConfig();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Environment Configuration Test
      </h1>

      {loading && <p>Loading environment configuration...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {envConfig && !loading && (
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-semibold mb-2">
            Environment Configuration
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">API Configuration</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(envConfig.api, null, 2)}
            </pre>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Database</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(envConfig.database, null, 2)}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-gray-100 rounded">
              <div className="font-medium">Node Environment</div>
              <div className="text-gray-800">
                {envConfig.nodeEnv || "Not set"}
              </div>
            </div>

            <div className="p-3 bg-gray-100 rounded">
              <div className="font-medium">Supabase</div>
              <div className="text-gray-800">
                {envConfig.hasSupabase ? "Configured" : "Not configured"}
              </div>
            </div>

            <div className="p-3 bg-gray-100 rounded">
              <div className="font-medium">LangFuse</div>
              <div className="text-gray-800">
                {envConfig.hasLangfuse ? "Configured" : "Not configured"}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              Note: For security reasons, sensitive information like connection
              strings and API keys are not displayed.
            </p>
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          This page makes an API call to the test.getEnv endpoint to verify that
          environment configuration is working correctly.
        </p>
      </div>
    </div>
  );
}
