import { UserFixture, ConversationFixture, MessageFixture } from "../types";

/**
 * Creates test user fixtures
 *
 * @param count - Number of users to create
 * @returns Array of user fixtures
 */
export function createUserFixtures(count = 1): UserFixture[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: `user-${index + 1}`,
    data: {
      id: `user-${index + 1}`,
      name: `Test User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      role: index === 0 ? "admin" : "user",
    },
  }));
}

/**
 * Creates test message fixtures
 *
 * @param conversationId - Parent conversation ID
 * @param count - Number of messages to create
 * @returns Array of message fixtures
 */
export function createMessageFixtures(
  conversationId: string,
  count = 3,
): MessageFixture[] {
  return Array.from({ length: count }).map((_, index) => {
    const role = index % 2 === 0 ? "user" : "assistant";
    const isFirst = index === 0;

    return {
      id: `message-${conversationId}-${index + 1}`,
      data: {
        id: `message-${conversationId}-${index + 1}`,
        conversationId,
        content:
          isFirst && role === "user"
            ? "Hello, I have a question."
            : role === "user"
              ? "Can you explain this further?"
              : "I'm an AI assistant, how can I help you?",
        role,
        createdAt: new Date(Date.now() - (count - index) * 60000),
      },
    };
  });
}

/**
 * Creates test conversation fixtures
 *
 * @param userId - Owner user ID
 * @param count - Number of conversations to create
 * @returns Array of conversation fixtures
 */
export function createConversationFixtures(
  userId: string,
  count = 2,
): ConversationFixture[] {
  return Array.from({ length: count }).map((_, index) => {
    const id = `conversation-${index + 1}`;
    const messageFixtures = createMessageFixtures(id);

    return {
      id,
      data: {
        id,
        title: `Test Conversation ${index + 1}`,
        userId,
        createdAt: new Date(Date.now() - (count - index) * 3600000),
        messages: messageFixtures,
      },
    };
  });
}

/**
 * Creates a complete chat scenario with users, conversations, and messages
 *
 * @returns Test scenario with all fixtures
 */
export function createChatScenario() {
  const users = createUserFixtures(2);
  const userId = users[0].data.id;

  const conversations = createConversationFixtures(userId);
  const messages = conversations.flatMap((c) =>
    createMessageFixtures(c.data.id, 3),
  );

  return {
    users: users.map((u) => u.data),
    conversations: conversations.map((c) => c.data),
    messages: messages.map((m) => m.data),
  };
}

export const fixtures = {
  createUserFixtures,
  createConversationFixtures,
  createMessageFixtures,
  createChatScenario,
};
