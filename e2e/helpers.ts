import { expect, type Locator, type Page } from "@playwright/test";

export const PROFILE_KEY = "canopy-profile";
export const LOGS_KEY = "canopy-logs";
export const QUIZ_STEPS = 10;

/** Precomputed from DEFAULT_QUIZ_ANSWERS via calculateProfileFromQuiz */
export const SEED_PROFILE = {
  id: "a0000000-0000-4000-8000-000000000001",
  createdAt: "2026-06-08T16:43:52.449Z",
  answers: {
    carKmPerWeek: 100,
    vehicleType: "petrol",
    transitKmPerWeek: 20,
    flightsPerYear: 2,
    beefMealsPerWeek: 2,
    chickenMealsPerWeek: 4,
    vegetarianMealsPerWeek: 7,
    monthlyKwh: 300,
    clothingItemsPerMonth: 2,
    recyclingHabit: 3,
  },
  annualKgCo2: 5241.1,
  monthlyKgCo2: 436.8,
  breakdown: [
    { category: "transport", kgCo2PerYear: 1998, percentage: 38.1 },
    { category: "diet", kgCo2PerYear: 1118, percentage: 21.3 },
    { category: "energy", kgCo2PerYear: 1440, percentage: 27.5 },
    { category: "shopping", kgCo2PerYear: 240, percentage: 4.6 },
    { category: "waste", kgCo2PerYear: 445.1, percentage: 8.5 },
  ],
} as const;

export async function clearCanopyStorage(page: Page) {
  await page.goto("/");
  await page.evaluate(
    ([profileKey, logsKey]) => {
      localStorage.removeItem(profileKey);
      localStorage.removeItem(logsKey);
      window.dispatchEvent(new Event("canopy-storage-update"));
    },
    [PROFILE_KEY, LOGS_KEY],
  );
}

export async function seedProfile(page: Page) {
  await page.goto("/");
  await page.evaluate((profile) => {
    localStorage.setItem("canopy-profile", JSON.stringify(profile));
    window.dispatchEvent(new Event("canopy-storage-update"));
  }, SEED_PROFILE);
}

export async function seedCorruptProfile(page: Page) {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("canopy-profile", "{not-valid-json");
  });
}

export async function gotoFresh(page: Page, path = "/") {
  await clearCanopyStorage(page);
  if (path !== "/") {
    await page.goto(path);
  }
}

export async function gotoWithProfile(page: Page, path: string) {
  await page.goto("/");
  await page.evaluate((profile) => {
    localStorage.removeItem("canopy-logs");
    localStorage.setItem("canopy-profile", JSON.stringify(profile));
    window.dispatchEvent(new Event("canopy-storage-update"));
  }, SEED_PROFILE);
  await page.goto(path);
  await expect(page).toHaveURL(path);
  await expect(page).not.toHaveURL("/onboarding");
}

export function desktopNavLink(page: Page, name: string) {
  return page
    .getByRole("navigation", { name: "Main navigation" })
    .locator("ul")
    .getByRole("link", { name, exact: true });
}

export function trackStatus(page: Page) {
  return page.getByRole("status");
}

export async function clickStable(locator: Locator) {
  await locator.waitFor({ state: "visible" });
  await locator.evaluate((el) => {
    (el as HTMLButtonElement).click();
  });
}

export function continueButton(page: Page, stepIndex: number) {
  return stepIndex === QUIZ_STEPS - 1
    ? page.getByRole("button", { name: "Complete assessment" })
    : page.getByRole("button", { name: "Go to next question" });
}

export async function completeOnboardingQuiz(page: Page) {
  await gotoFresh(page, "/onboarding");

  await expect(page.getByRole("heading", { name: "Discover Your Rhythm" })).toBeVisible();
  await expect(page.getByText(`Step 1 of ${QUIZ_STEPS}`)).toBeVisible();

  for (let step = 0; step < QUIZ_STEPS; step++) {
    await continueButton(page, step).click();
  }

  await page.waitForURL(/\/dashboard\?noticed=1/);
  await expect(page.getByText("Your footprint tells a story.")).toBeVisible({
    timeout: 15_000,
  });
}

export function revealContinueButton(page: Page) {
  return page.getByRole("button", {
    name: /Continue to your full insights|Explore Your Rhythm/i,
  });
}

export async function dismissReveal(page: Page) {
  await clickStable(revealContinueButton(page));
  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByRole("heading", { name: "Your Rhythm" })).toBeVisible();
}

export async function completeOnboardingToDashboard(page: Page) {
  await completeOnboardingQuiz(page);
  await dismissReveal(page);
}
