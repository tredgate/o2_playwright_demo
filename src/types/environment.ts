/**
 * Environment configuration types and interfaces
 *
 * This file defines the structure for test environments, configurations, and test data.
 * It supports multiple environments (PROD, TEST) with language-specific data.
 */

import type { PlaywrightTestConfig } from "@playwright/test";

/**
 * Supported test environments
 */
export enum TestEnvironment {
  PROD = "PROD",
  TEST = "TEST",
}

/**
 * Type alias for backward compatibility
 */
export type TestEnvironmentType = TestEnvironment;

/**
 * Supported languages for testing
 */
export enum TestLanguage {
  EN = "en",
  CS = "cs",
}
/**
 * User credentials for testing
 */
export interface UserCredentials {
  username: string;
  password: string;
  description: string;
}

/**
 * Application URLs for different environments
 */
export interface ApplicationUrls {
  pmtool: string;
  tegbUrl: string;
}

/**
 * Test data structure for each environment
 * Contains all test data needed for test execution
 */
export interface TestData {
  environment: TestEnvironment;
  language: TestLanguage;
  urls: ApplicationUrls;
  users: {
    pmtool: {
      admin: UserCredentials;
      regular: UserCredentials;
      test: UserCredentials;
    };
    tegb: {
      admin: UserCredentials;
    };
  };
  timeouts: {
    short: number;
    medium: number;
    long: number;
  };
}

/**
 * Extended Playwright configuration with environment-specific settings
 * Allows overriding default Playwright config based on test environment
 */
export interface EnvironmentTestConfig
  extends Omit<PlaywrightTestConfig, "workers" | "expect"> {
  environment: TestEnvironment;
  language: TestLanguage;
  testData: TestData;
  // Environment-specific overrides with proper types
  workers?: number;
  expect?: {
    timeout?: number;
  };
}

/**
 * Environment configuration factory function type
 */
export type EnvironmentConfigFactory = (
  environment: TestEnvironment,
  language: TestLanguage
) => EnvironmentTestConfig;
