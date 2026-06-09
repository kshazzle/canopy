import { test, expect } from "@playwright/test";
import {
  completeOnboardingToDashboard,
  dismissReveal,
  gotoWithProfile,
  revealContinueButton,
} from "./helpers";

test.describe("Dashboard reveal flow", () => {
  test("post-assessment reveal shows story and insights", async ({ page }) => {
    await gotoWithProfile(page, "/dashboard?noticed=1");

    await expect(page.getByText("Your footprint tells a story.")).toBeVisible();
    await expect(page.getByText("Here's what we noticed.")).toBeVisible();
    await expect(page.getByText("What we noticed").first()).toBeVisible();
    await expect(revealContinueButton(page)).toBeVisible();
  });

  test("reveal content is not clipped — headline and CTA reachable", async ({ page }) => {
    await gotoWithProfile(page, "/dashboard?noticed=1");

    const headline = page.getByText("Your footprint tells a story.");
    const cta = revealContinueButton(page);
    const reveal = page.locator(".footprint-reveal");

    await expect(headline).toBeVisible();
    await reveal.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await expect(cta).toBeVisible();
  });

  test("explore button dismisses reveal to full dashboard", async ({ page }) => {
    await gotoWithProfile(page, "/dashboard?noticed=1");
    await dismissReveal(page);

    await expect(page.getByRole("heading", { name: "Your Rhythm" })).toBeVisible();
    await expect(page.getByText("Here's what we noticed")).toBeVisible();
    await expect(page.getByText("Your monthly rhythm")).toBeVisible();
    await expect(page.getByText("Where your carbon footprint comes from")).toBeVisible();
  });
});

test.describe("Dashboard with profile", () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithProfile(page, "/dashboard");
  });

  test("shows privacy notice and footprint sections", async ({ page }) => {
    await expect(
      page.getByText("Saved on this device only — no account needed."),
    ).toBeVisible();
    await expect(page.getByText("Your monthly rhythm")).toBeVisible();
    await expect(page.getByText("trees to offset annually")).toBeVisible();
    await expect(page.getByText("km driven equivalent")).toBeVisible();
  });

  test("navigation links to track and actions", async ({ page }) => {
    await page.getByRole("link", { name: "Log Today's Choices" }).click({ force: true });
    await expect(page).toHaveURL("/track");

    await page.goto("/dashboard");
    await page.getByRole("link", { name: "View Gentle Suggestions" }).click({ force: true });
    await expect(page).toHaveURL("/actions");
  });

  test("retake assessment link opens onboarding", async ({ page }) => {
    await page.getByRole("link", { name: "Retake assessment" }).click({ force: true });
    await expect(page).toHaveURL("/onboarding");
  });
});

test.describe("Full onboarding journey", () => {
  test("completes quiz and lands on dashboard", async ({ page }) => {
    await completeOnboardingToDashboard(page);
    await expect(page.getByRole("heading", { name: "Your Rhythm" })).toBeVisible();
  });
});
