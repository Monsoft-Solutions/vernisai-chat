/**
 * Tests for tool creation functionality
 */

import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import {
  createTool,
  createContextualTool,
  createAuthenticatedTool,
} from "../../src/tools/createTool";

describe("createTool", () => {
  it("should create a basic tool", () => {
    const mockExecute = vi.fn().mockResolvedValue("result");

    const tool = createTool({
      name: "test-tool",
      description: "A test tool",
      parameters: z.object({
        input: z.string().describe("Input string"),
      }),
      execute: mockExecute,
      autoRegister: false, // Don't register in the global registry for tests
    });

    expect(tool).toBeDefined();
    expect(tool.name).toBe("test-tool");
    expect(tool.description).toBe("A test tool");
    expect(tool.parameters).toBeDefined();
    expect(tool.execute).toBe(mockExecute);
  });

  it("should throw error if name is missing", () => {
    expect(() =>
      createTool({
        name: "",
        description: "A test tool",
        parameters: z.object({}),
        execute: async () => "result",
      }),
    ).toThrow("Tool name is required");
  });

  it("should throw error if description is missing", () => {
    expect(() =>
      createTool({
        name: "test-tool",
        description: "",
        parameters: z.object({}),
        execute: async () => "result",
      }),
    ).toThrow("Tool description is required");
  });

  it("should throw error if parameters are missing", () => {
    expect(() => {
      const params = {
        name: "test-tool",
        description: "A test tool",
        parameters: null as unknown as z.ZodType<unknown>,
        execute: async () => "result",
      };
      return createTool(params);
    }).toThrow("Tool parameters schema is required");
  });

  it("should throw error if execute function is missing", () => {
    expect(() => {
      const params = {
        name: "test-tool",
        description: "A test tool",
        parameters: z.object({}),
        execute: null as unknown as () => Promise<unknown>,
      };
      return createTool(params);
    }).toThrow("Tool execute function is required");
  });
});

describe("createContextualTool", () => {
  it("should create a contextual tool", () => {
    const mockExecute = vi.fn().mockResolvedValue("result");

    const tool = createContextualTool({
      name: "contextual-tool",
      description: "A contextual tool",
      parameters: z.object({
        input: z.string().describe("Input string"),
      }),
      execute: mockExecute,
      autoRegister: false,
    });

    expect(tool).toBeDefined();
    expect(tool.name).toBe("contextual-tool");
    expect(tool.description).toBe("A contextual tool");
    expect(tool.parameters).toBeDefined();
    expect(tool.execute).toBe(mockExecute);
  });
});

describe("createAuthenticatedTool", () => {
  it("should create an authenticated tool", () => {
    const mockExecute = vi.fn().mockResolvedValue("result");

    const tool = createAuthenticatedTool({
      name: "auth-tool",
      description: "An authenticated tool",
      parameters: z.object({
        input: z.string().describe("Input string"),
      }),
      execute: mockExecute,
      auth: {
        provider: "test-provider",
        scopes: ["read", "write"],
      },
      autoRegister: false,
    });

    expect(tool).toBeDefined();
    expect(tool.name).toBe("auth-tool");
    expect(tool.description).toBe("An authenticated tool");
    expect(tool.parameters).toBeDefined();
    expect(tool.execute).toBe(mockExecute);
    expect(tool.auth).toBeDefined();
    expect(tool.auth.provider).toBe("test-provider");
    expect(tool.auth.scopes).toEqual(["read", "write"]);
  });

  it("should throw error if auth provider is missing", () => {
    expect(() =>
      createAuthenticatedTool({
        name: "auth-tool",
        description: "An authenticated tool",
        parameters: z.object({}),
        execute: async () => "result",
        auth: {
          provider: "",
        },
      }),
    ).toThrow("Authentication provider is required for authenticated tools");
  });
});
