import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// Import these types from UI package to ensure consistency
import type { ChatSession, Tool } from "@vernisai/ui";

// Mock tools data
const mockTools: Tool[] = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for real-time information",
    icon: "search",
  },
  {
    id: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute and analyze code snippets",
    icon: "code",
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    description: "Access VernisAI's internal knowledge",
    icon: "database",
  },
  {
    id: "file-browser",
    name: "File Browser",
    description: "Browse and analyze uploaded files",
    icon: "file",
  },
  {
    id: "image-generator",
    name: "Image Generator",
    description: "Generate images based on text descriptions",
    icon: "image",
  },
];

// Helper function to create timestamps relative to now
const getRelativeTime = (minutesAgo: number): Date => {
  return new Date(Date.now() - minutesAgo * 60 * 1000);
};

// Mock web search tool usage
const webSearchToolUsage = {
  toolName: "Web Search",
  toolInput: "latest advancements in AI safety",
  toolOutput: {
    results: [
      {
        title: "AI Safety Research: Recent Developments",
        snippet:
          "The field of AI safety has seen significant growth with new frameworks for evaluating LLM risks...",
        url: "https://example.com/ai-safety",
      },
      {
        title: "Alignment Techniques for Large Language Models",
        snippet:
          "Researchers have developed improved methods for aligning AI systems with human values...",
        url: "https://example.com/alignment",
      },
    ],
  },
};

// Mock code interpreter tool usage
const codeInterpreterToolUsage = {
  toolName: "Code Interpreter",
  toolInput: "Write a Python function to calculate Fibonacci numbers",
  toolOutput: {
    code: `def fibonacci(n):
    if n <= 0:
        return []
    if n == 1:
        return [0]
    if n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib

# Example usage
print(fibonacci(10))`,
    result: "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
    execution_time: "0.003s",
  },
};

// Mock chat sessions
const mockChatSessions: ChatSession[] = [
  {
    id: "chat-1",
    name: "AI Safety Discussion",
    agentName: "VernisAI Research Assistant",
    agentDescription:
      "Specialized in AI research topics and academic discussions",
    createdAt: getRelativeTime(2880), // 2 days ago
    updatedAt: getRelativeTime(60), // 1 hour ago
    messages: [
      {
        id: "msg-1-1",
        content:
          "Hello! I'm interested in learning about recent developments in AI safety. Can you help me understand the current state of the field?",
        sender: "user",
        timestamp: getRelativeTime(120),
        status: "sent",
      },
      {
        id: "msg-1-2",
        content:
          "I'd be happy to help you understand the current state of AI safety research. Let me search for the most recent developments.",
        sender: "assistant",
        timestamp: getRelativeTime(119),
        status: "sent",
      },
      {
        id: "msg-1-3",
        content:
          "Based on recent research, AI safety has several key focus areas:\n\n1. **Alignment**: Ensuring AI systems act according to human values and intentions\n2. **Interpretability**: Making AI decision-making processes understandable to humans\n3. **Robustness**: Building systems that perform well even in unexpected situations\n4. **Monitoring**: Developing tools to detect when AI systems might be causing harm\n\nRecent advances include better evaluation frameworks for large language models and new techniques for red-teaming AI systems to discover potential vulnerabilities.",
        sender: "assistant",
        timestamp: getRelativeTime(118),
        status: "sent",
        toolUsage: [webSearchToolUsage],
      },
      {
        id: "msg-1-4",
        content:
          "That's helpful. Could you elaborate on alignment techniques specifically?",
        sender: "user",
        timestamp: getRelativeTime(100),
        status: "sent",
      },
      {
        id: "msg-1-5",
        content:
          "Certainly! Alignment techniques for AI systems have evolved significantly:\n\n**Current Alignment Approaches:**\n\n1. **Reinforcement Learning from Human Feedback (RLHF)**: Training models based on human evaluations of outputs\n2. **Constitutional AI**: Creating systems with built-in constraints based on human values\n3. **Debate-based methods**: Having AI systems critique each other to identify flaws\n4. **Process supervision**: Evaluating not just outputs but the reasoning process\n\nResearchers are increasingly focused on scalable oversight - finding ways to supervise AI systems that may become more capable than human evaluators in certain domains.\n\nWould you like me to explain any of these approaches in more detail?",
        sender: "assistant",
        timestamp: getRelativeTime(95),
        status: "sent",
      },
    ],
  },
  {
    id: "chat-2",
    name: "Python Programming Help",
    agentName: "VernisAI Code Assistant",
    agentDescription:
      "Expert in software development and programming assistance",
    createdAt: getRelativeTime(1440), // 1 day ago
    updatedAt: getRelativeTime(30), // 30 minutes ago
    messages: [
      {
        id: "msg-2-1",
        content:
          "I need help writing an efficient algorithm for generating Fibonacci numbers in Python. Can you show me some options?",
        sender: "user",
        timestamp: getRelativeTime(45),
        status: "sent",
      },
      {
        id: "msg-2-2",
        content:
          "I'd be happy to help you with Fibonacci algorithms in Python. Let me provide a few implementations with different efficiency characteristics.",
        sender: "assistant",
        timestamp: getRelativeTime(44),
        status: "sent",
      },
      {
        id: "msg-2-3",
        content:
          "Here's a comparison of different Fibonacci implementations:\n\n1. **Basic recursive approach** - Simple but inefficient (exponential time complexity):\n```python\ndef fib_recursive(n):\n    if n <= 1:\n        return n\n    return fib_recursive(n-1) + fib_recursive(n-2)\n```\n\n2. **Dynamic programming approach** - Much more efficient (linear time complexity):\n```python\ndef fib_dynamic(n):\n    if n <= 0:\n        return []\n    if n == 1:\n        return [0]\n    if n == 2:\n        return [0, 1]\n    \n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    \n    return fib\n```\n\n3. **Matrix exponentiation approach** - Even more efficient for very large numbers (logarithmic time complexity):\n```python\nimport numpy as np\n\ndef fib_matrix(n):\n    F = np.array([[1, 1], [1, 0]])\n    if n == 0:\n        return 0\n    power(F, n-1)\n    return F[0][0]\n    \ndef power(F, n):\n    if n == 0 or n == 1:\n        return\n    M = np.array([[1, 1], [1, 0]])\n    power(F, n//2)\n    F = np.matmul(F, F)\n    if n % 2 != 0:\n        F = np.matmul(F, M)\n```\n\nThe dynamic programming approach is usually the best balance between simplicity and efficiency for most practical applications.",
        sender: "assistant",
        timestamp: getRelativeTime(43),
        status: "sent",
        toolUsage: [codeInterpreterToolUsage],
      },
      {
        id: "msg-2-4",
        content:
          "This is great! Can I see an example of the dynamic programming approach running with n=10?",
        sender: "user",
        timestamp: getRelativeTime(40),
        status: "sent",
      },
      {
        id: "msg-2-5",
        content:
          "Certainly! Here's the dynamic programming approach with n=10:\n\n```python\ndef fibonacci(n):\n    if n <= 0:\n        return []\n    if n == 1:\n        return [0]\n    if n == 2:\n        return [0, 1]\n    \n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    \n    return fib\n\n# Example with n=10\nprint(fibonacci(10))\n```\n\nOutput:\n```\n[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n```\n\nThis generates the first 10 Fibonacci numbers, starting with 0 and 1. Each subsequent number is the sum of the two preceding numbers, as you can verify in the output sequence.",
        sender: "assistant",
        timestamp: getRelativeTime(38),
        status: "sent",
      },
    ],
  },
  {
    id: "chat-3",
    name: "Marketing Strategy",
    agentName: "VernisAI Business Advisor",
    agentDescription: "Helps with business strategy, marketing, and growth",
    createdAt: getRelativeTime(720), // 12 hours ago
    updatedAt: getRelativeTime(15), // 15 minutes ago
    messages: [
      {
        id: "msg-3-1",
        content:
          "I'm launching a new SaaS product in the project management space. What marketing channels should I focus on?",
        sender: "user",
        timestamp: getRelativeTime(20),
        status: "sent",
      },
      {
        id: "msg-3-2",
        content:
          "For a new SaaS product in the project management space, you'll want to consider several marketing channels. Let me outline the most effective ones based on current industry trends.",
        sender: "assistant",
        timestamp: getRelativeTime(19),
        status: "sent",
      },
      {
        id: "msg-3-3",
        content:
          'Here are the recommended marketing channels for your project management SaaS product:\n\n1. **Content Marketing**\n   - Industry-specific blog posts about productivity and project management\n   - Case studies demonstrating ROI and efficiency gains\n   - Comparison guides positioning your product against competitors\n\n2. **SEO Strategy**\n   - Target keywords like "project management software," "team collaboration tools"\n   - Focus on long-tail keywords showing buyer intent\n\n3. **Email Marketing**\n   - Drip campaigns for leads introducing product features\n   - Newsletter with project management tips and updates\n\n4. **Social Media**\n   - LinkedIn for B2B audience targeting\n   - Twitter for engagement with industry conversations\n\n5. **Partnerships & Integrations**\n   - Develop integrations with complementary tools (Slack, Microsoft Office, etc.)\n   - Partner with consultants who can recommend your tool\n\n6. **Paid Acquisition**\n   - Google Ads targeting specific search terms\n   - LinkedIn Ads for precise B2B targeting\n\n7. **Community Building**\n   - Create a user community forum\n   - Host webinars on project management topics\n\nBased on industry benchmarks, content marketing combined with SEO typically yields the highest ROI for SaaS products in this space. Would you like me to elaborate on any specific channel?',
        sender: "assistant",
        timestamp: getRelativeTime(18),
        status: "sent",
      },
    ],
  },
];

// Default new chat session template
const newChatSessionTemplate: ChatSession = {
  id: "new",
  name: "New Conversation",
  agentName: "VernisAI Assistant",
  agentDescription:
    "A helpful AI assistant that can answer questions and perform tasks.",
  messages: [
    {
      id: "welcome-msg",
      content: "Hello! I'm your VernisAI Assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
      status: "sent",
    },
  ],
};

/**
 * Chat router with chat-related endpoints
 */
export const chatRouter = router({
  /**
   * Get all available tools
   */
  getTools: publicProcedure.query(() => {
    try {
      // Artificially delay response for 500ms to simulate network latency
      return new Promise<Tool[]>((resolve) => {
        setTimeout(() => {
          resolve(mockTools);
        }, 500);
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve tools",
        cause: error,
      });
    }
  }),

  /**
   * Get all chat sessions
   */
  getSessions: publicProcedure.query(() => {
    try {
      // Artificially delay response for 800ms to simulate network latency
      return new Promise<ChatSession[]>((resolve) => {
        setTimeout(() => {
          resolve(mockChatSessions);
        }, 800);
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve chat sessions",
        cause: error,
      });
    }
  }),

  /**
   * Get a specific chat session by ID
   */
  getSessionById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      try {
        // Artificially delay response for 600ms to simulate network latency
        return new Promise<ChatSession | null>((resolve) => {
          setTimeout(() => {
            if (input.id === "new") {
              // Return a new chat template with unique ID
              resolve({
                ...newChatSessionTemplate,
                id: `new-${Date.now()}`,
              });
            } else {
              const session = mockChatSessions.find((s) => s.id === input.id);
              resolve(session || null);
            }
          }, 600);
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve chat session",
          cause: error,
        });
      }
    }),

  /**
   * Send a message in a chat session
   */
  sendMessage: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(({ input }) => {
      try {
        // This would actually send the message to the backend and get a response
        // For now, we'll just return a mock confirmation
        return {
          success: true,
          messageId: `msg-${Date.now()}`,
          sessionId: input.sessionId,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message",
          cause: error,
        });
      }
    }),
});
