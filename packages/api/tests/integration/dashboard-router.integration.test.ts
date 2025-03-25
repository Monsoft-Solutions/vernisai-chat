import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { dashboardRouter } from "../../src/router/dashboard";
import { createTestContext } from "../utils/trpc-test-utils";
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
import { mocks } from "@vernisai/testing";

describe("Dashboard Router Integration Tests", () => {
  let ctx;
  // Store mock database for cleanup
  let mockDb;

  beforeAll(async () => {
    // Set up integration test context
    ctx = createTestContext({
      session: { userId: "test-integration-user" },
      organizationId: "test-integration-org",
    });

    // Set up any necessary test data using the mock database
    mockDb = mocks.database({
      organizations: [
        {
          id: "test-integration-org",
          name: "Test Organization",
          createdAt: new Date(),
          activeUsers: 10,
          usagePercent: 45,
        },
      ],
      conversations: [
        {
          id: "test-conv-1",
          title: "Marketing Strategy",
          model: "gpt-4",
          snippet: "Discussion about marketing plans",
          lastMessageAt: new Date(),
          organizationId: "test-integration-org",
        },
      ],
    });

    // Additional setup if needed
  });

  afterAll(async () => {
    // Clean up resources after tests
    // Reset any mocks
    vi.resetAllMocks();

    // Clear mock database
    if (mockDb && typeof mockDb.clear === "function") {
      await mockDb.clear();
    }
  });

  describe("getOrganizationInfo", () => {
    it("should return data that conforms to OrganizationInfo type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getOrganizationInfo();

      // Assert
      expect(result).toBeDefined();

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
  });

  describe("getRecentConversations", () => {
    it("should return data that conforms to ConversationSummary[] type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getRecentConversations();

      // Assert
      expect(Array.isArray(result)).toBe(true);

      // Type verification
      const typeCheckResult: ConversationSummary[] = result;
      expect(typeCheckResult).toBeDefined();

      // If we have results, verify the structure
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

    it("should filter conversations with a limit", async () => {
      // Act
      const limit = 2;
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getRecentConversations({
        limit,
      });

      // Assert
      expect(result.length).toBeLessThanOrEqual(limit);

      // Verify the type of the returned data
      result.forEach((conversation) => {
        expect(typeof conversation.id).toBe("string");
      });
    });
  });

  describe("getAgents", () => {
    it("should return data that conforms to Agent[] type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getAgents();

      // Assert
      expect(Array.isArray(result)).toBe(true);

      // Type verification
      const typeCheckResult: Agent[] = result;
      expect(typeCheckResult).toBeDefined();

      // If we have results, verify the structure
      if (result.length > 0) {
        const agent = result[0];
        expect(typeof agent.id).toBe("string");
        expect(typeof agent.name).toBe("string");
        expect(typeof agent.description).toBe("string");
        expect(Array.isArray(agent.capabilities)).toBe(true);
      }
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

      // If we have results, verify the structure
      if (result.length > 0) {
        const usageData = result[0];
        expect(typeof usageData.date).toBe("string");
        expect(typeof usageData.value).toBe("number");
      }
    });
  });

  // Test the remaining endpoints with similar pattern
  describe("getTools", () => {
    it("should return data that conforms to Tool[] type", async () => {
      // Act
      const caller = dashboardRouter.createCaller(ctx);
      const result = await caller.getTools();

      // Assert
      expect(Array.isArray(result)).toBe(true);

      // Type verification
      const typeCheckResult: Tool[] = result;
      expect(typeCheckResult).toBeDefined();

      // If we have results, verify the structure
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

      // Type verification
      const typeCheckResult: Model[] = result;
      expect(typeCheckResult).toBeDefined();

      // If we have results, verify the structure
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

      // Type verification
      const typeCheckResult: TestMessage[] = result;
      expect(typeCheckResult).toBeDefined();

      // If we have results, verify the structure
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

      // Type verification
      const typeCheckResult: AgentTemplate[] = result;
      expect(typeCheckResult).toBeDefined();

      // If we have results, verify the structure
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
