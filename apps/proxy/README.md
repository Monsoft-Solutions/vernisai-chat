# VernisAI Proxy Server

A reverse proxy server that routes requests to either the client or API server based on the request path.

## Overview

This proxy server solves the issue of having the client and server running on different ports by providing a unified endpoint. The proxy:

- Routes requests with `/api/` path to the server
- Routes all other requests to the client

## Configuration

Configuration is loaded from environment variables with sensible defaults:

| Variable           | Description                              | Default                 |
| ------------------ | ---------------------------------------- | ----------------------- |
| `PROXY_PORT`       | Port the proxy listens on                | `3000`                  |
| `CLIENT_URL`       | URL of the client application            | `http://localhost:5173` |
| `SERVER_URL`       | URL of the API server                    | `http://localhost:3001` |
| `API_PATH_PATTERN` | Pattern to identify API requests         | `/api/`                 |
| `LOG_LEVEL`        | Logging level (debug, info, warn, error) | `info`                  |

You can set these in your `.env.local` file or through system environment variables.

## Usage

### Development

To run the proxy server in development mode:

```bash
# From the project root
npm run dev --workspace=@monsoft/vernisai-proxy
```

### Production

To build and run in production:

```bash
# Build
npm run build --workspace=@monsoft/vernisai-proxy

# Start
npm run start --workspace=@monsoft/vernisai-proxy
```

## Example Setup

A typical setup in a development environment:

1. Client running on port 5173
2. API server running on port 3001
3. Proxy running on port 3000

With this configuration, all HTTP requests to `http://localhost:3000` will be correctly routed:

- `http://localhost:3000/api/...` → API server (port 3001)
- `http://localhost:3000/...` → Client (port 5173)
