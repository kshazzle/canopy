import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getInsights } from "@/lib/assistant";
import { DEFAULT_QUIZ_ANSWERS } from "@/lib/constants";
import { calculateStreak } from "@/lib/emissions";
import { addLog, getProfile, saveProfileFromQuiz } from "@/lib/storage";

function createStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };
}

describe("profile to insights integration", () => {
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

  it("flows from quiz save through logs to assistant insights", () => {
    const profile = saveProfileFromQuiz(DEFAULT_QUIZ_ANSWERS);
    expect(getProfile()?.id).toBe(profile.id);

    addLog({
      actionId: "meatless-meal",
      label: "Meatless meal",
      kgCo2Delta: -4.5,
    });

    const storedProfile = getProfile();
    expect(storedProfile).not.toBeNull();

    const logs = [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        actionId: "meatless-meal",
        label: "Meatless meal",
        kgCo2Delta: -4.5,
      },
    ];

    const insights = getInsights({
      profile: storedProfile!,
      logs,
      streak: calculateStreak(logs),
      completedActions: ["meatless-meal"],
    });

    expect(insights.length).toBeGreaterThan(0);
    expect(insights[0].reason.length).toBeGreaterThan(0);
  });
});
