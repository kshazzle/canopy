"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getInsights, getPersonalizedActions } from "@/lib/assistant";
import {
  aggregateDailyLogs,
  calculateStreak,
  getFootprintGrade,
  getFootprintScore,
  toEquivalents,
} from "@/lib/emissions";
import type { CanopyData } from "@/hooks/canopy-data-types";
import { getCompletedActionIds, getLogs, getProfile } from "@/lib/storage";
import type { AssistantContext, DailyLog, FootprintProfile } from "@/lib/types";

type CanopySnapshot = {
  profile: FootprintProfile | null;
  logs: DailyLog[];
};

const SERVER_SNAPSHOT: CanopySnapshot = { profile: null, logs: [] };

const listeners = new Set<() => void>();

let cachedSnapshot: CanopySnapshot = SERVER_SNAPSHOT;
let cacheKey = "";

function buildCacheKey(profile: FootprintProfile | null, logs: DailyLog[]): string {
  if (!profile && logs.length === 0) return "empty";
  const latestLogId = logs[0]?.id ?? "";
  return `${profile?.id ?? "none"}:${logs.length}:${latestLogId}`;
}

function getSnapshot(): CanopySnapshot {
  const profile = getProfile();
  const logs = getLogs();
  const key = buildCacheKey(profile, logs);

  if (key === cacheKey) {
    return cachedSnapshot;
  }

  cacheKey = key;
  cachedSnapshot = { profile, logs };
  return cachedSnapshot;
}

function getServerSnapshot(): CanopySnapshot {
  return SERVER_SNAPSHOT;
}

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

export function useProfile(): FootprintProfile | null {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot().profile,
    () => null,
  );
}

export function useCanopyData(): CanopyData {
  const { profile, logs } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const completedActions = useMemo(
    () => getCompletedActionIds(logs),
    [logs],
  );

  const context = useMemo<AssistantContext | null>(() => {
    if (!profile) return null;
    return {
      profile,
      logs,
      streak: calculateStreak(logs),
      completedActions,
    };
  }, [profile, logs, completedActions]);

  const aggregate = useMemo(
    () => (profile ? aggregateDailyLogs(profile, logs) : null),
    [profile, logs],
  );

  const insights = useMemo(() => (context ? getInsights(context) : []), [context]);

  const actions = useMemo(
    () => (context ? getPersonalizedActions(context) : []),
    [context],
  );

  const equivalents = useMemo(
    () => (profile ? toEquivalents(profile.annualKgCo2) : null),
    [profile],
  );

  const grade = useMemo(
    () => (profile ? getFootprintGrade(profile.annualKgCo2) : null),
    [profile],
  );

  const score = useMemo(
    () => (profile ? getFootprintScore(profile.annualKgCo2) : null),
    [profile],
  );

  return {
    profile,
    logs,
    aggregate,
    insights,
    actions,
    equivalents,
    grade,
    score,
  };
}
