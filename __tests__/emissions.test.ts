import { describe, expect, it } from "vitest";
import {
  aggregateDailyLogs,
  calculateProfileFromQuiz,
  calculateStreak,
  getFootprintGrade,
  getTopCategory,
  toEquivalents,
} from "@/lib/emissions";
import { DEFAULT_QUIZ_ANSWERS } from "@/lib/constants";
import type { DailyLog } from "@/lib/types";

describe("calculateProfileFromQuiz", () => {
  it("calculates annual footprint from quiz answers", () => {
    const profile = calculateProfileFromQuiz(DEFAULT_QUIZ_ANSWERS, "test-id");

    expect(profile.id).toBe("test-id");
    expect(profile.annualKgCo2).toBeGreaterThan(0);
    expect(profile.monthlyKgCo2).toBeCloseTo(profile.annualKgCo2 / 12, 1);
    expect(profile.breakdown).toHaveLength(5);
  });

  it("returns zero transport for no travel", () => {
    const profile = calculateProfileFromQuiz({
      ...DEFAULT_QUIZ_ANSWERS,
      carKmPerWeek: 0,
      transitKmPerWeek: 0,
      flightsPerYear: 0,
    });

    const transport = profile.breakdown.find((b) => b.category === "transport");
    expect(transport?.kgCo2PerYear).toBe(0);
  });

  it("identifies transport as top category for heavy drivers", () => {
    const profile = calculateProfileFromQuiz({
      ...DEFAULT_QUIZ_ANSWERS,
      carKmPerWeek: 500,
      flightsPerYear: 10,
      beefMealsPerWeek: 0,
      chickenMealsPerWeek: 0,
      vegetarianMealsPerWeek: 7,
    });

    const top = getTopCategory(profile);
    expect(top?.category).toBe("transport");
    expect(top?.percentage).toBeGreaterThan(35);
  });
});

describe("toEquivalents", () => {
  it("converts kg CO2 to understandable equivalents", () => {
    const eq = toEquivalents(4200);
    expect(eq.trees).toBe(200);
    expect(eq.kmDriven).toBe(20000);
    expect(eq.shortFlights).toBe(11);
  });
});

describe("getFootprintGrade", () => {
  it("assigns grade A for low footprints", () => {
    expect(getFootprintGrade(2500)).toBe("A");
  });

  it("assigns grade F for very high footprints", () => {
    expect(getFootprintGrade(20000)).toBe("F");
  });
});

describe("aggregateDailyLogs", () => {
  it("sums savings from negative deltas", () => {
    const profile = calculateProfileFromQuiz(DEFAULT_QUIZ_ANSWERS, "p1");
    const today = new Date().toISOString();

    const logs: DailyLog[] = [
      {
        id: "1",
        date: today,
        actionId: "meatless-meal",
        label: "Meatless meal",
        kgCo2Delta: -4.5,
      },
      {
        id: "2",
        date: today,
        actionId: "bike-instead",
        label: "Biked",
        kgCo2Delta: -2.1,
      },
    ];

    const result = aggregateDailyLogs(profile, logs);
    expect(result.totalSaved).toBe(6.6);
    expect(result.netMonthlyFootprint).toBeLessThan(profile.monthlyKgCo2);
  });
});

describe("calculateStreak", () => {
  it("returns 0 for empty logs", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("counts consecutive days with savings", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const format = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}T12:00:00.000Z`;
    };

    const logs: DailyLog[] = [
      {
        id: "1",
        date: format(today),
        actionId: "recycled",
        label: "Recycled",
        kgCo2Delta: -0.5,
      },
      {
        id: "2",
        date: format(yesterday),
        actionId: "recycled",
        label: "Recycled",
        kgCo2Delta: -0.5,
      },
    ];

    expect(calculateStreak(logs)).toBe(2);
  });
});
