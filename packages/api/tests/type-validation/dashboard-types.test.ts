import { describe, it, expect } from "vitest";
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
import {
  mockOrganizationInfo,
  mockRecentConversations,
  mockAgents,
  mockUsageData,
  mockTools,
  mockModels,
  mockTestMessages,
  mockAgentTemplates,
} from "../../src/mock/dashboard";

/**
 * These tests validate that the mock data conforms to the expected types.
 * This is important to ensure that the API returns data that matches the
 * shared type definitions in @vernisai/types.
 */
describe("Dashboard Type Validation", () => {
  describe("OrganizationInfo", () => {
    it("should validate that mockOrganizationInfo matches OrganizationInfo type", () => {
      // Type assertion
      const typeCheckedData: OrganizationInfo = mockOrganizationInfo;
      expect(typeCheckedData).toBeDefined();

      // Validate required properties
      expect(typeof mockOrganizationInfo.name).toBe("string");
      expect(typeof mockOrganizationInfo.activeUsers).toBe("number");
      expect(typeof mockOrganizationInfo.usagePercent).toBe("number");
      expect(
        mockOrganizationInfo.createdAt instanceof Date ||
          typeof mockOrganizationInfo.createdAt === "string",
      ).toBe(true);
    });
  });

  describe("ConversationSummary", () => {
    it("should validate that mockRecentConversations matches ConversationSummary[] type", () => {
      // Type assertion
      const typeCheckedData: ConversationSummary[] = mockRecentConversations;
      expect(typeCheckedData).toBeDefined();
      expect(Array.isArray(mockRecentConversations)).toBe(true);

      // Validate data for each item
      mockRecentConversations.forEach((conversation) => {
        expect(typeof conversation.id).toBe("string");
        expect(typeof conversation.title).toBe("string");
        expect(typeof conversation.model).toBe("string");
        expect(typeof conversation.snippet).toBe("string");
        expect(
          conversation.lastMessageAt instanceof Date ||
            typeof conversation.lastMessageAt === "string",
        ).toBe(true);
      });
    });
  });

  describe("Agent", () => {
    it("should validate that mockAgents matches Agent[] type", () => {
      // Type assertion
      const typeCheckedData: Agent[] = mockAgents;
      expect(typeCheckedData).toBeDefined();
      expect(Array.isArray(mockAgents)).toBe(true);

      // Validate data for each item
      mockAgents.forEach((agent) => {
        expect(typeof agent.id).toBe("string");
        expect(typeof agent.name).toBe("string");
        expect(typeof agent.description).toBe("string");
        expect(Array.isArray(agent.capabilities)).toBe(true);
      });
    });
  });

  describe("UsageData", () => {
    it("should validate that mockUsageData matches UsageData[] type", () => {
      // Type assertion
      const typeCheckedData: UsageData[] = mockUsageData;
      expect(typeCheckedData).toBeDefined();
      expect(Array.isArray(mockUsageData)).toBe(true);

      // Validate data for each item
      mockUsageData.forEach((data) => {
        expect(typeof data.date).toBe("string");
        expect(typeof data.value).toBe("number");
      });
    });
  });

  describe("Tool", () => {
    it("should validate that mockTools matches Tool[] type", () => {
      // Type assertion
      const typeCheckedData: Tool[] = mockTools;
      expect(typeCheckedData).toBeDefined();
      expect(Array.isArray(mockTools)).toBe(true);

      // Validate data for each item
      mockTools.forEach((tool) => {
        expect(typeof tool.id).toBe("string");
        expect(typeof tool.name).toBe("string");
        expect(typeof tool.description).toBe("string");
      });
    });
  });

  describe("Model", () => {
    it("should validate that mockModels matches Model[] type", () => {
      // Type assertion
      const typeCheckedData: Model[] = mockModels;
      expect(typeCheckedData).toBeDefined();
      expect(Array.isArray(mockModels)).toBe(true);

      // Validate data for each item
      mockModels.forEach((model) => {
        expect(typeof model.id).toBe("string");
        expect(typeof model.name).toBe("string");
        expect(typeof model.provider).toBe("string");
        expect(Array.isArray(model.capabilities)).toBe(true);
        expect(typeof model.contextLength).toBe("number");
      });
    });
  });

  describe("TestMessage", () => {
    it("should validate that mockTestMessages matches TestMessage[] type", () => {
      // Type assertion
      const typeCheckedData: TestMessage[] = mockTestMessages;
      expect(typeCheckedData).toBeDefined();
      expect(Array.isArray(mockTestMessages)).toBe(true);

      // Validate data for each item
      mockTestMessages.forEach((message) => {
        expect(typeof message.id).toBe("string");
        expect(typeof message.content).toBe("string");
        expect(message.role === "user" || message.role === "assistant").toBe(
          true,
        );
        expect(
          message.timestamp instanceof Date ||
            typeof message.timestamp === "string",
        ).toBe(true);
      });
    });
  });

  describe("AgentTemplate", () => {
    it("should validate that mockAgentTemplates matches AgentTemplate[] type", () => {
      // Type assertion
      const typeCheckedData: AgentTemplate[] = mockAgentTemplates;
      expect(typeCheckedData).toBeDefined();
      expect(Array.isArray(mockAgentTemplates)).toBe(true);

      // Validate data for each item
      mockAgentTemplates.forEach((template) => {
        expect(typeof template.id).toBe("string");
        expect(typeof template.name).toBe("string");
        expect(typeof template.description).toBe("string");
        expect(typeof template.systemPrompt).toBe("string");
        expect(Array.isArray(template.recommendedTools)).toBe(true);
        expect(typeof template.model).toBe("string");
      });
    });
  });
});
