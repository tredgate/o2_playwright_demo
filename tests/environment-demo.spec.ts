/**
 * Environment Management Demo Tests
 *
 * This test file demonstrates how to use the environment management system
 * with Playwright fixtures. It shows:
 *
 * 1. How to access environment-specific test data through fixtures
 * 2. How to use different user credentials based on environment
 * 3. How to write tests that work across multiple environments
 * 4. How to skip tests in specific environments
 *
 * Usage examples:
 * - cross-env TEST_ENV=PROD TEST_LANGUAGE=en playwright test environment-demo.spec.ts
 * - cross-env TEST_ENV=TEST TEST_LANGUAGE=cs playwright test environment-demo.spec.ts --ui
 */

import {
  test,
  expect,
  skipInEnvironments,
} from "../src/fixtures/environment-fixtures";
import { LoginPage } from "../src/pages/pmtool/login_page";
import { DashboardPage } from "../src/pages/pmtool/dashboard_page";
import { TestEnvironment } from "../src/types/environment";
import { getCurrentEnvironmentConfig } from "../src/config/environment-config.ts";

test.describe("Environment Management Demo", () => {
  test("Current environment, config and credentials information", async ({
    testData,
  }) => {
    // * Log current environment details
    console.log(`Current Environment: ${testData.environment}`);
    console.log(`Current Language: ${testData.language}`);
    console.log(`Base URL: ${testData.urls.pmtool}`);
    console.log(`Timeout Settings: ${JSON.stringify(testData.timeouts)}`);

    // * Log configuration details
    console.log(
      `Environment Config: ${JSON.stringify(
        getCurrentEnvironmentConfig(),
        null,
        2
      )}`
    );

    // * Log user credentials
    const users = testData.users;
    console.log(`Pmtool Users: 
      Admin - ${users.pmtool.admin.username} / ${users.pmtool.admin.password}
      Regular - ${users.pmtool.regular.username} / ${users.pmtool.regular.password}
      Test - ${users.pmtool.test.username} / ${users.pmtool.test.password}

      TEGb Users:
      Admin - ${users.tegb.admin.username} / ${users.tegb.admin.password}
      `);

    // * Accessing to test data
    const shortTimeout = testData.timeouts.short;
    const mediumTimeout = testData.timeouts.medium;
    const longTimeout = testData.timeouts.long;

    console.log(
      `Timeouts - Short: ${shortTimeout}, Medium: ${mediumTimeout}, Long: ${longTimeout}`
    );
  });

  // Tests that are skipped in TEST environment (since URLs are placeholders)
  // Login and credentials are working only in PROD environment
  skipInEnvironments(
    [TestEnvironment.TEST],
    "PMTOOL Login/Logout Tests",
    () => {
      test("Login and Logout", async ({ page, testData }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        await loginPage.openFromTestData(testData);
        await loginPage.loginTestData(testData.users.pmtool.admin);
        await dashboardPage.waitUntilLoaded();
        await dashboardPage.clickProfile();
        await dashboardPage.clickLogout();

        //  In real tests, move this verification inside the page object
        await expect(loginPage.loginButton).toBeVisible({
          timeout: testData.timeouts.medium,
        });
      });
    }
  );
});
