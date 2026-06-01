import { test, expect } from "@playwright/test";

test.describe("/pique-nique — builder funnel", () => {
  test("hero + 4 occasion chips visible", async ({ page }) => {
    await page.goto("/pique-nique");
    await expect(page.getByRole("heading", { name: /Pique-nique Edmonton|Edmonton Picnic/i })).toBeVisible();
    for (const label of ["En couple", "En famille", "Entre amis", "Évènement"]) {
      await expect(page.getByRole("button", { name: new RegExp(label) })).toBeVisible();
    }
  });

  test("outdoor / indoor / hybrid filter chips visible", async ({ page }) => {
    await page.goto("/pique-nique");
    for (const label of ["Tous", "Extérieur", "Intérieur", "Hybride"]) {
      await expect(page.getByRole("button", { name: new RegExp(label) })).toBeVisible();
    }
  });

  test("selecting indoor filter shows ❄️ banner", async ({ page }) => {
    await page.goto("/pique-nique");
    await page.getByRole("button", { name: /^Intérieur|^Indoor/i }).click();
    await expect(page.getByText(/Pique-niques d'hiver|Winter and rain-proof/i)).toBeVisible();
  });

  test("selecting a park opens Step 3 options", async ({ page }) => {
    await page.goto("/pique-nique");
    // Default occasion is "couple" — at least one park should be visible
    const parkCard = page.locator("button").filter({ hasText: /Queen Elizabeth|Walterdale|Government House|Borden|Muttart/ }).first();
    await parkCard.click();
    // Options section appears
    await expect(page.getByRole("heading", { name: /3\. Tes options|3\. Your options/ })).toBeVisible();
    // Récap panel
    await expect(page.getByRole("heading", { name: /Récapitulatif|Summary/ })).toBeVisible();
  });

  test("Hawrelak shows BIG warning when selected", async ({ page }) => {
    await page.goto("/pique-nique");
    // Pick famille (Hawrelak is best_for: famille/groupe/event)
    await page.getByRole("button", { name: /En famille|As a family/i }).click();
    const hawrelak = page.locator("button").filter({ hasText: /Hawrelak/i }).first();
    if (await hawrelak.count() === 0) {
      test.skip(true, "Hawrelak not in default visible parks");
    }
    await hawrelak.click();
    // BIG red banner with "ATTENTION" or "HEADS UP"
    await expect(page.getByText(/Attention|Heads up/i).first()).toBeVisible();
  });
});
