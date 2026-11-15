import { test, expect } from "@playwright/test";

test.describe("AstroLumina Homepage", () => {
  test("should load homepage with correct title and hero", async ({ page }) => {
    await page.goto("/");
    
    // Check page title
    await expect(page).toHaveTitle(/AstroLumina/);
    
    // Check hero heading is visible
    await expect(page.locator("h1")).toContainText("AstroLumina");
    
    // Check hero description
    await expect(page.locator("text=înțelepciunea străveche a stelelor")).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Checkout Flow", () => {
  test("should navigate to product page", async ({ page }) => {
    await page.goto("/produse/ghidul-lui-saturn-in-berbec");
    
    // Check we're on the product page by verifying URL
    await expect(page).toHaveURL("/produse/ghidul-lui-saturn-in-berbec");
  });
});