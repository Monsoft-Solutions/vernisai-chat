import { generateOpenApiDocument } from "trpc-openapi";
import { appRouter } from "../router";
import * as fs from "fs";
import * as path from "path";

/**
 * Generate OpenAPI documentation from tRPC router
 */
const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "VernisAI API",
  version: "1.0.0",
  baseUrl: "https://app.vernis.ai/api",
  description: "API for VernisAI - AI-powered chat and intelligent agents",
});

// Ensure the output directory exists
const outputDir = path.join(__dirname, "../../../..", "apps/web/public/api");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the OpenAPI document to a file
fs.writeFileSync(
  path.join(outputDir, "openapi.json"),
  JSON.stringify(openApiDocument, null, 2),
);

console.log("✅ OpenAPI document generated successfully!");
console.log(`📄 File saved to: ${path.join(outputDir, "openapi.json")}`);
