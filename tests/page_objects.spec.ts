import { test } from "@playwright/test";
import { LoginPage } from "../src/pages/pmtool/login_page";
import { DashboardPage } from "../src/pages/pmtool/dashboard_page";

test("PageObjects Exercise - Login and Logout", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.openPmtool();
  await loginPage.login("pw_skoleni", "TEG2023");
  await dashboardPage.waitUntilLoaded();
  await dashboardPage.clickProfile();
  await dashboardPage.clickLogout();
});
