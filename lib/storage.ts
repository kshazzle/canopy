import { z } from "zod";
import type { DailyLog, FootprintProfile, QuizAnswers } from "./types";
import { calculateProfileFromQuiz } from "./emissions";

const quizAnswersSchema = z.object({
  carKmPerWeek: z.number().min(0).max(2000),
  vehicleType: z.enum(["petrol", "hybrid", "ev"]),
  transitKmPerWeek: z.number().min(0).max(2000),
  flightsPerYear: z.number().min(0).max(50),
  beefMealsPerWeek: z.number().min(0).max(21),
  chickenMealsPerWeek: z.number().min(0).max(21),
  vegetarianMealsPerWeek: z.number().min(0).max(21),
  monthlyKwh: z.number().min(0).max(5000),
  clothingItemsPerMonth: z.number().min(0).max(30),
  recyclingHabit: z.number().min(1).max(5),
});

const footprintProfileSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  answers: quizAnswersSchema,
  annualKgCo2: z.number(),
  monthlyKgCo2: z.number(),
  breakdown: z.array(
    z.object({
      category: z.enum(["transport", "diet", "energy", "shopping", "waste"]),
      kgCo2PerYear: z.number(),
      percentage: z.number(),
    }),
  ),
});

const dailyLogSchema = z.object({
  id: z.string(),
  date: z.string(),
  actionId: z.string(),
  label: z.string(),
  kgCo2Delta: z.number(),
});

const PROFILE_KEY = "canopy-profile";
const LOGS_KEY = "canopy-logs";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeParse<T>(schema: z.ZodType<T>, value: unknown): T | null {
  const result = schema.safeParse(value);
  return result.success ? result.data : null;
}

export function getProfile(): FootprintProfile | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return safeParse(footprintProfileSchema, JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveProfile(profile: FootprintProfile): void {
  if (!isBrowser()) return;
  const validated = footprintProfileSchema.parse(profile);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(validated));
  emitStorageChange();
}

export function saveProfileFromQuiz(answers: QuizAnswers): FootprintProfile {
  const profile = calculateProfileFromQuiz(answers);
  saveProfile(profile);
  return profile;
}

export function clearProfile(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(PROFILE_KEY);
}

export function getLogs(): DailyLog[] {
  if (!isBrowser()) return [];

  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => safeParse(dailyLogSchema, item))
      .filter((item): item is DailyLog => item !== null);
  } catch {
    return [];
  }
}

const MAX_LOG_ENTRIES = 500;

export function saveLogs(logs: DailyLog[]): void {
  if (!isBrowser()) return;
  const validated = logs
    .map((item) => safeParse(dailyLogSchema, item))
    .filter((item): item is DailyLog => item !== null)
    .slice(0, MAX_LOG_ENTRIES);
  localStorage.setItem(LOGS_KEY, JSON.stringify(validated));
  emitStorageChange();
}

function emitStorageChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("canopy-storage-update"));
}

export function addLog(log: Omit<DailyLog, "id" | "date"> & { date?: string }): DailyLog {
  const entry: DailyLog = {
    id: crypto.randomUUID(),
    date: log.date ?? new Date().toISOString(),
    actionId: log.actionId,
    label: log.label,
    kgCo2Delta: log.kgCo2Delta,
  };

  const logs = getLogs();
  logs.unshift(entry);
  saveLogs(logs);
  return entry;
}

export function getCompletedActionIds(): string[] {
  return [...new Set(getLogs().map((log) => log.actionId))];
}

