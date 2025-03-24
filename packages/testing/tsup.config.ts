import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/config/index.ts",
    "src/fixtures/index.ts",
    "src/mocks/index.ts",
    "src/utils/index.ts",
    "src/types/index.ts",
    "src/matchers/index.ts",
  ],
  format: ["cjs", "esm"],
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
});
