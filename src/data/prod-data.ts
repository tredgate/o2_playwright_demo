/**
 * Test data for PRODUCTION environment
 *
 * This file contains test data for the production environment.
 * In a real-world scenario, this would point to actual production URLs
 * and contain production-like test data.
 *
 * SECURITY NOTE: In real projects, sensitive data should be stored securely
 * using environment variables, encrypted files, or secret management systems.
 * This demo uses hardcoded values for educational purposes only.
 */

import { TestData, TestLanguage, TestEnvironment } from "../types/environment";

/**
 * Creates test data for PRODUCTION environment
 * @param language - The language to use for localized data
 * @returns Complete test data configuration for PROD environment
 */
export function createProdTestData(language: TestLanguage): TestData {
  return {
    environment: TestEnvironment.PROD,
    language,

    urls: {
      pmtool: "https://tredgate.com/pmtool",
      tegbUrl: "https://tegb-frontend-88542200c6db.herokuapp.com/",
    },

    users: {
      pmtool: {
        admin: {
          username: "o2_user",
          password: "o2_user123",
          description: "Main administrator account for production testing",
        },

        regular: {
          username: "user",
          password: "user",
          description:
            "Regular user account for standard functionality testing",
        },

        test: {
          username: "test",
          password: "test",
          description: "Dedicated test user for automated testing",
        },
      },
      tegb: {
        admin: {
          username: "admin_tegb",
          password: "admin_tegb_pass",
          description: "Main administrator account for TEGb production testing",
        },
      },
    },

    timeouts: {
      short: 5000, // 5 seconds - for quick operations
      medium: 15000, // 15 seconds - for standard operations
      long: 30000, // 30 seconds - for complex operations
    },
  };
}
