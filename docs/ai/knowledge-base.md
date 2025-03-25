# Knowledge Base

The Knowledge Base module provides a framework for ingesting, storing, and retrieving external knowledge to enhance AI assistants and agents with additional context.

## Overview

Knowledge bases allow for enriching AI interactions with domain-specific information without needing to include that information in each prompt. The `@vernis/ai` package offers a comprehensive system for creating, managing, and utilizing knowledge bases.

## Knowledge Base Lifecycle

1. **Creation**: Define a knowledge base with configuration settings
2. **Ingestion**: Load content from various sources into the knowledge base
3. **Processing**: Transform and index content for efficient retrieval
4. **Retrieval**: Query the knowledge base for relevant information
5. **Updating**: Add, remove, or refresh content as needed

## Creating a Knowledge Base

```typescript
import { createKnowledgeBase } from "@vernis/ai";

// Create a knowledge base
const companyKnowledge = await createKnowledgeBase({
  name: "company-knowledge",
  description: "Internal company documentation and policies",
  // Configuration options
  chunkSize: 1000, // Size of text chunks for indexing
  overlapSize: 200, // Overlap between chunks to maintain context
  embeddingModel: "openai:text-embedding-3-small", // Model for generating embeddings
  storageConfig: {
    type: "database", // Options: 'memory', 'file', 'database'
    // Database-specific configuration
    connection: {
      // Database connection details
    },
  },
});
```

## Ingesting Content

The knowledge base supports various content sources:

### Document Ingestion

```typescript
import { createKnowledgeBase } from "@vernis/ai";

const kb = await createKnowledgeBase({ name: "product-docs" });

// Ingest files
await kb.ingestFiles({
  files: [
    {
      path: "./documents/product-manual.pdf",
      metadata: { category: "manual", version: "2.0" },
    },
    {
      path: "./documents/api-docs.md",
      metadata: { category: "api", version: "1.5" },
    },
  ],
  options: {
    preserveFormatting: true,
    extractImages: true,
  },
});
```

### URL Ingestion

```typescript
import { createKnowledgeBase } from "@vernis/ai";

const kb = await createKnowledgeBase({ name: "web-content" });

// Ingest web content
await kb.ingestUrls({
  urls: [
    {
      url: "https://example.com/blog/article-1",
      metadata: { category: "blog", author: "Jane Smith" },
    },
    {
      url: "https://example.com/faq",
      metadata: { category: "support" },
    },
  ],
  options: {
    depth: 1, // Follow links 1 level deep
    includeSelector: ".content", // Only capture content matching this CSS selector
    excludeSelector: ".ads, .comments",
  },
});
```

### External Service Ingestion

```typescript
import { createKnowledgeBase } from "@vernis/ai";

const kb = await createKnowledgeBase({ name: "drive-documents" });

// Ingest from Google Drive
await kb.ingestFromService({
  service: "google-drive",
  config: {
    folderId: "abc123", // Google Drive folder ID
    recursive: true,
    fileTypes: [".pdf", ".docx", ".txt", ".md"],
  },
  // Authentication
  authConfig: {
    type: "oauth2",
    accountId: "work-account",
  },
});
```

### Text Ingestion

```typescript
import { createKnowledgeBase } from "@vernis/ai";

const kb = await createKnowledgeBase({ name: "custom-content" });

// Ingest raw text
await kb.ingestText({
  items: [
    {
      text: "The product warranty covers manufacturing defects for 12 months from purchase date.",
      metadata: { category: "policy", topic: "warranty" },
    },
    {
      text: 'To reset your password, visit the account page and click "Reset Password".',
      metadata: { category: "support", topic: "account" },
    },
  ],
});
```

## Querying a Knowledge Base

Once populated, knowledge bases can be queried for relevant information:

```typescript
import { createKnowledgeBase } from "@vernis/ai";

const kb = await createKnowledgeBase({ name: "product-docs" });
// ... ingest content

// Query the knowledge base
const results = await kb.query({
  query: "How do I reset my password?",
  maxResults: 5,
  similarityThreshold: 0.75,
  includeMetadata: true,
});

// Results format
[
  {
    content:
      'To reset your password, visit the account page and click "Reset Password".',
    similarity: 0.92,
    metadata: { category: "support", topic: "account" },
  },
  // More results...
];
```

## Knowledge Base Integration with Agents

Knowledge bases can be linked to agents to provide additional context:

```typescript
import { createAgent, ModelConfig } from "@vernis/ai";

// Create an agent with knowledge base integration
const supportAgent = createAgent({
  name: "Support Assistant",
  model: ModelConfig.SMART,
  systemPrompt: "You are a helpful support assistant.",
  // Link knowledge bases
  knowledgeBases: ["product-docs", "support-faqs"],
  // Configure knowledge retrieval strategy
  knowledgeBaseConfig: {
    retrievalStrategy: "auto", // Auto-retrieve relevant knowledge
    maxRetrievedItems: 10, // Maximum items to retrieve per query
    includeInPrompt: true, // Include retrieved knowledge in prompts
  },
});

// Execute the agent with knowledge context
const result = await supportAgent.execute({
  task: "Help the user reset their password",
});
```

### Manual Knowledge Retrieval

For more control over knowledge retrieval:

```typescript
import { createAgent, ModelConfig } from "@vernis/ai";

// Create a workflow with explicit knowledge retrieval
const workflow = defineWorkflow({
  steps: [
    {
      name: "retrieve-knowledge",
      description: "Find relevant knowledge about the user query",
      tool: "knowledge-base-query",
      inputMapping: {
        query: "{{task}}",
        knowledgeBases: ["product-docs", "support-faqs"],
        maxResults: 5,
      },
    },
    {
      name: "formulate-response",
      description: "Create a response using the retrieved knowledge",
      tool: "generate-content",
      inputMapping: {
        prompt:
          "Based on this information: {{retrieve-knowledge.results}}, respond to: {{task}}",
        maxLength: 500,
      },
    },
  ],
});

// Create an agent with the workflow
const agent = createAgent({
  name: "Support Assistant",
  model: ModelConfig.SMART,
  workflow: workflow,
});
```

## Updating Knowledge Bases

Knowledge bases can be updated to keep information current:

```typescript
import { createKnowledgeBase } from "@vernis/ai";

const kb = await createKnowledgeBase({ name: "product-docs" });
// ... initial ingestion

// Add new content
await kb.ingestFiles({
  files: [{ path: "./documents/new-release-notes.pdf" }],
});

// Remove content matching criteria
await kb.removeContent({
  metadata: {
    category: "manual",
    version: { $lt: "2.0" }, // Remove outdated versions
  },
});

// Update existing content
await kb.updateContent({
  filter: {
    metadata: { topic: "pricing" },
  },
  newContent:
    "Updated pricing information: Basic plan $10/month, Pro plan $25/month.",
  updateMetadata: { lastUpdated: new Date().toISOString() },
});
```

## Scheduled Refreshes

For dynamic content sources, scheduled refreshes can be configured:

```typescript
import { createKnowledgeBase, ScheduleFrequency } from "@vernis/ai";

const kb = await createKnowledgeBase({
  name: "documentation",
  // Configure automatic updates
  refreshSchedule: {
    sources: [
      {
        type: "url",
        location: "https://docs.example.com",
        frequency: ScheduleFrequency.DAILY,
      },
      {
        type: "service",
        service: "github",
        location: "owner/repo/docs",
        frequency: ScheduleFrequency.HOURLY,
      },
    ],
    failureNotification: "email@example.com",
  },
});
```

## Knowledge Base Management

Additional management operations:

```typescript
import {
  listKnowledgeBases,
  deleteKnowledgeBase,
  getKnowledgeBase,
} from "@vernis/ai";

// List all knowledge bases
const allKnowledgeBases = await listKnowledgeBases();

// Get a specific knowledge base
const kb = await getKnowledgeBase("product-docs");

// Get stats about a knowledge base
const stats = await kb.getStats();
// Example stats output:
// {
//   documentCount: 157,
//   chunkCount: 2453,
//   lastUpdated: '2023-06-15T10:30:45Z',
//   sourceBreakdown: {
//     pdf: 45,
//     markdown: 22,
//     webpage: 90
//   },
//   storageUsage: '24.5MB'
// }

// Delete a knowledge base
await deleteKnowledgeBase("outdated-kb");
```

## Advanced Configuration

For specialized use cases, additional configuration options are available:

```typescript
import { createKnowledgeBase, EmbeddingModel } from "@vernis/ai";

const kb = await createKnowledgeBase({
  name: "specialized-kb",
  // Advanced indexing options
  indexing: {
    vectorDimensions: 1536,
    distanceMetric: "cosine",
    indexType: "hnsw",
    hnsw: {
      efConstruction: 200,
      M: 16,
    },
  },
  // Custom embedding function
  embeddings: {
    model: EmbeddingModel.CUSTOM,
    generateEmbedding: async (text) => {
      // Custom embedding generation logic
      return customEmbeddingService(text);
    },
    dimensions: 768,
  },
  // Custom text splitting
  textSplitting: {
    strategy: "semantic", // Options: 'chunk', 'sentence', 'paragraph', 'semantic'
    semanticSplittingOptions: {
      minSentences: 3,
      maxSentences: 10,
    },
  },
});
```

## Related Documentation

- [Agent Framework](./agent-framework.md)
- [Tools](./tools.md)
- [Natural Agent Builder](./natural-agent-builder.md)
