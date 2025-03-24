import express from "express";
import httpProxy from "http-proxy";
import { config } from "./config";
import { IncomingMessage, ServerResponse } from "http";

// Create a proxy server instance
const proxy = httpProxy.createProxyServer({});

// Create an Express application
const app = express();

// Log proxy configuration on startup
console.log(`Proxy configuration:
- Proxy listening on: http://localhost:${config.port}
- Client URL: ${config.clientUrl}
- Server URL: ${config.serverUrl}
- API Path Pattern: ${config.apiPathPattern}
- Log Level: ${config.logLevel}
`);

// Handle proxy errors
// @ts-expect-error: Type definitions in @types/http-proxy are not accurate for the error event
proxy.on("error", (err: Error, req: IncomingMessage, res: ServerResponse) => {
  console.error("Proxy error:", err);
  if (res.writeHead) {
    res.writeHead(500, {
      "Content-Type": "text/plain",
    });
    res.end("Proxy error: " + err.message);
  }
});

// Route requests based on path
app.use((req, res) => {
  const isApiRequest = req.path.startsWith(config.apiPathPattern);
  const target = isApiRequest ? config.serverUrl : config.clientUrl;

  if (config.logLevel === "debug") {
    console.log(`[${req.method}] ${req.url} → ${target}`);
  }

  proxy.web(req, res, { target });
});

// Start the proxy server
app.listen(config.port, () => {
  console.log(`Proxy server running at http://localhost:${config.port}`);
  console.log(`Forwarding API requests to ${config.serverUrl}`);
  console.log(`Forwarding all other requests to ${config.clientUrl}`);
});

// Handle process signals for graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down proxy server...");
  proxy.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Shutting down proxy server...");
  proxy.close();
  process.exit(0);
});
