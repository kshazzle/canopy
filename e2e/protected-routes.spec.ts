import { test, expect } from "@playwright/test";
import { clearCanopyStorage, gotoFresh, seedCorruptProfile } from "./helpers";

const PROTECTED_PATHS = ["/dashboard", "/track", "/actions"] as const;

test.describe("Protected routes without profile", () => {
  test.beforeEach(async ({ page }) => {
    await clearCanopyStorage(page);
  });

  for (const path of PROTECTED_PATHS) {
    test(`${path} redirects to onboarding`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL("/onboarding");
    });
  }

  test("corrupt profile redirects to onboarding", async ({ page }) => {
    await seedCorruptProfile(page);
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/onboarding");
  });
});

test.describe("Public routes without profile", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFresh(page);
  });

  test("about page is accessible", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "About Canopy" })).toBeVisible();
  });
});
