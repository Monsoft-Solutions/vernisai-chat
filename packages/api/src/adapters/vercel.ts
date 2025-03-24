import { NextApiRequest, NextApiResponse } from "next";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../router";
import { createTRPCContext } from "../trpc";

/**
 * Handle tRPC requests in a Next.js API route
 */
export const nextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  // Create a fetch request from the Next.js API request
  const request = new Request(
    // Construct a URL that matches the incoming request URL
    `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}${req.url}`,
    {
      method: req.method,
      headers: new Headers(req.headers as Record<string, string>),
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    },
  );

  // Use the tRPC fetch request handler to process the request
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => {
      return createTRPCContext({
        req,
        res,
      });
    },
  });

  // Convert the response to a Next.js API response
  res.status(response.status);

  // Copy headers from the fetch response to the Next.js response
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  // Send the response body
  if (response.body) {
    const responseText = await response.text();
    res.send(responseText);
  } else {
    res.end();
  }
};

/**
 * Exports a handler that can be used with Vercel Serverless Functions
 * or with Next.js API routes.
 */
export default nextApiHandler;
