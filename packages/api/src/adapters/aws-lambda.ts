import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../router";
import { createInnerTRPCContext } from "../trpc";

/**
 * Handle tRPC requests in an AWS Lambda function
 */
export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract authentication information from the event
    // In a real implementation, this would validate the JWT token
    const session = event.headers.authorization
      ? { userId: "sample-user-id" } // Just a placeholder
      : null;

    // Extract organization ID from the event
    const organizationId = event.headers["x-organization-id"] || undefined;

    // Create a fetch request from the Lambda event
    const url = new URL(
      event.path,
      `https://${event.headers.host || "localhost"}`,
    );

    // Add query parameters
    if (event.queryStringParameters) {
      Object.entries(event.queryStringParameters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    // Prepare headers
    const headers = new Headers();
    if (event.headers) {
      Object.entries(event.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value);
      });
    }

    // Create the fetch request
    const request = new Request(url.toString(), {
      method: event.httpMethod,
      headers,
      body: event.body ? event.body : undefined,
    });

    // Handle the request using tRPC fetch handler
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: () => {
        return createInnerTRPCContext({
          session,
          organizationId,
        });
      },
    });

    // Convert the response to an API Gateway response
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const body = await response.text();

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body,
    };
  } catch (error) {
    console.error("Lambda handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    };
  }
};

/**
 * Exports a handler that can be used with AWS Lambda
 */
export default lambdaHandler;
