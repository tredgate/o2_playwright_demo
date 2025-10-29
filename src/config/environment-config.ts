/**
 * Environment Configuration Manager
 *
 * This module provides functions to create and manage environment-specific
 * configurations for Playwright tests. It combines base Playwright configuration
 * with environment-specific settings and test data.
 *
 * Key features:
 * - Automatic environment detection from environment variables
 * - Flexible configuration overrides per environment
 * - Type-safe configuration management
 * - Support for multiple languages and environments
 */

import type { PlaywrightTestConfig } from "@playwright/test";
import type { EnvironmentTestConfig, TestData } from "../types/environment";
import { TestLanguage } from "../types/environment";
import { TestEnvironment } from "../types/environment";
import { createProdTestData } from "../data/prod-data";
import { createTestTestData } from "../data/test-data";
import { createProdConfig } from "./environments/prod.config";
import { createTestConfig } from "./environments/test.config";

/**
 * Default Playwright configuration that serves as a base for all environments
 * This configuration can be overridden by environment-specific settings
 * It is there to ensure consistency across different environments and avoid losing information when using overrides
 */
const baseConfig: PlaywrightTestConfig = {
  testDir: "./tests", // Can be overridden when there are different test directories per environment
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: 5000,
  expect: {
    timeout: 5000,
  },
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 10000,
    navigationTimeout: 20000,
  },
};

/**
 * Gets the current test environment from environment variables
 * @returns The test environment (defaults to "PROD" if not specified)
 */
export function getCurrentEnvironment(): TestEnvironment {
  const env = process.env.TEST_ENV?.toUpperCase() as TestEnvironment;

  if (!env || !Object.values(TestEnvironment).includes(env)) {
    console.warn(
      `Invalid or missing TEST_ENV: "${process.env.TEST_ENV}". Defaulting to PROD.`
    );
    return TestEnvironment.PROD;
  }

  return env;
}

/**
 * Gets the current test language from environment variables
 * @returns The test language (defaults to "en" if not specified)
 */
export function getCurrentLanguage(): TestLanguage {
  const lang = process.env.TEST_LANGUAGE?.toLowerCase() as TestLanguage;

  if (!lang || !Object.values(TestLanguage).includes(lang)) {
    console.warn(
      `Invalid or missing TEST_LANGUAGE: "${process.env.TEST_LANGUAGE}". Defaulting to en.`
    );
    return TestLanguage.EN;
  }

  return lang;
}

/**
 * Creates test data for the specified environment and language
 * @param environment - The target environment
 * @param language - The target language
 * @returns Test data configuration for the specified environment
 */
export function getTestData(
  environment: TestEnvironment,
  language: TestLanguage
): TestData {
  switch (environment) {
    case TestEnvironment.PROD:
      return createProdTestData(language);
    case TestEnvironment.TEST:
      return createTestTestData(language);
    default:
      throw new Error(`Unsupported environment: ${environment}`);
  }
}

/**
 * Creates environment-specific Playwright configuration
 * @param environment - The target environment
 * @param language - The target language
 * @returns Complete Playwright configuration with environment-specific overrides
 */
export function createEnvironmentConfig(
  environment: TestEnvironment,
  language: TestLanguage
): EnvironmentTestConfig {
  const testData = getTestData(environment, language);

  // Get environment-specific configuration overrides
  let environmentOverrides: Partial<PlaywrightTestConfig>;

  switch (environment) {
    case TestEnvironment.PROD:
      environmentOverrides = createProdConfig(testData);
      break;

    case TestEnvironment.TEST:
      environmentOverrides = createTestConfig(testData);
      break;

    default:
      throw new Error(`Unsupported environment: ${environment}`);
  }

  // Merge base configuration with environment-specific overrides
  const mergedConfig: EnvironmentTestConfig = {
    ...baseConfig,
    ...environmentOverrides,
    environment,
    language,
    testData,
    // Ensure workers is properly typed
    workers:
      typeof environmentOverrides.workers === "number"
        ? environmentOverrides.workers
        : (baseConfig.workers as number),
    // Merge 'use' configuration carefully to avoid overwriting important settings
    use: {
      ...baseConfig.use,
      ...environmentOverrides.use,
    },
    // Ensure expect configuration is properly merged
    expect: {
      ...baseConfig.expect,
      ...environmentOverrides.expect,
    },
  };

  return mergedConfig;
}

/**
 * Gets the current environment configuration based on environment variables
 * This is the main function to call from playwright.config.ts
 * @returns Complete environment configuration for current environment
 */
export function getCurrentEnvironmentConfig(): EnvironmentTestConfig {
  const environment = getCurrentEnvironment();
  const language = getCurrentLanguage();

  console.log(`Environment: ${environment}`);
  console.log(`Language: ${language}`);

  return createEnvironmentConfig(environment, language);
}
