/**
 * Test Environment Configuration
 *
 * This file contains configuration overrides specific to the TEST environment.
 * These settings optimize for faster feedback and test environment conditions.
 */

import type { PlaywrightTestConfig } from "@playwright/test";
import type { TestData } from "../../types/environment";

/**
 * Creates test environment configuration overrides
 * @param testData - Test data for the test environment
 * @returns Playwright configuration overrides for test environment
 */
export function createTestConfig(
  testData: TestData
): Partial<PlaywrightTestConfig> {
  return {
    // Test environment settings
    timeout: 20000, // Shorter timeout for faster feedback
    retries: 0, // No retries in test environment for immediate failure detection
    workers: 2, // Limit workers for test environment resource conservation

    use: {
      actionTimeout: testData.timeouts.short,
      navigationTimeout: testData.timeouts.medium,
      trace: "retain-on-failure",
      screenshot: "only-on-failure",
    },

    expect: {
      timeout: testData.timeouts.medium,
    },
  };
}
