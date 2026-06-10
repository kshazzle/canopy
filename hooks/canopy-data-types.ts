import type {
  ActionRecommendation,
  AssistantContext,
  DailyLog,
  Equivalents,
  FootprintProfile,
  Insight,
  LogAggregate,
} from "@/lib/types";

export interface CanopyData {
  profile: FootprintProfile | null;
  logs: DailyLog[];
  aggregate: LogAggregate | null;
  insights: Insight[];
  actions: ActionRecommendation[];
  equivalents: Equivalents | null;
  grade: string | null;
  score: number | null;
}

export type { AssistantContext };
