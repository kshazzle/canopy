import { test, expect } from "@playwright/test";
import { continueButton, gotoFresh, QUIZ_STEPS } from "./helpers";

test.describe("Onboarding assessment", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFresh(page, "/onboarding");
  });

  test("shows assessment framing and first question", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Discover Your Rhythm" })).toBeVisible();
    await expect(page.getByText("Carbon Footprint Assessment")).toBeVisible();
    await expect(page.getByText("Transport")).toBeVisible();
    await expect(page.getByText(`Step 1 of ${QUIZ_STEPS}`)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "How many km do you drive per week?" }),
    ).toBeVisible();
    await expect(page.getByRole("slider")).toBeVisible();
  });

  test("back button is disabled on first step", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Go to previous question" })).toBeDisabled();
  });

  test("plus and minus adjust the displayed value", async ({ page }) => {
    const output = page.locator("output");
    await expect(output).toHaveText("100");

    await page.getByRole("button", { name: "Increase value" }).click();
    await expect(output).toHaveText("110");

    await page.getByRole("button", { name: "Decrease value" }).click();
    await expect(output).toHaveText("100");
  });

  test("slider updates value", async ({ page }) => {
    const slider = page.getByRole("slider");
    await slider.fill("200");
    await expect(page.locator("output")).toHaveText("200");
  });

  test("shows vehicle type question after weekly driving distance", async ({ page }) => {
    await continueButton(page, 0).click();
    await expect(page.getByText(`Step 2 of ${QUIZ_STEPS}`)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "What do you usually drive?" }),
    ).toBeVisible();
    await expect(page.getByRole("radio", { name: /Petrol/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /Hybrid/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /EV/i })).toBeVisible();
  });

  test("navigates forward and backward between steps", async ({ page }) => {
    await continueButton(page, 0).click();
    await continueButton(page, 1).click();
    await expect(page.getByText(`Step 3 of ${QUIZ_STEPS}`)).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "How many km do you travel by bus or train per week?",
      }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Go to previous question" }).click();
    await expect(page.getByText(`Step 2 of ${QUIZ_STEPS}`)).toBeVisible();
  });

  test("progress advances through all ten steps", async ({ page }) => {
    for (let step = 0; step < QUIZ_STEPS - 1; step++) {
      await expect(page.getByText(`Step ${step + 1} of ${QUIZ_STEPS}`)).toBeVisible();
      await continueButton(page, step).click();
    }

    await expect(page.getByText(`Step ${QUIZ_STEPS} of ${QUIZ_STEPS}`)).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /How consistently do you recycle/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Complete assessment" }),
    ).toBeVisible();
  });

  test("completing quiz saves profile and opens reveal", async ({ page }) => {
    for (let step = 0; step < QUIZ_STEPS; step++) {
      await continueButton(page, step).click();
    }

    await expect(page).toHaveURL(/\/dashboard\?noticed=1/);
    await expect(page.getByText("Your footprint tells a story.")).toBeVisible();
    await expect(page.getByText("Here's what we noticed.")).toBeVisible();

    const profile = await page.evaluate(() => localStorage.getItem("canopy-profile"));
    expect(profile).toBeTruthy();
  });

  test("recycling step enforces minimum of 1", async ({ page }) => {
    for (let step = 0; step < QUIZ_STEPS - 1; step++) {
      await continueButton(page, step).click();
    }

    const decrease = page.getByRole("button", { name: "Decrease value" });
    while (await decrease.isEnabled()) {
      await decrease.click();
    }
    await expect(decrease).toBeDisabled();
    await expect(page.locator("output")).toHaveText("1");
  });
});

test.describe("Onboarding edge cases", () => {
  test("corrupt stored profile does not block fresh assessment", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("canopy-profile", "{bad-json");
    });
    await page.goto("/onboarding");
    await expect(page.getByText(`Step 1 of ${QUIZ_STEPS}`)).toBeVisible();
  });
});
