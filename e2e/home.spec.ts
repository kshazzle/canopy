import { test, expect } from "@playwright/test";
import { clearCanopyStorage, desktopNavLink, seedProfile } from "./helpers";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await clearCanopyStorage(page);
  });

  test.describe("desktop", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("shows hero copy and primary CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Live Lighter/i })).toBeVisible();
    await expect(
      page.getByText("Pay attention to your choices. Notice what shifts."),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Begin Your Assessment" }),
    ).toBeVisible();
    await expect(page.getByText("3 minutes · Just you · No account")).toBeVisible();
  });

    test("shows whisper copy at bottom", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("First, understand your rhythm.")).toBeVisible();
  });

    test("navbar without profile shows public links only", async ({ page }) => {
      await page.goto("/");

      await expect(desktopNavLink(page, "Home")).toBeVisible();
      await expect(desktopNavLink(page, "About")).toBeVisible();
      await expect(desktopNavLink(page, "Insights")).toHaveCount(0);
      await expect(page.getByRole("link", { name: "Start Assessment" })).toBeVisible();
    });

    test("navbar with profile shows app links and My Insights", async ({ page }) => {
      await seedProfile(page);
      await page.goto("/");

      await expect(desktopNavLink(page, "Insights")).toBeVisible();
      await expect(desktopNavLink(page, "Track")).toBeVisible();
      await expect(desktopNavLink(page, "Actions")).toBeVisible();
      await expect(page.getByRole("link", { name: "My Insights" })).toBeVisible();
    });

    test("hero CTA navigates to onboarding", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("link", { name: "Begin Your Assessment" }).click();
      await expect(page).toHaveURL("/onboarding");
      await expect(page.getByRole("heading", { name: "Discover Your Rhythm" })).toBeVisible();
    });
  });
});
