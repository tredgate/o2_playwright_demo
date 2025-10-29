import { test } from "@playwright/test";

test("First test", async ({ page }) => {
  await page.goto("https://tredgate.com/pmtool");
  await page.locator("#username").fill("o2_user");
  await page.locator("#password").fill("o2_user123");
  await page.locator('[type="submit"]').click();
});
