import { resolve } from "path";

/**
 * Custom type definitions to replace vitest/config imports
 */
export type CoverageOptions = {
  provider?: string;
  reporter?: string[];
  exclude?: string[];
  [key: string]: unknown;
};

export type UserConfig = {
  test?: {
    globals?: boolean;
    environment?: string;
    include?: string[];
    coverage?: CoverageOptions;
    setupFiles?: string[];
    css?: {
      modules?: {
        classNameStrategy?: string;
      };
    };
    [key: string]: unknown;
  };
  resolve?: {
    alias?: Record<string, string>;
  };
  [key: string]: unknown;
};

/**
 * Options for createBaseVitestConfig
 */
export type BaseVitestConfigOptions = {
  /**
   * The directory where tests are located
   */
  testDir?: string;
  /**
   * Whether to include coverage configuration
   */
  coverage?: boolean | CoverageOptions;
  /**
   * Test environment (jsdom or node)
   */
  environment?: "jsdom" | "node";
  /**
   * Custom path aliases
   */
  aliases?: Record<string, string>;
  /**
   * Additional Vitest configuration options
   */
  testConfig?: Partial<UserConfig["test"]>;
};

/**
 * Creates a base Vitest configuration with sensible defaults
 *
 * @param options - Configuration options
 * @returns A Vitest configuration object
 */
export function createBaseVitestConfig(
  options: BaseVitestConfigOptions = {},
): UserConfig {
  const {
    testDir = "./tests",
    coverage = false,
    environment = "node",
    aliases = {},
    testConfig = {},
  } = options;

  // Base path aliases
  const baseAliases = {
    "@": resolve(process.cwd(), "./src"),
    "@tests": resolve(process.cwd(), testDir),
    ...aliases,
  };

  // Default coverage configuration
  const defaultCoverage: CoverageOptions = {
    provider: "v8",
    reporter: ["text", "json", "html"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/tests/**"],
  };

  // Merge custom coverage config with defaults
  const coverageConfig =
    coverage === true
      ? defaultCoverage
      : coverage
        ? { ...defaultCoverage, ...coverage }
        : undefined;

  // Base config
  const baseConfig: UserConfig = {
    test: {
      globals: true,
      environment,
      include: [`${testDir}/**/*.{test,spec}.{js,jsx,ts,tsx}`],
      coverage: coverageConfig,
      setupFiles: [resolve(__dirname, "../setup.ts")],
      ...testConfig,
    },
    resolve: {
      alias: baseAliases,
    },
  };

  return baseConfig;
}

/**
 * Creates a React-specific Vitest configuration
 *
 * @param options - Configuration options
 * @returns A Vitest configuration for React components
 */
export function createReactVitestConfig(
  options: BaseVitestConfigOptions = {},
): UserConfig {
  const baseConfig = createBaseVitestConfig({
    environment: "jsdom",
    ...options,
  });

  // Add React-specific settings
  return mergeConfig(baseConfig, {
    test: {
      environment: "jsdom",
      globals: true,
      css: {
        modules: {
          classNameStrategy: "non-scoped",
        },
      },
    },
  } as UserConfig);
}

/**
 * Simple utility to merge configurations
 */
function mergeConfig(
  baseConfig: UserConfig,
  newConfig: UserConfig,
): UserConfig {
  return {
    ...baseConfig,
    test: {
      ...(baseConfig.test || {}),
      ...(newConfig.test || {}),
    },
    resolve: {
      ...(baseConfig.resolve || {}),
      alias: {
        ...(baseConfig.resolve?.alias || {}),
        ...(newConfig.resolve?.alias || {}),
      },
    },
  };
}
