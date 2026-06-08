import { EMISSION_FACTORS, EQUIVALENTS } from "./constants";
import type {
  CategoryBreakdown,
  DailyLog,
  Equivalents,
  FootprintCategory,
  FootprintProfile,
  LogAggregate,
  QuizAnswers,
} from "./types";

function roundKg(value: number): number {
  return Math.round(value * 10) / 10;
}

function calculateCategoryTotals(answers: QuizAnswers): Record<FootprintCategory, number> {
  const transport =
    answers.carKmPerWeek * 52 * EMISSION_FACTORS.carKgPerKm +
    answers.transitKmPerWeek * 52 * EMISSION_FACTORS.transitKgPerKm +
    answers.flightsPerYear *
      EMISSION_FACTORS.flightAvgKm *
      EMISSION_FACTORS.flightKgPerKm;

  const diet =
    answers.beefMealsPerWeek * 52 * EMISSION_FACTORS.beefKgPerMeal +
    answers.chickenMealsPerWeek * 52 * EMISSION_FACTORS.chickenKgPerMeal +
    answers.vegetarianMealsPerWeek * 52 * EMISSION_FACTORS.vegetarianKgPerMeal;

  const energy = answers.monthlyKwh * 12 * EMISSION_FACTORS.gridKgPerKwh;
  const shopping = answers.clothingItemsPerMonth * 12 * EMISSION_FACTORS.clothingKgPerItem;

  const wasteBase = (transport + diet + energy + shopping) * 0.08;
  const wasteMultiplier = 1.4 - answers.recyclingHabit * 0.08;
  const waste = wasteBase * wasteMultiplier;

  return {
    transport: roundKg(transport),
    diet: roundKg(diet),
    energy: roundKg(energy),
    shopping: roundKg(shopping),
    waste: roundKg(waste),
  };
}

function buildBreakdown(totals: Record<FootprintCategory, number>): CategoryBreakdown[] {
  const annualKgCo2 = Object.values(totals).reduce((sum, value) => sum + value, 0);

  return (Object.entries(totals) as [FootprintCategory, number][]).map(
    ([category, kgCo2PerYear]) => ({
      category,
      kgCo2PerYear,
      percentage:
        annualKgCo2 === 0 ? 0 : roundKg((kgCo2PerYear / annualKgCo2) * 100),
    }),
  );
}

export function calculateProfileFromQuiz(
  answers: QuizAnswers,
  id = crypto.randomUUID(),
): FootprintProfile {
  const totals = calculateCategoryTotals(answers);
  const breakdown = buildBreakdown(totals);
  const annualKgCo2 = roundKg(
    breakdown.reduce((sum, item) => sum + item.kgCo2PerYear, 0),
  );

  return {
    id,
    createdAt: new Date().toISOString(),
    answers,
    annualKgCo2,
    monthlyKgCo2: roundKg(annualKgCo2 / 12),
    breakdown,
  };
}

export function toEquivalents(kgCo2: number): Equivalents {
  return {
    trees: Math.max(1, Math.round(kgCo2 / EQUIVALENTS.kgPerTreePerYear)),
    kmDriven: Math.round(kgCo2 / EQUIVALENTS.carKgPerKm),
    shortFlights: Math.max(0, Math.round(kgCo2 / EQUIVALENTS.shortFlightKg)),
  };
}

export function getFootprintGrade(annualKgCo2: number): string {
  if (annualKgCo2 < 3000) return "A";
  if (annualKgCo2 < 5000) return "B";
  if (annualKgCo2 < 8000) return "C";
  if (annualKgCo2 < 12000) return "D";
  if (annualKgCo2 < 16000) return "E";
  return "F";
}

export function getFootprintScore(annualKgCo2: number): number {
  const maxReference = 20000;
  const score = 100 - (annualKgCo2 / maxReference) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function aggregateDailyLogs(
  profile: FootprintProfile,
  logs: DailyLog[],
): LogAggregate {
  const totalSaved = roundKg(
    logs.reduce((sum, log) => sum + Math.abs(Math.min(0, log.kgCo2Delta)), 0),
  );

  const monthlyAdjustment = roundKg(
    logs
      .filter((log) => isWithinDays(log.date, 30))
      .reduce((sum, log) => sum + log.kgCo2Delta, 0),
  );

  const last7DaysDelta = roundKg(
    logs
      .filter((log) => isWithinDays(log.date, 7))
      .reduce((sum, log) => sum + log.kgCo2Delta, 0),
  );

  const netMonthlyFootprint = roundKg(
    Math.max(0, profile.monthlyKgCo2 + monthlyAdjustment),
  );

  return { totalSaved, netMonthlyFootprint, last7DaysDelta };
}

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateStreak(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;

  const uniqueDates = [
    ...new Set(
      logs
        .filter((log) => log.kgCo2Delta < 0)
        .map((log) => log.date.slice(0, 10)),
    ),
  ].sort((a, b) => b.localeCompare(a));

  if (uniqueDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = toLocalDateString(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toLocalDateString(yesterday);

  const startOffset =
    uniqueDates[0] === todayStr
      ? 0
      : uniqueDates[0] === yesterdayStr
        ? 1
        : -1;

  if (startOffset < 0) return 0;

  let streak = 0;
  for (let i = 0; i < uniqueDates.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - (startOffset + i));
    const expectedStr = toLocalDateString(expected);

    if (uniqueDates[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function daysSinceLastLog(logs: DailyLog[]): number {
  if (logs.length === 0) return Infinity;

  const latest = logs
    .map((log) => new Date(log.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  latest.setHours(0, 0, 0, 0);

  return Math.floor((today.getTime() - latest.getTime()) / (1000 * 60 * 60 * 24));
}

function isWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}

export function getTopCategory(
  profile: FootprintProfile,
): CategoryBreakdown | undefined {
  return [...profile.breakdown].sort(
    (a, b) => b.kgCo2PerYear - a.kgCo2PerYear,
  )[0];
}
