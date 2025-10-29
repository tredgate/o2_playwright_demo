/**
 * Production Environment Configuration
 *
 * This file contains configuration overrides specific to the PROD environment.
 * These settings optimize for stability and production-like conditions.
 */

import type { PlaywrightTestConfig } from "@playwright/test";
import type { TestData } from "../../types/environment";

/**
 * Creates production environment configuration overrides
 * @param testData - Test data for the production environment
 * @returns Playwright configuration overrides for production
 */
export function createProdConfig(
  testData: TestData
): Partial<PlaywrightTestConfig> {
  return {
    // Production environment settings
    timeout: 30000, // Longer timeout for production stability
    retries: 1, // More retries for reliability

    use: {
      actionTimeout: testData.timeouts.medium,
      navigationTimeout: testData.timeouts.long,
      trace: "retain-on-failure",
      screenshot: "only-on-failure",
    },

    expect: {
      timeout: testData.timeouts.medium,
    },
  };
}
