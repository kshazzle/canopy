import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_QUIZ_ANSWERS } from "@/lib/constants";
import {
  addLog,
  getLogs,
  getProfile,
  saveProfile,
  saveProfileFromQuiz,
} from "@/lib/storage";
import type { FootprintProfile } from "@/lib/types";

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
  id: "profile-1",
  createdAt: "2026-06-08T00:00:00.000Z",
  answers: DEFAULT_QUIZ_ANSWERS,
  annualKgCo2: 5000,
  monthlyKgCo2: 416.7,
  breakdown: [
    { category: "transport", kgCo2PerYear: 2000, percentage: 40 },
    { category: "diet", kgCo2PerYear: 1000, percentage: 20 },
    { category: "energy", kgCo2PerYear: 800, percentage: 16 },
    { category: "shopping", kgCo2PerYear: 700, percentage: 14 },
    { category: "waste", kgCo2PerYear: 500, percentage: 10 },
  ],
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
  });

  it("filters invalid log entries and keeps valid ones", () => {
    localStorage.setItem(
      "canopy-logs",
      JSON.stringify([
        {
          id: "ok",
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

  it("round-trips a valid profile through save and read", () => {
    saveProfile(validProfile);
    expect(getProfile()).toEqual(validProfile);
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
});
