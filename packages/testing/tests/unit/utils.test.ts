/**
 * Unit tests for testing utilities
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  delay,
  generateTestId,
  createDelayedMock,
  createErrorMock,
} from "../../src/utils";

describe("Testing Utilities", () => {
  describe("generateTestId", () => {
    it("should generate a unique ID with default prefix", () => {
      const id = generateTestId();
      expect(id).toMatch(/^test-[a-z0-9]{8}$/);
    });

    it("should generate a unique ID with custom prefix", () => {
      const id = generateTestId("custom");
      expect(id).toMatch(/^custom-[a-z0-9]{8}$/);
    });

    it("should generate unique IDs", () => {
      const id1 = generateTestId();
      const id2 = generateTestId();
      expect(id1).not.toBe(id2);
    });
  });

  describe("delay", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("should delay execution for the specified time", async () => {
      const callback = vi.fn();

      const promise = delay(1000).then(callback);

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      await Promise.resolve();
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      await Promise.resolve();
      await promise;

      expect(callback).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  describe("createDelayedMock", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("should return a function that resolves with the value after delay", async () => {
      const mockFn = createDelayedMock("test value", 500);

      const promise = mockFn();

      vi.advanceTimersByTime(500);

      const result = await promise;
      expect(result).toBe("test value");

      vi.useRealTimers();
    });
  });

  describe("createErrorMock", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("should return a function that rejects with an error after delay", async () => {
      const mockFn = createErrorMock("test error", 500);

      const promise = mockFn();

      vi.advanceTimersByTime(500);

      await expect(promise).rejects.toThrow("test error");

      vi.useRealTimers();
    });
  });
});
