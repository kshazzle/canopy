import { describe, expect, it } from "vitest";
import {
  getInsights,
  getPersonalizedActions,
  getTopAction,
  scoreAction,
} from "@/lib/assistant";
import { DEFAULT_QUIZ_ANSWERS, RECOMMENDED_ACTIONS } from "@/lib/constants";
import { calculateProfileFromQuiz } from "@/lib/emissions";
import type { AssistantContext, DailyLog } from "@/lib/types";

function buildContext(overrides: Partial<AssistantContext> = {}): AssistantContext {
  const profile = calculateProfileFromQuiz(
    {
      ...DEFAULT_QUIZ_ANSWERS,
      carKmPerWeek: 400,
      flightsPerYear: 8,
    },
    "d0000000-0000-4000-8000-000000000001",
  );

  return {
    profile,
    logs: [],
    streak: 0,
    completedActions: [],
    ...overrides,
  };
}

describe("getInsights", () => {
  it("prioritizes transport insight for high-transport profiles", () => {
    const insights = getInsights(buildContext());
    expect(insights[0].type).toBe("high_impact_category");
    expect(insights[0].title.toLowerCase()).toContain("transport");
  });

  it("triggers streak reward when streak >= 3", () => {
    const insights = getInsights(buildContext({ streak: 4 }));
    const streakInsight = insights.find((i) => i.type === "streak_reward");
    expect(streakInsight).toBeDefined();
    expect(streakInsight?.title).toContain("4-day streak");
  });

  it("triggers idle user insight after 5 days without logs", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 6);

    const logs: DailyLog[] = [
      {
        id: "old",
        date: oldDate.toISOString(),
        actionId: "recycled",
        label: "Recycled",
        kgCo2Delta: -0.5,
      },
    ];

    const insights = getInsights(buildContext({ logs }));
    const idleInsight = insights.find((i) => i.type === "idle_user");
    expect(idleInsight).toBeDefined();
  });

  it("triggers goal proximity when close to monthly reduction target", () => {
    const profile = calculateProfileFromQuiz(
      DEFAULT_QUIZ_ANSWERS,
      "e0000000-0000-4000-8000-000000000001",
    );
    const monthlyTarget = profile.monthlyKgCo2 * 0.1;
    const savedPerLog = (monthlyTarget * 0.95) / 5;
    const logs: DailyLog[] = Array.from({ length: 5 }, (_, index) => ({
      id: `f0000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
      date: new Date().toISOString(),
      actionId: "meatless-meal",
      label: "Meatless meal",
      kgCo2Delta: -savedPerLog,
    }));

    const insights = getInsights(buildContext({ profile, logs }));
    expect(insights.some((insight) => insight.type === "goal_proximity")).toBe(true);
  });

  it("triggers negative trend for net increase in last 7 days", () => {
    const logs: DailyLog[] = [
      {
        id: "1",
        date: new Date().toISOString(),
        actionId: "custom",
        label: "Long drive",
        kgCo2Delta: 5,
      },
    ];

    const insights = getInsights(buildContext({ logs }));
    const trendInsight = insights.find((i) => i.type === "negative_trend");
    expect(trendInsight).toBeDefined();
  });
});

describe("scoreAction", () => {
  it("boosts actions matching top emission category", () => {
    const context = buildContext();
    const transportAction = RECOMMENDED_ACTIONS.find((a) => a.id === "swap-commute")!;
    const energyAction = RECOMMENDED_ACTIONS.find((a) => a.id === "led-bulbs")!;

    const transportScore = scoreAction(transportAction, context);
    const energyScore = scoreAction(energyAction, context);

    expect(transportScore).toBeGreaterThan(energyScore);
  });
});

describe("getPersonalizedActions", () => {
  it("orders actions by descending score for transport-heavy profiles", () => {
    const actions = getPersonalizedActions(buildContext());
    expect(actions.length).toBeGreaterThan(1);
    for (let i = 1; i < actions.length; i++) {
      expect(actions[i - 1].score).toBeGreaterThanOrEqual(actions[i].score);
    }
    expect(actions[0].category).toBe("transport");
  });
});

describe("getTopAction", () => {
  it("returns highest scored action", () => {
    const action = getTopAction(buildContext());
    expect(action.id).toBeTruthy();
    expect(action.score).toBeGreaterThan(0);
  });
});
