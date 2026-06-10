import { test, expect } from "@playwright/test";
import { gotoFresh } from "./helpers";

test.describe("About page", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFresh(page, "/about");
  });

  test("shows mission and privacy sections", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "About Canopy" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Our Mission" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "How the Assistant Works" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Data & Privacy" })).toBeVisible();
    await expect(page.getByText(/stay in your browser/)).toBeVisible();
    await expect(page.getByText(/cookieless page analytics/i)).toBeVisible();
  });

  test("uses cinematic hero background video", async ({ page }) => {
    const video = page.locator("video");
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute("autoplay", "");
  });
});
