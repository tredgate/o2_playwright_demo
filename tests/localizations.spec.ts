import { test, expect } from "@playwright/test";
import { getCurrentLanguage, tegbTexts } from "../src/i18n/i18n";

test("Automated localization tests (auto language)", async ({ page }) => {
  await page.goto("https://tegb-frontend-88542200c6db.herokuapp.com/");

  /**
   * Setting language based on environment variable
   * Function getCurrentLanguage() retrieves the current language setting (defaulting to "en" if not set)
   * This switch is directly in the test for demonstration purposes, in a real-world scenario, you would likely want to abstract this logic away into a POM or helper function
   */
  switch (getCurrentLanguage()) {
    case "cs":
      await page.locator('[data-testid="cz"]').click();
      break;
    case "en":
      await page.locator('[data-testid="en"]').click();
      break;
  }

  // Verify that the placeholders are correctly localized and using tegbTexts() to get expected values
  await expect(page.locator('[data-testid="username-input"]')).toHaveAttribute(
    "placeholder",
    tegbTexts().usernamePlaceholder
  );
  await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute(
    "placeholder",
    tegbTexts().passwordPlaceholder
  );
});
