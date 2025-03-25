import type { ChatSession, MessageSender, Tool, ToolUsage } from "@vernisai/ui";

// Mock tools data
export const mockTools: Tool[] = [
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
const webSearchToolUsage: ToolUsage = {
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
const codeInterpreterToolUsage: ToolUsage = {
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
export const mockChatSessions: ChatSession[] = [
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
        sender: "user" as MessageSender,
        timestamp: getRelativeTime(120),
        status: "sent",
      },
      {
        id: "msg-1-2",
        content:
          "I'd be happy to help you understand the current state of AI safety research. Let me search for the most recent developments.",
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(119),
        status: "sent",
      },
      {
        id: "msg-1-3",
        content:
          "Based on recent research, AI safety has several key focus areas:\n\n1. **Alignment**: Ensuring AI systems act according to human values and intentions\n2. **Interpretability**: Making AI decision-making processes understandable to humans\n3. **Robustness**: Building systems that perform well even in unexpected situations\n4. **Monitoring**: Developing tools to detect when AI systems might be causing harm\n\nRecent advances include better evaluation frameworks for large language models and new techniques for red-teaming AI systems to discover potential vulnerabilities.",
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(118),
        status: "sent",
        toolUsage: [webSearchToolUsage],
      },
      {
        id: "msg-1-4",
        content:
          "That's helpful. Could you elaborate on alignment techniques specifically?",
        sender: "user" as MessageSender,
        timestamp: getRelativeTime(100),
        status: "sent",
      },
      {
        id: "msg-1-5",
        content:
          "Certainly! Alignment techniques for AI systems have evolved significantly:\n\n**Current Alignment Approaches:**\n\n1. **Reinforcement Learning from Human Feedback (RLHF)**: Training models based on human evaluations of outputs\n2. **Constitutional AI**: Creating systems with built-in constraints based on human values\n3. **Debate-based methods**: Having AI systems critique each other to identify flaws\n4. **Process supervision**: Evaluating not just outputs but the reasoning process\n\nResearchers are increasingly focused on scalable oversight - finding ways to supervise AI systems that may become more capable than human evaluators in certain domains.\n\nWould you like me to explain any of these approaches in more detail?",
        sender: "assistant" as MessageSender,
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
        sender: "user" as MessageSender,
        timestamp: getRelativeTime(45),
        status: "sent",
      },
      {
        id: "msg-2-2",
        content:
          "I'd be happy to help you with Fibonacci algorithms in Python. Let me provide a few implementations with different efficiency characteristics.",
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(44),
        status: "sent",
      },
      {
        id: "msg-2-3",
        content:
          "Here's a comparison of different Fibonacci implementations:\n\n1. **Basic recursive approach** - Simple but inefficient (exponential time complexity):\n```python\ndef fib_recursive(n):\n    if n <= 1:\n        return n\n    return fib_recursive(n-1) + fib_recursive(n-2)\n```\n\n2. **Dynamic programming approach** - Much more efficient (linear time complexity):\n```python\ndef fib_dynamic(n):\n    if n <= 0:\n        return []\n    if n == 1:\n        return [0]\n    if n == 2:\n        return [0, 1]\n    \n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    \n    return fib\n```\n\n3. **Matrix exponentiation approach** - Even more efficient for very large numbers (logarithmic time complexity):\n```python\nimport numpy as np\n\ndef fib_matrix(n):\n    F = np.array([[1, 1], [1, 0]])\n    if n == 0:\n        return 0\n    power(F, n-1)\n    return F[0][0]\n    \ndef power(F, n):\n    if n == 0 or n == 1:\n        return\n    M = np.array([[1, 1], [1, 0]])\n    power(F, n//2)\n    F = np.matmul(F, F)\n    if n % 2 != 0:\n        F = np.matmul(F, M)\n```\n\nThe dynamic programming approach is usually the best balance between simplicity and efficiency for most practical applications.",
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(43),
        status: "sent",
        toolUsage: [codeInterpreterToolUsage],
      },
      {
        id: "msg-2-4",
        content:
          "This is great! Can I see an example of the dynamic programming approach running with n=10?",
        sender: "user" as MessageSender,
        timestamp: getRelativeTime(40),
        status: "sent",
      },
      {
        id: "msg-2-5",
        content:
          "Certainly! Here's the dynamic programming approach with n=10:\n\n```python\ndef fibonacci(n):\n    if n <= 0:\n        return []\n    if n == 1:\n        return [0]\n    if n == 2:\n        return [0, 1]\n    \n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    \n    return fib\n\n# Example with n=10\nprint(fibonacci(10))\n```\n\nOutput:\n```\n[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n```\n\nThis generates the first 10 Fibonacci numbers, starting with 0 and 1. Each subsequent number is the sum of the two preceding numbers, as you can verify in the output sequence.",
        sender: "assistant" as MessageSender,
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
        sender: "user" as MessageSender,
        timestamp: getRelativeTime(20),
        status: "sent",
      },
      {
        id: "msg-3-2",
        content:
          "For a new SaaS product in the project management space, you'll want to consider several marketing channels. Let me outline the most effective ones based on current industry trends.",
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(19),
        status: "sent",
      },
      {
        id: "msg-3-3",
        content:
          'Here are the recommended marketing channels for your project management SaaS product:\n\n1. **Content Marketing**\n   - Industry-specific blog posts about productivity and project management\n   - Case studies demonstrating ROI and efficiency gains\n   - Comparison guides positioning your product against competitors\n\n2. **SEO Strategy**\n   - Target keywords like "project management software," "team collaboration tools"\n   - Focus on long-tail keywords showing buyer intent\n\n3. **Email Marketing**\n   - Drip campaigns for leads introducing product features\n   - Newsletter with project management tips and updates\n\n4. **Social Media**\n   - LinkedIn for B2B audience targeting\n   - Twitter for engagement with industry conversations\n\n5. **Partnerships & Integrations**\n   - Develop integrations with complementary tools (Slack, Microsoft Office, etc.)\n   - Partner with consultants who can recommend your tool\n\n6. **Paid Acquisition**\n   - Google Ads targeting specific search terms\n   - LinkedIn Ads for precise B2B targeting\n\n7. **Community Building**\n   - Create a user community forum\n   - Host webinars on project management topics\n\nBased on industry benchmarks, content marketing combined with SEO typically yields the highest ROI for SaaS products in this space. Would you like me to elaborate on any specific channel?',
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(18),
        status: "sent",
      },
      {
        id: "msg-3-4",
        content:
          "This is very helpful! Could you give me more specific advice on content marketing? What types of content would work best?",
        sender: "user" as MessageSender,
        timestamp: getRelativeTime(16),
        status: "sent",
      },
      {
        id: "msg-3-5",
        content:
          'I\'d be happy to provide more specific advice on content marketing for your project management SaaS. Here are the most effective content types:\n\n**High-Performing Content Types:**\n\n1. **How-To Guides & Tutorials**\n   - "How to Reduce Project Completion Time by 30%"\n   - "Complete Guide to Agile Project Management"\n   - "Step-by-Step Tutorial: Setting Up Your First Project Dashboard"\n\n2. **Comparison Content**\n   - "Project Management Methodologies Compared: Agile vs. Waterfall vs. Kanban"\n   - "Top 10 Project Management Tools Compared"\n\n3. **Templates & Resources**\n   - Downloadable project plan templates\n   - Risk assessment worksheets\n   - Project budget calculators\n\n4. **Case Studies & Success Stories**\n   - Detailed case studies with metrics ("How Company X Increased Productivity by 45%")\n   - Industry-specific success stories\n\n5. **Industry Reports & Original Research**\n   - "State of Project Management in 2025"\n   - Original research on productivity factors\n\n6. **Problem-Solving Content**\n   - "Solving the 5 Biggest Challenges in Cross-Team Collaboration"\n   - "Overcoming Resource Allocation Problems"\n\n7. **Expert Interviews & Roundups**\n   - Interviews with project management experts\n   - Roundup posts featuring advice from industry leaders\n\n**Content Distribution Strategy:**\n\n- Repurpose blog content into multiple formats (infographics, videos, slide decks)\n- Create a consistent publishing schedule (2-3 quality pieces per month)\n- Use email newsletters to distribute content to subscribers\n- Share content in relevant industry groups and forums\n\nFor maximum impact, align your content calendar with your product\'s key features and the specific pain points your solution addresses.',
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(15),
        status: "sent",
      },
    ],
  },
  {
    id: "chat-4",
    name: "Travel Planning Assistant",
    agentName: "VernisAI Travel Planner",
    agentDescription:
      "Helps plan trips, find accommodations, and create itineraries",
    createdAt: getRelativeTime(4320), // 3 days ago
    updatedAt: getRelativeTime(4320), // No recent updates
    messages: [
      {
        id: "msg-4-1",
        content:
          "I'm planning a 5-day trip to Tokyo in April. Can you help me create an itinerary?",
        sender: "user" as MessageSender,
        timestamp: getRelativeTime(4320),
        status: "sent",
      },
      {
        id: "msg-4-2",
        content:
          "I'd be happy to help you create an itinerary for your 5-day trip to Tokyo in April! April is a beautiful time to visit as it's cherry blossom season. Let me create a balanced itinerary for you.",
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(4319),
        status: "sent",
      },
      {
        id: "msg-4-3",
        content:
          "# 5-Day Tokyo Itinerary (April)\n\n## Day 1: Arrival & Eastern Tokyo\n- **Morning**: Arrive at Narita/Haneda Airport, travel to hotel\n- **Afternoon**: Visit Senso-ji Temple in Asakusa\n- **Evening**: Explore Tokyo Skytree & Solamachi Mall\n- **Dinner**: Try local ramen at Asakusa's Ramen Street\n\n## Day 2: Traditional & Modern Tokyo\n- **Morning**: Imperial Palace Gardens (great for cherry blossoms)\n- **Afternoon**: Shopping in Ginza\n- **Evening**: Visit Shibuya Crossing & Shibuya Sky\n- **Dinner**: Izakaya experience in Ebisu\n\n## Day 3: Trendy Tokyo\n- **Morning**: Meiji Shrine & Yoyogi Park\n- **Afternoon**: Explore Harajuku & Takeshita Street\n- **Evening**: Shopping & dining in Omotesando\n- **Night**: Experience nightlife in Roppongi\n\n## Day 4: Cultural Day\n- **Morning**: Teamlab Borderless Digital Art Museum\n- **Afternoon**: Ueno Park & museums (cherry blossom viewing)\n- **Evening**: Akihabara Electric Town\n- **Dinner**: Conveyor belt sushi experience\n\n## Day 5: Day Trip Option\n- **Full day**: Choose one:\n  - Kamakura (temples, Big Buddha & nature)\n  - Hakone (Mt. Fuji views, hot springs)\n  - Tokyo DisneySea\n  - Nikko National Park\n\n## Transportation Tips:\n- Get a Suica/Pasmo card for easy subway access\n- Consider a 72-hour Tokyo Metro pass\n\n## Cherry Blossom Viewing Spots:\n- Ueno Park\n- Shinjuku Gyoen National Garden\n- Meguro River\n- Chidorigafuchi Park\n\nWould you like more specific recommendations for any of these days or information about accommodations?",
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(4318),
        status: "sent",
      },
    ],
  },
  {
    id: "chat-5",
    name: "Health and Nutrition",
    agentName: "VernisAI Wellness Guide",
    agentDescription:
      "Provides health information, nutrition guidance, and wellness tips",
    createdAt: getRelativeTime(180), // 3 hours ago
    updatedAt: getRelativeTime(5), // 5 minutes ago
    messages: [
      {
        id: "msg-5-1",
        content:
          "I'm trying to increase my protein intake while maintaining a vegetarian diet. Do you have any recommendations?",
        sender: "user" as MessageSender,
        timestamp: getRelativeTime(10),
        status: "sent",
      },
      {
        id: "msg-5-2",
        content:
          "I'd be happy to help you increase your protein intake on a vegetarian diet! This is definitely achievable with the right food choices.",
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(9),
        status: "sent",
      },
      {
        id: "msg-5-3",
        content:
          "# High-Protein Vegetarian Foods\n\n## Complete Protein Sources\n- **Eggs**: 6g protein per egg\n- **Greek yogurt**: 15-20g protein per cup\n- **Cottage cheese**: 25g protein per cup\n- **Milk**: 8g protein per cup\n- **Whey or plant protein powders**: 20-30g protein per scoop\n\n## Plant Protein Sources\n- **Legumes**:\n  - Lentils: 18g per cup (cooked)\n  - Chickpeas: 15g per cup\n  - Black beans: 15g per cup\n  - Tofu: 20g per cup\n  - Tempeh: 31g per cup\n  - Edamame: 17g per cup\n\n- **Grains**:\n  - Quinoa: 8g per cup\n  - Oats: 6g per cup\n  - Ezekiel bread: 4g per slice\n  - Wild rice: 7g per cup\n\n- **Nuts & Seeds**:\n  - Peanut butter: 8g per 2 tbsp\n  - Almonds: 6g per 1/4 cup\n  - Chia seeds: 5g per 2 tbsp\n  - Hemp seeds: 10g per 3 tbsp\n\n## Sample High-Protein Day (100g+ protein)\n\n**Breakfast**:\n- Greek yogurt parfait with berries, chia seeds, and walnuts (25g)\n\n**Lunch**:\n- Buddha bowl with quinoa, chickpeas, roasted vegetables, and tahini dressing (22g)\n\n**Snack**:\n- Protein smoothie with plant protein, milk, banana, and peanut butter (30g)\n\n**Dinner**:\n- Lentil pasta with vegetable sauce and nutritional yeast (25g)\n- Side salad with sunflower seeds (3g)\n\n**Evening Snack**:\n- Cottage cheese with fruit (13g)\n\nWould you like some specific recipes or meal prep ideas that incorporate these foods?",
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(8),
        status: "sent",
      },
      {
        id: "msg-5-4",
        content:
          "This is great information! Could you give me a few recipe ideas for high-protein lunches that I could meal prep for the work week?",
        sender: "user" as MessageSender,
        timestamp: getRelativeTime(7),
        status: "sent",
      },
      {
        id: "msg-5-5",
        content:
          "# 5 High-Protein Vegetarian Lunch Recipes for Meal Prep\n\n## 1. Mediterranean Quinoa Bowls (25g protein)\n\n**Ingredients (for 4 servings):**\n- 2 cups cooked quinoa\n- 2 cans (15oz each) chickpeas, drained and rinsed\n- 2 cups cherry tomatoes, halved\n- 1 cucumber, diced\n- 1 bell pepper, diced\n- 1/2 cup red onion, diced\n- 1/2 cup Kalamata olives, pitted\n- 8oz feta cheese, crumbled\n- 1/4 cup olive oil\n- 2 lemons, juiced\n- 2 tsp oregano\n- Salt and pepper to taste\n\n**Instructions:**\n1. Combine quinoa, chickpeas, and vegetables in a large bowl\n2. Whisk together olive oil, lemon juice, and spices for dressing\n3. Divide into containers, keeping dressing separate until ready to eat\n4. Top with feta cheese before serving\n\n## 2. High-Protein Mason Jar Salads (23g protein)\n\n**Ingredients (per jar):**\n- 2 tbsp balsamic vinaigrette (on bottom)\n- 1/4 cup cherry tomatoes\n- 1/4 cup cucumber\n- 1/4 cup bell pepper\n- 1/4 cup cooked lentils\n- 1/3 cup cooked quinoa\n- 1/3 cup edamame\n- 1/4 cup cottage cheese\n- 1 hard-boiled egg, sliced\n- Small handful of spinach on top\n\n**Instructions:**\n1. Layer ingredients in mason jar in order listed (dressing on bottom, greens on top)\n2. Refrigerate until ready to eat (lasts 3-4 days)\n3. Shake to distribute dressing when ready to eat\n\n## 3. Tempeh Taco Bowls (28g protein)\n\n**Ingredients (for 4 servings):**\n- 2 packages (8oz each) tempeh, crumbled\n- 2 tbsp olive oil\n- 4 tbsp taco seasoning\n- 1 can (15oz) black beans, drained\n- 2 cups cooked brown rice\n- 1 cup corn kernels\n- 2 bell peppers, sliced\n- 1 cup cherry tomatoes, halved\n- 1 avocado, sliced (divide just before eating)\n- 1/2 cup Greek yogurt (for topping)\n- Hot sauce to taste\n\n**Instructions:**\n1. Sauté tempeh in olive oil with taco seasoning until browned\n2. Divide rice among meal prep containers\n3. Top with tempeh, beans, and vegetables\n4. Pack yogurt and avocado separately to add before eating\n\n## 4. Spiced Lentil & Roasted Vegetable Power Bowls (24g protein)\n\n**Ingredients (for 4 servings):**\n- 2 cups green or brown lentils, cooked\n- 2 sweet potatoes, diced and roasted\n- 2 cups cauliflower florets, roasted\n- 4 eggs, hard-boiled and halved\n- 2 cups spinach\n- 1/2 cup tahini\n- 2 lemons, juiced\n- 2 cloves garlic, minced\n- Salt, pepper, cumin, paprika to taste\n\n**Instructions:**\n1. Roast sweet potatoes and cauliflower with spices at 425°F for 25 minutes\n2. Mix tahini, lemon juice, garlic, and spices for dressing\n3. Arrange lentils, roasted vegetables, spinach, and eggs in containers\n4. Pack dressing separately\n\n## 5. High-Protein Pasta Salad (26g protein)\n\n**Ingredients (for 4 servings):**\n- 8oz protein-enriched pasta (like Banza chickpea pasta)\n- 1 block (14oz) extra-firm tofu, cubed and baked\n- 1 cup cherry tomatoes, halved\n- 1 cucumber, diced\n- 1 bell pepper, diced\n- 1/4 cup red onion, finely chopped\n- 1/2 cup Kalamata olives, sliced\n- 1/4 cup hemp seeds\n- 1/4 cup nutritional yeast\n- 3 tbsp olive oil\n- 2 tbsp red wine vinegar\n- 1 tsp Italian seasoning\n- Salt and pepper to taste\n\n**Instructions:**\n1. Cook pasta according to package directions, rinse with cold water\n2. Bake tofu cubes at 400°F for 25 minutes until crispy\n3. Combine all ingredients in a large bowl\n4. Divide into containers and refrigerate\n\nAll of these recipes can be prepared in about an hour on Sunday and will last for 4-5 days in the refrigerator. Would you like me to suggest any modifications or additional recipes?",
        sender: "assistant" as MessageSender,
        timestamp: getRelativeTime(5),
        status: "sent",
      },
    ],
  },
];

// Default new chat session template
export const newChatSessionTemplate: ChatSession = {
  id: "new",
  name: "New Conversation",
  agentName: "VernisAI Assistant",
  agentDescription:
    "A helpful AI assistant that can answer questions and perform tasks.",
  messages: [
    {
      id: "welcome-msg",
      content: "Hello! I'm your VernisAI Assistant. How can I help you today?",
      sender: "assistant" as MessageSender,
      timestamp: new Date(),
      status: "sent",
    },
  ],
};
