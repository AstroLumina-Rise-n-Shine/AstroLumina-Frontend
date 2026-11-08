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
    
    // Check CTA buttons - use testid for uniqueness
    await expect(page.locator("button:has-text('Servicii Astrologice')")).toBeVisible();
    await expect(page.locator("[data-testid='hero-produse-link']")).toBeVisible();
  });

  test("should navigate to services page", async ({ page }) => {
    await page.goto("/");
    
    await page.click("button:has-text('Servicii Astrologice')");
    
    await expect(page).toHaveURL("/servicii");
    await expect(page.locator("h2:has-text('Servicii Astrologice')")).toBeVisible();
  });

  test("should navigate to products page", async ({ page }) => {
    await page.goto("/");
    
    // Click the hero produse link (unique via testid to avoid navbar duplicate)
    await page.click("[data-testid='hero-produse-link']");
    
    await expect(page).toHaveURL("/produse");
  });

  test("should display service cards with correct information", async ({ page }) => {
    await page.goto("/servicii");
    
    // Check at least one service card is visible
    await expect(page.locator("text=Calculatorul Astral")).toBeVisible();
    await expect(page.locator("text=Calculatorul Fazei Lunare")).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("button:has-text('Servicii Astrologice')")).toBeVisible();
  });
});

test.describe("Checkout Flow", () => {
  test("should navigate to product page", async ({ page }) => {
    await page.goto("/produse/ghidul-lui-saturn-in-berbec");
    
    // Check we're on the product page by verifying URL
    await expect(page).toHaveURL("/produse/ghidul-lui-saturn-in-berbec");
  });
});