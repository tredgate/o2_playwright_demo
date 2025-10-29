/**
 * Playwright Fixtures for Environment Management
 *
 * This file defines custom Playwright fixtures that provide environment-specific
 * test data and configuration to test functions. Fixtures offer several advantages:
 *
 * 1. Automatic dependency injection into test functions
 * 2. Type-safe access to test data and configuration
 * 3. Isolation between tests
 * 4. Easy mocking and overriding for specific tests
 * 5. Consistent data access pattern across all tests
 *
 * Usage in tests:
 * ```typescript
 * test('login test', async ({ page, testData }) => {
 *   await page.goto(testData.urls.loginUrl);
 *   // testData and envConfig are automatically injected
 * });
 * ```
 */

import { test as base } from "@playwright/test";
import {
  TestData,
  EnvironmentTestConfig,
  TestEnvironment,
} from "../types/environment";
import {
  getCurrentEnvironment,
  getCurrentLanguage,
  getTestData,
} from "../config/environment-config";

/**
 * Extended test interface with custom fixtures
 * These fixtures will be available in all test functions
 */
interface EnvironmentFixtures {
  /**
   * Complete test data for the current environment and language
   * Includes URLs, user credentials, timeouts, and API endpoints
   */
  testData: TestData;

  /**
   * Complete environment configuration including Playwright settings
   * and environment-specific overrides
   */
  envConfig: EnvironmentTestConfig;
}

/**
 * Extended test function with environment fixtures
 * This replaces the default Playwright test function
 */
export const test = base.extend<EnvironmentFixtures>({
  /**
   * Test data fixture - provides environment and language specific test data
   * This fixture is automatically resolved based on TEST_ENV and TEST_LANGUAGE
   * environment variables
   */
  testData: async ({}, use) => {
    const environment = getCurrentEnvironment();
    const language = getCurrentLanguage();
    const data = getTestData(environment, language);

    console.log(
      `Using test data for: ${environment} environment, ${language} language`
    );
    await use(data);
  },
});

/**
 * Export expect from Playwright for convenience
 * This allows importing both test and expect from this module
 */
export { expect } from "@playwright/test";

/**
 * Skip test in specific environments
 * Useful for tests that should not run in certain environments
 *
 * @param environments - Array of environments where tests should be skipped
 * @param name - Test suite name
 * @param fn - Test suite function
 */
export function skipInEnvironments(
  environments: string[],
  name: string,
  fn: () => void
): void {
  const currentEnv = getCurrentEnvironment();

  if (environments.includes(currentEnv)) {
    test.describe.skip(`${name} [Skipped in ${currentEnv}]`, fn);
  } else {
    test.describe(`${name} [${currentEnv}]`, fn);
  }
}
