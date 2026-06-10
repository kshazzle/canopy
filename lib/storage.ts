import type { DailyLog, FootprintProfile, QuizAnswers } from "./types";
import { calculateProfileFromQuiz } from "./emissions";
import {
  dailyLogSchema,
  footprintProfileSchema,
  quizAnswersSchema,
} from "./schemas";
import { parseOrNull } from "./validation";

const PROFILE_KEY = "canopy-profile";
const LOGS_KEY = "canopy-logs";
const MAX_LOG_ENTRIES = 500;

/** Thrown when browser localStorage quota is exceeded. */
export class StorageQuotaError extends Error {
  constructor() {
    super("Local storage quota exceeded");
    this.name = "StorageQuotaError";
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
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

/** Read the saved footprint profile, or null if missing or invalid. */
export function getProfile(): FootprintProfile | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;

    const parsed = parseOrNull(footprintProfileSchema, JSON.parse(raw));
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

/** Persist a footprint profile after schema validation and integrity checks. */
export function saveProfile(profile: FootprintProfile): void {
  if (!isBrowser()) return;
  const integrity = footprintProfileSchema.parse(withProfileIntegrity(profile));
  setLocalStorageItem(PROFILE_KEY, JSON.stringify(integrity));
  emitStorageChange();
}

/** Calculate, validate, and store a profile from quiz answers. */
export function saveProfileFromQuiz(answers: QuizAnswers): FootprintProfile {
  const validatedAnswers = quizAnswersSchema.parse(answers);
  const profile = calculateProfileFromQuiz(validatedAnswers);
  saveProfile(profile);
  return profile;
}

/** Read validated daily logs from local storage. */
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
      .map((item) => parseOrNull(dailyLogSchema, item))
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

/** Persist validated logs (capped at {@link MAX_LOG_ENTRIES}). */
export function saveLogs(logs: DailyLog[]): void {
  if (!isBrowser()) return;
  const validated = logs
    .map((item) => parseOrNull(dailyLogSchema, item))
    .filter((item): item is DailyLog => item !== null)
    .slice(0, MAX_LOG_ENTRIES);
  setLocalStorageItem(LOGS_KEY, JSON.stringify(validated));
  emitStorageChange();
}

function emitStorageChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("canopy-storage-update"));
}

/** Append a validated log entry and persist the updated list. */
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
