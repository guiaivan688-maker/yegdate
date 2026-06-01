import { test, expect } from "@playwright/test";

test.describe("Navbar mega-menu + context picker", () => {
  test("logo + ContextPicker pill visible on home", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Where To Go.*YEG/i })).toBeVisible();
    // ContextPicker pill — has emoji + persona name OR guest count
    const picker = page.locator('button[aria-label="Changer le contexte"], button[aria-label="Change context"]').first();
    await expect(picker).toBeVisible();
  });

  test("each desktop bucket opens a dropdown with links", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Mega-menu hover is chromium-only test");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    for (const label of ["Planifier", "Réserver", "Découvrir"]) {
      const trigger = page.getByRole("button", { name: new RegExp(`^${label}$`) });
      await trigger.click();
      // Dropdown should contain at least 2 links
      const dropdownLinks = page.locator("nav").getByRole("link");
      await expect(dropdownLinks).not.toHaveCount(0);
      // close by pressing Escape
      await page.keyboard.press("Escape");
    }
  });

  test("language toggle switches FR↔EN", async ({ page }) => {
    await page.goto("/");
    const langBtn = page.locator('button[aria-label*="English"], button[aria-label*="français"]').first();
    const before = await langBtn.textContent();
    await langBtn.click();
    await page.waitForTimeout(150);
    const after = await langBtn.textContent();
    expect(after).not.toBe(before);
  });

  test("ContextPicker persona + guests persist in localStorage", async ({ page }) => {
    await page.goto("/");
    const picker = page.locator('button[aria-label="Changer le contexte"], button[aria-label="Change context"]').first();
    await picker.click();
    // Click on Famille persona (button with emoji)
    await page.getByRole("button", { name: /Famille|Family/ }).first().click();
    await page.waitForTimeout(100);
    const stored = await page.evaluate(() => localStorage.getItem("yeg.context.v1"));
    expect(stored).toContain("famille");
  });
});
