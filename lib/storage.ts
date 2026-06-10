import type { DailyLog, FootprintProfile, QuizAnswers } from "./types";
import { calculateProfileFromQuiz } from "./emissions";
import {
  dailyLogSchema,
  footprintProfileSchema,
  quizAnswersSchema,
} from "./schemas";

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

function safeParse<T>(schema: { safeParse: (value: unknown) => { success: boolean; data?: T } }, value: unknown): T | null {
  const result = schema.safeParse(value);
  return result.success ? (result.data as T) : null;
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

function purgeKey(key: string): void {
  localStorage.removeItem(key);
}

function withProfileIntegrity(profile: FootprintProfile): FootprintProfile {
  const recomputed = calculateProfileFromQuiz(profile.answers, profile.id);
  return {
    ...recomputed,
    createdAt: profile.createdAt,
  };
}

export function getProfile(): FootprintProfile | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;

    const parsed = safeParse(footprintProfileSchema, JSON.parse(raw));
    if (!parsed) {
      purgeKey(PROFILE_KEY);
      return null;
    }

    return withProfileIntegrity(parsed);
  } catch {
    purgeKey(PROFILE_KEY);
    return null;
  }
}

export function saveProfile(profile: FootprintProfile): void {
  if (!isBrowser()) return;
  const validated = footprintProfileSchema.parse(profile);
  const integrity = withProfileIntegrity(validated);
  footprintProfileSchema.parse(integrity);
  setLocalStorageItem(PROFILE_KEY, JSON.stringify(integrity));
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
    if (!Array.isArray(parsed)) {
      purgeKey(LOGS_KEY);
      return [];
    }

    const logs = parsed
      .map((item) => safeParse(dailyLogSchema, item))
      .filter((item): item is DailyLog => item !== null);

    if (logs.length === 0 && parsed.length > 0) {
      purgeKey(LOGS_KEY);
    }

    return logs;
  } catch {
    purgeKey(LOGS_KEY);
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
    label: log.label.trim(),
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
