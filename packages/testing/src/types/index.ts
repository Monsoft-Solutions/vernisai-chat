/**
 * Common types for testing utilities
 */

/**
 * Test context with setup and teardown capabilities
 */
export type TestContext = {
  /**
   * Called before each test runs
   */
  setup?: () => void | Promise<void>;
  /**
   * Called after each test completes
   */
  teardown?: () => void | Promise<void>;
};

/**
 * Options for mock services and data
 */
export type MockOptions = {
  /**
   * Whether the mock should simulate errors
   */
  shouldError?: boolean;
  /**
   * Delay in ms to simulate network or processing time
   */
  delay?: number;
};

/**
 * Base fixture interface
 */
export type Fixture<T = unknown> = {
  /**
   * Unique identifier for the fixture
   */
  id: string;
  /**
   * Data contained in the fixture
   */
  data: T;
};

/**
 * User fixture data
 */
export type UserFixture = Fixture<{
  id: string;
  name: string;
  email: string;
  role: string;
}>;

/**
 * Conversation fixture data
 */
export type ConversationFixture = Fixture<{
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  messages: MessageFixture[];
}>;

/**
 * Message fixture data
 */
export type MessageFixture = Fixture<{
  id: string;
  conversationId: string;
  content: string;
  role: "user" | "assistant" | "system";
  createdAt: Date;
}>;

/**
 * Generic database record type
 */
export type DatabaseRecord = {
  id: string;
  [key: string]: unknown;
};

/**
 * Database mock configuration
 */
export type DatabaseMockConfig = {
  users?: DatabaseRecord[];
  conversations?: DatabaseRecord[];
  messages?: DatabaseRecord[];
  [key: string]: DatabaseRecord[] | undefined;
};

/**
 * API response mock shape
 */
export type ApiResponseMock<T = unknown> = {
  status: number;
  data?: T;
  error?: string;
  headers?: Record<string, string>;
};
