import { test, expect } from "@playwright/test";

test.describe("/reserver — booking funnel (P0 conversion path)", () => {
  test("page loads with hero copy", async ({ page }) => {
    await page.goto("/reserver");
    await expect(page.getByRole("heading", { name: /Réserver une expérience|Book an experience/i })).toBeVisible();
  });

  test("shows offers OR friendly empty state", async ({ page }) => {
    await page.goto("/reserver");
    // Wait for loading state to clear
    await page.waitForTimeout(2000);
    // Either offer cards or empty state
    const hasOffers = await page.getByRole("button", { name: /Réserver|Book/i }).count();
    if (hasOffers > 0) {
      // Has offers — test the funnel
      await page.getByRole("button", { name: /Réserver|Book/i }).first().click();
      await expect(page.getByLabel(/Ton nom|Your name/i)).toBeVisible();
      await expect(page.getByLabel(/Ton courriel|Your email/i)).toBeVisible();
    } else {
      // Empty state — verify user-friendly copy (not admin jargon)
      await expect(page.getByText(/cure de nouvelles|curating new/i)).toBeVisible();
    }
  });

  test("date input has min=today (cannot book in the past)", async ({ page }) => {
    await page.goto("/reserver");
    await page.waitForTimeout(2000);
    const hasOffers = await page.getByRole("button", { name: /Réserver|Book/i }).count();
    test.skip(hasOffers === 0, "No offers available — skipping date check");
    await page.getByRole("button", { name: /Réserver|Book/i }).first().click();
    const dateInput = page.locator('input[type="date"]').first();
    await expect(dateInput).toBeVisible();
    const min = await dateInput.getAttribute("min");
    expect(min).toBeTruthy();
    expect(min).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // min should be today (or close)
    const today = new Date().toISOString().slice(0, 10);
    expect(min).toBe(today);
  });

  test("form requires email + name", async ({ page }) => {
    await page.goto("/reserver");
    await page.waitForTimeout(2000);
    const hasOffers = await page.getByRole("button", { name: /Réserver|Book/i }).count();
    test.skip(hasOffers === 0, "No offers available");
    await page.getByRole("button", { name: /Réserver|Book/i }).first().click();
    const email = page.locator('input[type="email"]').first();
    await expect(email).toHaveAttribute("required", "");
    const nameInput = page.getByLabel(/Ton nom|Your name/i);
    await expect(nameInput).toHaveAttribute("required", "");
  });
});
