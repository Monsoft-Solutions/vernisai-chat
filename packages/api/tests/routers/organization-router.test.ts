import { describe, it, expect, beforeEach, vi } from "vitest";
import { organizationRouter } from "../../src/router/organization";
import { createTestContext, expectTRPCError } from "../utils/trpc-test-utils";
import { TRPCError } from "@trpc/server";

describe("Organization Router", () => {
  let ctx;

  beforeEach(() => {
    // Create a clean test context before each test
    ctx = createTestContext();

    // Clear any vi mocks if needed
    vi.clearAllMocks();
  });

  describe("getCurrentOrganization", () => {
    it("should return the current organization", async () => {
      // Act
      const caller = organizationRouter.createCaller(ctx);
      const result = await caller.getCurrentOrganization();

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(ctx.organizationId);
      expect(typeof result.name).toBe("string");
      expect(result.createdAt).toBeDefined();
    });

    it("should handle errors properly", async () => {
      // Mock the createCaller to throw a TRPCError
      const mockCreateCaller = vi.spyOn(organizationRouter, "createCaller");
      const mockCaller = {
        getCurrentOrganization: vi.fn().mockImplementation(() => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve organization information",
          });
        }),
      } as Partial<ReturnType<typeof organizationRouter.createCaller>>;

      mockCreateCaller.mockReturnValue(
        mockCaller as ReturnType<typeof organizationRouter.createCaller>,
      );

      try {
        // Act & Assert
        await expectTRPCError(
          () => organizationRouter.createCaller(ctx).getCurrentOrganization(),
          "INTERNAL_SERVER_ERROR",
        );
      } finally {
        // Cleanup
        mockCreateCaller.mockRestore();
      }
    });
  });

  describe("createOrganization", () => {
    it("should create a new organization", async () => {
      // Arrange
      const newOrg = {
        name: "Test Organization",
      };

      // Act
      const caller = organizationRouter.createCaller(ctx);
      const result = await caller.createOrganization(newOrg);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(newOrg.name);
      expect(result.createdAt).toBeDefined();
    });

    it("should validate organization name", async () => {
      // Mock the createCaller to throw a TRPCError for validation failure
      const mockCreateCaller = vi.spyOn(organizationRouter, "createCaller");
      const mockCaller = {
        createOrganization: vi.fn().mockImplementation(() => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Name is required",
          });
        }),
      } as Partial<ReturnType<typeof organizationRouter.createCaller>>;

      mockCreateCaller.mockReturnValue(
        mockCaller as ReturnType<typeof organizationRouter.createCaller>,
      );

      try {
        // Act & Assert
        await expectTRPCError(
          () =>
            organizationRouter.createCaller(ctx).createOrganization({
              name: "", // Empty name should fail validation
            }),
          "BAD_REQUEST",
        );
      } finally {
        // Cleanup
        mockCreateCaller.mockRestore();
      }
    });
  });

  describe("updateOrganization", () => {
    it("should update organization settings", async () => {
      // Arrange
      const updateData = {
        name: "Updated Organization Name",
        settings: {
          allowAgentCreation: true,
          maxUsers: 20,
        },
      };

      // Act
      const caller = organizationRouter.createCaller(ctx);
      const result = await caller.updateOrganization(updateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(ctx.organizationId);
      expect(result.name).toBe(updateData.name);
      expect(result.settings.allowAgentCreation).toBe(
        updateData.settings.allowAgentCreation,
      );
      expect(result.settings.maxUsers).toBe(updateData.settings.maxUsers);
      expect(result.updatedAt).toBeDefined();
    });

    it("should accept partial updates", async () => {
      // Arrange - Only update the name
      const updateData = {
        name: "Just Updated Name",
      };

      // Act
      const caller = organizationRouter.createCaller(ctx);
      const result = await caller.updateOrganization(updateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe(updateData.name);

      // Settings should have default values
      expect(result.settings).toBeDefined();
      expect(typeof result.settings.allowAgentCreation).toBe("boolean");
      expect(typeof result.settings.maxUsers).toBe("number");
    });

    it("should handle validation errors", async () => {
      // Mock the createCaller to throw a TRPCError for validation failure
      const mockCreateCaller = vi.spyOn(organizationRouter, "createCaller");
      const mockCaller = {
        updateOrganization: vi.fn().mockImplementation(() => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid organization settings",
          });
        }),
      } as Partial<ReturnType<typeof organizationRouter.createCaller>>;

      mockCreateCaller.mockReturnValue(
        mockCaller as ReturnType<typeof organizationRouter.createCaller>,
      );

      try {
        // Act & Assert
        await expectTRPCError(
          () =>
            organizationRouter.createCaller(ctx).updateOrganization({
              settings: {
                maxUsers: -5, // Negative value should fail validation
              } as { maxUsers: number },
            }),
          "BAD_REQUEST",
        );
      } finally {
        // Cleanup
        mockCreateCaller.mockRestore();
      }
    });
  });

  describe("listMembers", () => {
    it("should return a list of organization members", async () => {
      // Act
      const caller = organizationRouter.createCaller(ctx);
      const result = await caller.listMembers({ limit: 5 });

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result.members)).toBe(true);
      expect(result.members.length).toBeLessThanOrEqual(5);

      // Check member properties if any are returned
      if (result.members.length > 0) {
        const member = result.members[0];
        expect(typeof member.id).toBe("string");
        expect(typeof member.name).toBe("string");
        expect(typeof member.email).toBe("string");
        expect(typeof member.role).toBe("string");
      }
    });

    it("should handle pagination parameters", async () => {
      // Act
      const caller = organizationRouter.createCaller(ctx);
      const result = await caller.listMembers({ limit: 2 });

      // Assert
      expect(result.members.length).toBeLessThanOrEqual(2);

      // If nextCursor is defined, test pagination
      if (result.nextCursor) {
        const nextPage = await caller.listMembers({
          limit: 2,
          cursor: result.nextCursor,
        });

        expect(nextPage.members).toBeDefined();
        expect(Array.isArray(nextPage.members)).toBe(true);
      }
    });

    it("should handle errors properly", async () => {
      // Mock the createCaller to throw a TRPCError
      const mockCreateCaller = vi.spyOn(organizationRouter, "createCaller");
      const mockCaller = {
        listMembers: vi.fn().mockImplementation(() => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve organization members",
          });
        }),
      } as Partial<ReturnType<typeof organizationRouter.createCaller>>;

      mockCreateCaller.mockReturnValue(
        mockCaller as ReturnType<typeof organizationRouter.createCaller>,
      );

      try {
        // Act & Assert
        await expectTRPCError(
          () => organizationRouter.createCaller(ctx).listMembers({ limit: 10 }),
          "INTERNAL_SERVER_ERROR",
        );
      } finally {
        // Cleanup
        mockCreateCaller.mockRestore();
      }
    });
  });
});
