import { expect, type Locator, type Page } from "@playwright/test";

export class DashboardPage {
  readonly profileButton: Locator;
  readonly logoutButton: Locator;
  readonly bellIcon: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.profileButton = page.locator("#user_dropdown");
    this.logoutButton = page.locator("#logout");
    this.bellIcon = page.locator("#user_notifications_report");
  }

  async waitUntilLoaded() {
    await expect(this.bellIcon).toBeVisible();
  }

  async clickProfile() {
    await this.profileButton.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }
}
