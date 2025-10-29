import { defineConfig, devices } from "@playwright/test";
import { getCurrentEnvironmentConfig } from "./src/config/environment-config";

/**
 * Playwright Configuration with Environment Management
 *
 * This configuration automatically adjusts based on environment variables:
 * - TEST_ENV: Specifies the target environment (PROD, TEST)
 * - TEST_LANGUAGE: Specifies the language for localization (en, cs)
 *
 * Usage examples:
 * - cross-env TEST_ENV=PROD TEST_LANGUAGE=en playwright test
 * - cross-env TEST_ENV=TEST TEST_LANGUAGE=cs playwright test --ui
 *
 * The configuration combines:
 * - Base Playwright settings
 * - Environment-specific overrides
 * - Test data and URLs for the target environment
 *
 * See https://playwright.dev/docs/test-configuration.
 */

// Get environment-specific configuration
const environmentConfig = getCurrentEnvironmentConfig();

export default defineConfig({
  // Use environment-specific test directory (can be overridden per environment)
  testDir: environmentConfig.testDir || "./tests",

  // Use environment-specific parallel execution setting
  fullyParallel: environmentConfig.fullyParallel ?? true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Use environment-specific retry configuration */
  retries: environmentConfig.retries ?? (process.env.CI ? 2 : 0),

  /* Use environment-specific worker configuration */
  workers: environmentConfig.workers ?? (process.env.CI ? 1 : undefined),

  /* Use environment-specific timeout */
  timeout: environmentConfig.timeout || 30000,

  /* Use environment-specific reporter configuration */
  reporter: environmentConfig.reporter || "html",

  /* Merge base settings with environment-specific use configuration */
  use: {
    /* Environment-specific timeouts */
    actionTimeout: environmentConfig.testData.timeouts.medium,
    navigationTimeout: environmentConfig.testData.timeouts.long,

    /* Collect trace when retrying the failed test */
    trace: "retain-on-failure",

    /* Screenshot on failure for debugging */
    screenshot: "only-on-failure",

    /* Merge any additional environment-specific use configuration */
    ...environmentConfig.use,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: `chromium`,
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: `firefox`,
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: `webkit`,
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
