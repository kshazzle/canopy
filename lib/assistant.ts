import { MONTHLY_REDUCTION_TARGET_PERCENT, RECOMMENDED_ACTIONS } from "./constants";
import {
  aggregateDailyLogs,
  daysSinceLastLog,
  getTopCategory,
} from "./emissions";
import type {
  ActionRecommendation,
  AssistantContext,
  FootprintCategory,
  Insight,
} from "./types";

const DIFFICULTY_WEIGHT: Record<ActionRecommendation["difficulty"], number> = {
  easy: 1,
  medium: 0.7,
  hard: 0.4,
};

const CATEGORY_ACTION_MAP: Record<FootprintCategory, string> = {
  transport: "swap-commute",
  diet: "meatless-monday",
  energy: "led-bulbs",
  shopping: "buy-secondhand",
  waste: "recycle-more",
};

export function scoreAction(
  action: Omit<ActionRecommendation, "score">,
  context: AssistantContext,
): number {
  const topCategory = getTopCategory(context.profile)?.category;
  const categoryBoost = action.category === topCategory ? 1.5 : 1;
  const completedPenalty = context.completedActions.includes(action.id) ? 0.5 : 1;

  return (
    action.kgCo2SavedPerMonth *
    DIFFICULTY_WEIGHT[action.difficulty] *
    categoryBoost *
    completedPenalty
  );
}

export function getTopAction(context: AssistantContext): ActionRecommendation {
  const scored = RECOMMENDED_ACTIONS.map((action) => ({
    ...action,
    score: scoreAction(action, context),
  })).sort((a, b) => b.score - a.score);

  const top = scored[0];
  if (!top) {
    throw new Error("No recommended actions configured");
  }
  return top;
}

export function getPersonalizedActions(
  context: AssistantContext,
): ActionRecommendation[] {
  return RECOMMENDED_ACTIONS.map((action) => ({
    ...action,
    score: scoreAction(action, context),
  })).sort((a, b) => b.score - a.score);
}

export function getInsights(context: AssistantContext): Insight[] {
  const insights: Insight[] = [];
  const aggregate = aggregateDailyLogs(context.profile, context.logs);
  const topCategory = getTopCategory(context.profile);
  const daysIdle = daysSinceLastLog(context.logs);
  const monthlyTarget =
    context.profile.monthlyKgCo2 * (MONTHLY_REDUCTION_TARGET_PERCENT / 100);
  const progressToGoal = aggregate.totalSaved;

  if (topCategory && topCategory.percentage > 35) {
    const actionId = CATEGORY_ACTION_MAP[topCategory.category];
    const action = RECOMMENDED_ACTIONS.find((item) => item.id === actionId);

    insights.push({
      type: "high_impact_category",
      priority: 1,
      title: `${capitalize(topCategory.category)} is your biggest lever`,
      body: `${topCategory.percentage}% of your footprint comes from ${topCategory.category}. Small shifts here have outsized impact.`,
      estimatedSavingKg: action?.kgCo2SavedPerMonth ?? 10,
      difficulty: action?.difficulty ?? "medium",
      reason: `Top category exceeds 35% threshold at ${topCategory.percentage}%.`,
    });
  }

  if (aggregate.last7DaysDelta > 2) {
    insights.push({
      type: "negative_trend",
      priority: 2,
      title: "Your footprint ticked up this week",
      body: "Recent logs show a net increase. Try one easy win today — a meatless meal or a transit trip.",
      estimatedSavingKg: 4.5,
      difficulty: "easy",
      reason: `Last 7-day delta is +${aggregate.last7DaysDelta} kg CO₂.`,
    });
  }

  if (context.streak >= 3) {
    insights.push({
      type: "streak_reward",
      priority: 3,
      title: `${context.streak}-day streak — keep going`,
      body: "Consistency compounds. Add one new habit this week to deepen your impact.",
      estimatedSavingKg: getTopAction(context).kgCo2SavedPerMonth,
      difficulty: "medium",
      reason: `Active logging streak of ${context.streak} days.`,
    });
  }

  if (daysIdle >= 5) {
    insights.push({
      type: "idle_user",
      priority: 4,
      title: "We miss your green choices",
      body: "Log one action today — even recycling counts. Momentum starts with a single tap.",
      estimatedSavingKg: 0.5,
      difficulty: "easy",
      reason: `No logs recorded in ${daysIdle} days.`,
    });
  }

  if (
    monthlyTarget > 0 &&
    progressToGoal >= monthlyTarget * 0.9 &&
    progressToGoal < monthlyTarget
  ) {
    insights.push({
      type: "goal_proximity",
      priority: 5,
      title: "Almost at your monthly goal",
      body: `You're within ${Math.round(monthlyTarget - progressToGoal)} kg of your ${MONTHLY_REDUCTION_TARGET_PERCENT}% reduction target.`,
      estimatedSavingKg: monthlyTarget - progressToGoal,
      difficulty: "easy",
      reason: `Saved ${progressToGoal} kg of ${monthlyTarget} kg monthly target.`,
    });
  }

  if (insights.length === 0) {
    const topAction = getTopAction(context);
    insights.push({
      type: "high_impact_category",
      priority: 1,
      title: "Your next best move",
      body: topAction.description,
      estimatedSavingKg: topAction.kgCo2SavedPerMonth,
      difficulty: topAction.difficulty,
      reason: "Default recommendation when no priority rules trigger.",
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
