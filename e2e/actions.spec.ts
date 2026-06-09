import { test, expect } from "@playwright/test";
import { clickStable, gotoWithProfile } from "./helpers";

test.describe("Actions page", () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithProfile(page, "/actions");
    await expect(page.getByRole("heading", { name: "Recommended Actions" })).toBeVisible();
  });

  test("shows ranked recommendations", async ({ page }) => {
    await expect(page.getByText("#1 ·").first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
    await expect(page.getByText("saved per month").first()).toBeVisible();
  });

  test("actions are ordered with rank numbers", async ({ page }) => {
    await expect(page.getByText("#1 ·")).toBeVisible();
    await expect(page.getByText("#2 ·")).toBeVisible();
  });

  test("logging a recommended action succeeds", async ({ page }) => {
    const firstLog = page.getByRole("button", { name: /Log action:/i }).first();
    await clickStable(firstLog);

    const logs = await page.evaluate(() => localStorage.getItem("canopy-logs"));
    expect(logs).toBeTruthy();
    expect(logs!.length).toBeGreaterThan(2);
  });

  test("each action exposes log button with accessible name", async ({ page }) => {
    const logButtons = page.getByRole("button", { name: /Log action:/i });
    await expect(logButtons.first()).toBeVisible();
    expect(await logButtons.count()).toBeGreaterThanOrEqual(5);
  });
});
