import { test, expect } from "@playwright/test";
import { clearCanopyStorage, desktopNavLink, seedProfile } from "./helpers";

test.describe("Navigation", () => {
  test("desktop nav links route correctly without profile", async ({ page }) => {
    await clearCanopyStorage(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await page.getByRole("navigation").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/about");

    await page.getByRole("navigation").getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
  });

  test("desktop nav links route correctly with profile", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await desktopNavLink(page, "Insights").click();
    await expect(page).toHaveURL("/dashboard");

    await desktopNavLink(page, "Track").click();
    await expect(page).toHaveURL("/track");

    await desktopNavLink(page, "Actions").click();
    await expect(page).toHaveURL("/actions");
  });

  test("mobile menu opens and navigates", async ({ page }) => {
    await clearCanopyStorage(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("link", { name: "About" }).last()).toBeVisible();

    await page.getByRole("link", { name: "About" }).last().click();
    await expect(page).toHaveURL("/about");
  });

  test("skip to main content link targets main landmark", async ({ page }) => {
    await clearCanopyStorage(page);
    await page.goto("/");

    const skip = page.getByRole("link", { name: "Skip to main content" });
    await skip.focus();
    await expect(skip).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeVisible();
  });
});

test.describe("Assessment static background", () => {
  test("onboarding does not autoplay background video", async ({ page }) => {
    await clearCanopyStorage(page);
    await page.goto("/onboarding");
    await expect(page.locator("video")).toHaveCount(0);
  });

  test("dashboard uses static background without video", async ({ page }) => {
    await seedProfile(page);
    await page.goto("/dashboard");
    await expect(page.locator("video")).toHaveCount(0);
  });
});
