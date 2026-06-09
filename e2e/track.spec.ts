import { test, expect } from "@playwright/test";
import { clickStable, gotoWithProfile, trackStatus } from "./helpers";

test.describe("Track page", () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithProfile(page, "/track");
    await expect(page.getByRole("heading", { name: "Track Your Day" })).toBeVisible();
  });

  test("shows trackable actions and privacy notice", async ({ page }) => {
    await expect(
      page.getByText("Saved on this device only — no account needed."),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Log action: Biked instead of drove/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Log action: Used public transit/i }),
    ).toBeVisible();
  });

  test("logging a quick action updates the status message", async ({ page }) => {
    await clickStable(
      page.getByRole("button", { name: /Log action: Biked instead of drove/i }),
    );
    await expect(trackStatus(page)).toContainText("Logged: Biked instead of drove");
  });

  test("custom distance logging works", async ({ page }) => {
    await page.getByLabel("Kilometers saved").fill("25");
    await clickStable(page.getByRole("button", { name: "Log Distance" }));
    await expect(trackStatus(page)).toContainText("Logged: Saved 25 km of driving");
  });

  test("custom distance clamps to valid range", async ({ page }) => {
    await page.getByLabel("Kilometers saved").fill("9999");
    await clickStable(page.getByRole("button", { name: "Log Distance" }));
    await expect(trackStatus(page)).toContainText("Logged: Saved 500 km of driving");
  });

  test("recent activity appears after logging", async ({ page }) => {
    await clickStable(
      page.getByRole("button", { name: /Log action: Recycled properly/i }),
    );
    await expect(page.getByRole("heading", { name: "Recent Activity" })).toBeVisible();
    await expect(
      page.locator('section[aria-labelledby="recent-logs"]').getByText("Recycled properly"),
    ).toBeVisible();
  });

  test("logs persist in localStorage", async ({ page }) => {
    await clickStable(
      page.getByRole("button", { name: /Log action: Ate a meatless meal/i }),
    );

    const logs = await page.evaluate(() => localStorage.getItem("canopy-logs"));
    expect(logs).toContain("meatless");
  });
});
