import { describe, it, expect, vi, beforeEach } from "vitest";
import * as Sentry from "@sentry/react";
import {
  initSentry,
  setUserContext,
  clearUserContext,
  captureException,
  userHasGivenConsent,
  updateErrorReportingConsent,
} from "./sentry";

// Must be defined before the mock to fix the TypeScript error
const mockedConfigureScope = vi.fn();

// Mock Sentry modules
vi.mock("@sentry/react", () => ({
  init: vi.fn(),
  setUser: vi.fn(),
  configureScope: mockedConfigureScope,
  withScope: vi.fn((cb) => cb({ setExtra: vi.fn() })),
  captureException: vi.fn(),
  ErrorBoundary: vi.fn(),
}));

vi.mock("@sentry/tracing", () => ({
  BrowserTracing: vi.fn(),
}));

// Mock console to prevent log output
vi.spyOn(console, "info").mockImplementation(() => {});

describe("Sentry Utils", () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    // Setup environment mock values
    Object.defineProperty(import.meta.env, "VITE_SENTRY_DSN", {
      value: "test-dsn",
      configurable: true,
    });

    Object.defineProperty(import.meta.env, "VITE_SENTRY_ENVIRONMENT", {
      value: "test",
      configurable: true,
    });
  });

  it("should initialize Sentry with correct configuration", () => {
    initSentry();

    expect(Sentry.init).toHaveBeenCalled();
  });

  it("should not initialize Sentry in development mode", () => {
    // Change environment to development
    Object.defineProperty(import.meta.env, "VITE_SENTRY_ENVIRONMENT", {
      value: "development",
      configurable: true,
    });

    initSentry();

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("should set user context", () => {
    const user = { id: "test-id", email: "test@example.com" };

    setUserContext(user);

    expect(Sentry.setUser).toHaveBeenCalledWith(user);
  });

  it("should clear user context", () => {
    clearUserContext();

    expect(mockedConfigureScope).toHaveBeenCalled();
  });

  it("should capture exceptions with context", () => {
    const error = new Error("Test error");
    const context = { additional: "info" };

    captureException(error, context);

    expect(Sentry.withScope).toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

  it("should check user consent from localStorage", () => {
    localStorageMock.getItem.mockReturnValueOnce("true");

    expect(userHasGivenConsent()).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(
      "errorReportingConsent",
    );
  });

  it("should update user consent in localStorage", () => {
    updateErrorReportingConsent(true);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "errorReportingConsent",
      "true",
    );
  });
});
