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
  actionId: z.string().max(64),
  label: z.string().max(120),
  kgCo2Delta: z.number().min(-500).max(500),
});

const PROFILE_KEY = "canopy-profile";
const LOGS_KEY = "canopy-logs";
const MAX_LOG_ENTRIES = 500;

export class StorageQuotaError extends Error {
  constructor() {
    super("Local storage quota exceeded");
    this.name = "StorageQuotaError";
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeParse<T>(schema: z.ZodType<T>, value: unknown): T | null {
  const result = schema.safeParse(value);
  return result.success ? result.data : null;
}

function setLocalStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      throw new StorageQuotaError();
    }
    throw error;
  }
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
  setLocalStorageItem(PROFILE_KEY, JSON.stringify(validated));
  emitStorageChange();
}

export function saveProfileFromQuiz(answers: QuizAnswers): FootprintProfile {
  const validatedAnswers = quizAnswersSchema.parse(answers);
  const profile = calculateProfileFromQuiz(validatedAnswers);
  saveProfile(profile);
  return profile;
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

export function saveLogs(logs: DailyLog[]): void {
  if (!isBrowser()) return;
  const validated = logs
    .map((item) => safeParse(dailyLogSchema, item))
    .filter((item): item is DailyLog => item !== null)
    .slice(0, MAX_LOG_ENTRIES);
  setLocalStorageItem(LOGS_KEY, JSON.stringify(validated));
  emitStorageChange();
}

function emitStorageChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("canopy-storage-update"));
}

export function addLog(log: Omit<DailyLog, "id" | "date"> & { date?: string }): DailyLog {
  const entry = dailyLogSchema.parse({
    id: crypto.randomUUID(),
    date: log.date ?? new Date().toISOString(),
    actionId: log.actionId,
    label: log.label,
    kgCo2Delta: log.kgCo2Delta,
  });

  const logs = getLogs();
  logs.unshift(entry);
  saveLogs(logs);
  return entry;
}

export function getCompletedActionIds(logs: DailyLog[]): string[] {
  return [...new Set(logs.map((log) => log.actionId))];
}
