import { test, expect } from "@playwright/test";

const SEGMENTS = [
  { path: "/couples",  heading: /Sorties en Couple|Couple Outings/i },
  { path: "/famille",  heading: /Sorties en Famille|Family Outings/i },
  { path: "/amis",     heading: /Sorties Entre Amis|Outings with Friends/i },
  { path: "/business", heading: /Événements d'Affaires|Business Events/i },
];

for (const s of SEGMENTS) {
  test.describe(s.path, () => {
    test("renders hero with H1", async ({ page }) => {
      await page.goto(s.path);
      await expect(page.getByRole("heading", { name: s.heading, level: 1 })).toBeVisible();
    });

    test("guest counter +/- updates", async ({ page }) => {
      await page.goto(s.path);
      const inc = page.getByRole("button", { name: /Augmenter|Increase/i }).first();
      const dec = page.getByRole("button", { name: /Diminuer|Decrease/i }).first();
      await expect(inc).toBeVisible();
      await expect(dec).toBeVisible();
      // Click + several times and verify the displayed number changes
      const display = page.locator("span.tabular-nums").first();
      const before = await display.textContent();
      await inc.click();
      await inc.click();
      const after = await display.textContent();
      expect(after).not.toBe(before);
    });

    test("activity cards render", async ({ page }) => {
      await page.goto(s.path);
      // At least 1 activity card with a price
      await expect(page.locator("article, a[href^='/activite/']").first()).toBeVisible({ timeout: 10_000 });
    });
  });
}
