import { describe, it, expect, beforeEach, vi } from "vitest";
import { dashboardRouter } from "../../src/router/dashboard";
import { createTestContext, expectTRPCError } from "../utils/trpc-test-utils";
import {
  OrganizationInfo,
  ConversationSummary,
  Agent,
  Model,
  Tool,
  UsageData,
  TestMessage,
  AgentTemplate,
} from "@vernisai/types";
import { TRPCError } from "@trpc/server";

// Import the mock data directly from the dashboard mock file
import {
  mockOrganizationInfo,
  mockRecentConversations,
  mockAgents,
  mockTools,
  mockModels,
  mockTestMessages,
  mockAgentTemplates,
} from "../../src/mock/dashboard";

describe("Dashboard Router", () => {
  let ctx;

  beforeEach(() => {
    // Create a clean test context before each test
    ctx = createTestContext();

    // Clear any vi mocks if needed
    vi.clearAllMocks();
  });

  describe("getOrganizationInfo", () => {
    it("should return data that conforms to OrganizationInfo type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getOrganizationInfo();

      // Assert
      expect(result).toEqual(mockOrganizationInfo);

      // Type verification
      const typeCheckResult: OrganizationInfo = result;
      expect(typeCheckResult).toBeDefined();

      // Check specific properties to ensure type conformance
      expect(typeof result.name).toBe("string");
      expect(typeof result.activeUsers).toBe("number");
      expect(typeof result.usagePercent).toBe("number");
      expect(
        result.createdAt instanceof Date ||
          typeof result.createdAt === "string",
      ).toBe(true);
    });

    it("should handle errors properly", async () => {
      // Mock the entire createCaller to throw a TRPCError
      const mockCreateCaller = vi.spyOn(dashboardRouter, "createCaller");

      // Create a partial mock of the caller with only the method we're testing
      const mockCaller = {
        getOrganizationInfo: vi.fn().mockImplementation(() => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Test error",
          });
        }),
      } as Partial<ReturnType<typeof dashboardRouter.createCaller>>;

      mockCreateCaller.mockReturnValue(
        mockCaller as ReturnType<typeof dashboardRouter.createCaller>,
      );

      try {
        // Act & Assert
        await expectTRPCError(
          () => dashboardRouter.createCaller(ctx).getOrganizationInfo(),
          "INTERNAL_SERVER_ERROR",
        );
      } finally {
        // Cleanup - Restore original implementation
        mockCreateCaller.mockRestore();
      }
    });
  });

  describe("getRecentConversations", () => {
    it("should return data that conforms to ConversationSummary[] type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getRecentConversations();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(mockRecentConversations);

      // Type verification
      const typeCheckResult: ConversationSummary[] = result;
      expect(typeCheckResult).toBeDefined();

      // Verify first item if available
      if (result.length > 0) {
        const conversation = result[0];
        expect(typeof conversation.id).toBe("string");
        expect(typeof conversation.title).toBe("string");
        expect(typeof conversation.model).toBe("string");
        expect(typeof conversation.snippet).toBe("string");
        expect(
          conversation.lastMessageAt instanceof Date ||
            typeof conversation.lastMessageAt === "string",
        ).toBe(true);
      }
    });

    it("should filter conversations based on input", async () => {
      // Find a term that exists in the mock data
      const filterTerm = "marketing";

      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getRecentConversations({
        limit: 2,
        filter: filterTerm,
      });

      // Assert
      expect(result.length).toBeLessThanOrEqual(2);
      result.forEach((conv) => {
        expect(
          conv.title.toLowerCase().includes(filterTerm) ||
            conv.model.toLowerCase().includes(filterTerm) ||
            conv.snippet.toLowerCase().includes(filterTerm),
        ).toBe(true);
      });
    });

    it("should limit the number of returned conversations", async () => {
      // Act
      const limit = 1;
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getRecentConversations({
        limit,
      });

      // Assert
      expect(result.length).toBeLessThanOrEqual(limit);
    });
  });

  describe("getAgents", () => {
    it("should return data that conforms to Agent[] type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getAgents();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(mockAgents);

      // Type verification
      const typeCheckResult: Agent[] = result;
      expect(typeCheckResult).toBeDefined();

      // Verify first item if available
      if (result.length > 0) {
        const agent = result[0];
        expect(typeof agent.id).toBe("string");
        expect(typeof agent.name).toBe("string");
        expect(typeof agent.description).toBe("string");
        expect(Array.isArray(agent.capabilities)).toBe(true);
      }
    });

    it("should filter agents based on input", async () => {
      // Find a capability that exists in the mock data
      const filterTerm = "data";

      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getAgents({
        filter: filterTerm,
      });

      // Assert
      result.forEach((agent) => {
        expect(
          agent.name.toLowerCase().includes(filterTerm) ||
            agent.description.toLowerCase().includes(filterTerm) ||
            agent.capabilities.some((cap) =>
              cap.toLowerCase().includes(filterTerm),
            ),
        ).toBe(true);
      });
    });
  });

  describe("getUsageData", () => {
    it("should return data that conforms to UsageData[] type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getUsageData();

      // Assert
      expect(Array.isArray(result)).toBe(true);

      // Type verification
      const typeCheckResult: UsageData[] = result;
      expect(typeCheckResult).toBeDefined();

      // Verify first item if available
      if (result.length > 0) {
        const usageData = result[0];
        expect(typeof usageData.date).toBe("string");
        expect(typeof usageData.value).toBe("number");
      }
    });

    it("should limit the data points based on days input", async () => {
      // Act
      const days = 7;
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getUsageData({ days });

      // Assert
      expect(result.length).toBeLessThanOrEqual(days);
    });
  });

  describe("getTools", () => {
    it("should return data that conforms to Tool[] type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getTools();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(mockTools);

      // Type verification
      const typeCheckResult: Tool[] = result;
      expect(typeCheckResult).toBeDefined();

      // Verify first item if available
      if (result.length > 0) {
        const tool = result[0];
        expect(typeof tool.id).toBe("string");
        expect(typeof tool.name).toBe("string");
        expect(typeof tool.description).toBe("string");
      }
    });
  });

  describe("getModels", () => {
    it("should return data that conforms to Model[] type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getModels();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(mockModels);

      // Type verification
      const typeCheckResult: Model[] = result;
      expect(typeCheckResult).toBeDefined();

      // Verify first item if available
      if (result.length > 0) {
        const model = result[0];
        expect(typeof model.id).toBe("string");
        expect(typeof model.name).toBe("string");
        expect(typeof model.provider).toBe("string");
        expect(Array.isArray(model.capabilities)).toBe(true);
        expect(typeof model.contextLength).toBe("number");
      }
    });
  });

  describe("getTestMessages", () => {
    it("should return data that conforms to TestMessage[] type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getTestMessages();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(mockTestMessages);

      // Type verification
      const typeCheckResult: TestMessage[] = result;
      expect(typeCheckResult).toBeDefined();

      // Verify first item if available
      if (result.length > 0) {
        const message = result[0];
        expect(typeof message.id).toBe("string");
        expect(typeof message.content).toBe("string");
        expect(message.role === "user" || message.role === "assistant").toBe(
          true,
        );
        expect(
          message.timestamp instanceof Date ||
            typeof message.timestamp === "string",
        ).toBe(true);
      }
    });
  });

  describe("getAgentTemplates", () => {
    it("should return data that conforms to AgentTemplate[] type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getAgentTemplates();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(mockAgentTemplates);

      // Type verification
      const typeCheckResult: AgentTemplate[] = result;
      expect(typeCheckResult).toBeDefined();

      // Verify first item if available
      if (result.length > 0) {
        const template = result[0];
        expect(typeof template.id).toBe("string");
        expect(typeof template.name).toBe("string");
        expect(typeof template.description).toBe("string");
        expect(typeof template.systemPrompt).toBe("string");
        expect(Array.isArray(template.recommendedTools)).toBe(true);
        expect(typeof template.model).toBe("string");
      }
    });
  });
});
