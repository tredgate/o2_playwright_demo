/**
 * Test data for TEST environment
 *
 * This file contains test data for the test environment.
 * Since we don't have a real TEST environment available, this serves as
 * a demonstration of how you would structure test data for different environments.
 *
 * In real projects, this would contain:
 * - Test environment URLs
 * - Test-specific user accounts
 * - Test database connections
 * - Mock service endpoints
 *
 * PLACEHOLDER NOTICE: The URLs in this configuration are placeholder values
 * and will not work in actual test execution. They serve as examples only.
 */

import { TestData, TestLanguage, TestEnvironment } from "../types/environment";

/**
 * Creates test data for TEST environment
 * @param language - The language to use for localized data
 * @returns Complete test data configuration for TEST environment
 */
export function createTestTestData(language: TestLanguage): TestData {
  return {
    environment: TestEnvironment.TEST,
    language,

    // PLACEHOLDER URLs - These are example URLs that don't exist
    urls: {
      pmtool: "https://test.tredgate.com/pmtool",
      tegbUrl: "https://test.tegb.com",
    },

    users: {
      pmtool: {
        admin: {
          username: "test_admin",
          password: "test_admin_pass",
          description: "Test environment administrator account",
        },

        regular: {
          username: "test_user",
          password: "test_user_pass",
          description: "Test environment regular user account",
        },

        test: {
          username: "automated_test_user",
          password: "automated_pass",
          description: "Dedicated automation user for test environment",
        },
      },
      tegb: {
        admin: {
          username: "test_admin_tegb",
          password: "test_admin_tegb_pass",
          description: "Test environment TEGb administrator account",
        },
      },
    },

    timeouts: {
      short: 3000, // 3 seconds - faster in test environment
      medium: 10000, // 10 seconds - shorter for faster test execution
      long: 20000, // 20 seconds - reduced timeout for test environment
    },
  };
}
