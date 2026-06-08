import type { Insight } from "@/lib/types";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <article className="glass-card rounded-3xl p-8" aria-labelledby="insight-title">
      <p className="text-xs uppercase tracking-widest text-white/50">Assistant Insight</p>
      <h2 id="insight-title" className="font-display mt-2 text-2xl text-white">
        {insight.title}
      </h2>
      <p className="mt-4 leading-relaxed text-white/80">{insight.body}</p>
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-white/50">Potential savings</dt>
          <dd className="font-display text-xl text-white">
            {insight.estimatedSavingKg} kg/mo
          </dd>
        </div>
        <div>
          <dt className="text-white/50">Difficulty</dt>
          <dd className="capitalize text-white">{insight.difficulty}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-white/40">
        <span className="sr-only">Reasoning: </span>
        {insight.reason}
      </p>
    </article>
  );
}
