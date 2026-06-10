import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_QUIZ_ANSWERS } from "@/lib/constants";
import { calculateProfileFromQuiz } from "@/lib/emissions";
import {
  addLog,
  getLogs,
  getProfile,
  saveLogs,
  saveProfile,
  saveProfileFromQuiz,
  StorageQuotaError,
} from "@/lib/storage";
import type { FootprintProfile } from "@/lib/types";

const PROFILE_ID = "b0000000-0000-4000-8000-000000000001";
const LOG_ID = "c0000000-0000-4000-8000-000000000001";

function createStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };
}

const validProfile: FootprintProfile = {
  ...calculateProfileFromQuiz(DEFAULT_QUIZ_ANSWERS, PROFILE_ID),
  createdAt: "2026-06-08T00:00:00.000Z",
};

describe("storage", () => {
  beforeEach(() => {
    const storage = createStorageMock();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", {
      ...globalThis,
      localStorage: storage,
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null for corrupt profile JSON", () => {
    localStorage.setItem("canopy-profile", "{ not valid json");
    expect(getProfile()).toBeNull();
    expect(localStorage.getItem("canopy-profile")).toBeNull();
  });

  it("rejects profile data that fails Zod validation", () => {
    localStorage.setItem(
      "canopy-profile",
      JSON.stringify({
        id: "bad",
        createdAt: "2026-06-08",
        answers: { carKmPerWeek: -50 },
        annualKgCo2: 100,
        monthlyKgCo2: 10,
        breakdown: [],
      }),
    );
    expect(getProfile()).toBeNull();
    expect(localStorage.getItem("canopy-profile")).toBeNull();
  });

  it("filters invalid log entries and keeps valid ones", () => {
    localStorage.setItem(
      "canopy-logs",
      JSON.stringify([
        {
          id: LOG_ID,
          date: "2026-06-08T12:00:00.000Z",
          actionId: "bike-instead",
          label: "Biked",
          kgCo2Delta: -2.1,
        },
        { id: "bad", actionId: "missing-fields" },
        "not-an-object",
      ]),
    );

    const logs = getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].actionId).toBe("bike-instead");
  });

  it("purges logs with unknown action ids", () => {
    localStorage.setItem(
      "canopy-logs",
      JSON.stringify([
        {
          id: LOG_ID,
          date: "2026-06-08T12:00:00.000Z",
          actionId: "not-a-real-action",
          label: "Bad",
          kgCo2Delta: -1,
        },
      ]),
    );

    expect(getLogs()).toHaveLength(0);
    expect(localStorage.getItem("canopy-logs")).toBeNull();
  });

  it("round-trips a valid profile through save and read", () => {
    saveProfile(validProfile);
    expect(getProfile()?.id).toBe(PROFILE_ID);
    expect(getProfile()?.annualKgCo2).toBe(validProfile.annualKgCo2);
  });

  it("recomputes tampered footprint totals on save", () => {
    saveProfile({
      ...validProfile,
      annualKgCo2: 100,
      monthlyKgCo2: 10,
    });

    const profile = getProfile();
    expect(profile?.annualKgCo2).toBe(validProfile.annualKgCo2);
    expect(profile?.monthlyKgCo2).toBe(validProfile.monthlyKgCo2);
  });

  it("creates a profile from quiz answers", () => {
    const profile = saveProfileFromQuiz(DEFAULT_QUIZ_ANSWERS);
    expect(profile.annualKgCo2).toBeGreaterThan(0);
    expect(getProfile()?.id).toBe(profile.id);
  });

  it("appends a new log entry", () => {
    saveProfile(validProfile);
    addLog({
      actionId: "meatless-meal",
      label: "Meatless meal",
      kgCo2Delta: -4.5,
    });

    const logs = getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].kgCo2Delta).toBe(-4.5);
  });

  it("rejects invalid log payloads on write", () => {
    expect(() =>
      addLog({
        actionId: "unknown-action" as "bike-instead",
        label: "Bad",
        kgCo2Delta: -1,
      }),
    ).toThrow();
  });

  it("caps stored logs at 500 entries", () => {
    const logs = Array.from({ length: 505 }, (_, index) => ({
      id: `d0000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
      date: "2026-06-08T12:00:00.000Z",
      actionId: "bike-instead" as const,
      label: "Biked",
      kgCo2Delta: -2.1,
    }));

    localStorage.setItem("canopy-logs", JSON.stringify(logs));
    saveLogs(getLogs());

    expect(getLogs()).toHaveLength(500);
  });

  it("throws when localStorage quota is exceeded", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    });

    expect(() => saveProfile(validProfile)).toThrow(StorageQuotaError);
  });
});
