export type FootprintCategory =
  | "transport"
  | "diet"
  | "energy"
  | "shopping"
  | "waste";

export interface QuizAnswers {
  carKmPerWeek: number;
  transitKmPerWeek: number;
  flightsPerYear: number;
  beefMealsPerWeek: number;
  chickenMealsPerWeek: number;
  vegetarianMealsPerWeek: number;
  monthlyKwh: number;
  clothingItemsPerMonth: number;
  recyclingHabit: number;
}

export interface CategoryBreakdown {
  category: FootprintCategory;
  kgCo2PerYear: number;
  percentage: number;
}

export interface FootprintProfile {
  id: string;
  createdAt: string;
  answers: QuizAnswers;
  annualKgCo2: number;
  monthlyKgCo2: number;
  breakdown: CategoryBreakdown[];
}

export interface DailyLog {
  id: string;
  date: string;
  actionId: string;
  label: string;
  kgCo2Delta: number;
}

export type InsightType =
  | "high_impact_category"
  | "negative_trend"
  | "streak_reward"
  | "idle_user"
  | "goal_proximity";

export type Difficulty = "easy" | "medium" | "hard";

export interface Insight {
  type: InsightType;
  priority: number;
  title: string;
  body: string;
  estimatedSavingKg: number;
  difficulty: Difficulty;
  reason: string;
}

export interface ActionRecommendation {
  id: string;
  title: string;
  description: string;
  category: FootprintCategory;
  kgCo2SavedPerMonth: number;
  difficulty: Difficulty;
  score: number;
}

export interface AssistantContext {
  profile: FootprintProfile;
  logs: DailyLog[];
  streak: number;
  completedActions: string[];
}

export interface Equivalents {
  trees: number;
  kmDriven: number;
  shortFlights: number;
}

export interface LogAggregate {
  totalSaved: number;
  netMonthlyFootprint: number;
  last7DaysDelta: number;
}
