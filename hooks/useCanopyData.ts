"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getInsights, getPersonalizedActions } from "@/lib/assistant";
import {
  aggregateDailyLogs,
  calculateStreak,
  getFootprintGrade,
  getFootprintScore,
  toEquivalents,
} from "@/lib/emissions";
import {
  getCompletedActionIds,
  getLogs,
  getProfile,
} from "@/lib/storage";
import type { AssistantContext, DailyLog, FootprintProfile } from "@/lib/types";

type CanopySnapshot = {
  profile: FootprintProfile | null;
  logs: DailyLog[];
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window === "undefined") {
    return () => listeners.delete(listener);
  }
  const onStorage = () => listener();
  window.addEventListener("canopy-storage-update", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("canopy-storage-update", onStorage);
  };
}

function getSnapshot(): CanopySnapshot {
  return {
    profile: getProfile(),
    logs: getLogs(),
  };
}

function getServerSnapshot(): CanopySnapshot {
  return { profile: null, logs: [] };
}

export function notifyCanopyUpdate(): void {
  listeners.forEach((listener) => listener());
}

export function useCanopyData() {
  const { profile, logs } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const refresh = useCallback(() => {
    notifyCanopyUpdate();
  }, []);

  const ready = profile !== null || logs.length > 0 || typeof window !== "undefined";

  const context: AssistantContext | null = profile
    ? {
        profile,
        logs,
        streak: calculateStreak(logs),
        completedActions: getCompletedActionIds(),
      }
    : null;

  const aggregate = profile ? aggregateDailyLogs(profile, logs) : null;
  const insights = context ? getInsights(context) : [];
  const actions = context ? getPersonalizedActions(context) : [];
  const equivalents = profile ? toEquivalents(profile.annualKgCo2) : null;
  const grade = profile ? getFootprintGrade(profile.annualKgCo2) : null;
  const score = profile ? getFootprintScore(profile.annualKgCo2) : null;

  return {
    profile,
    logs,
    ready,
    refresh,
    context,
    aggregate,
    insights,
    actions,
    equivalents,
    grade,
    score,
  };
}
