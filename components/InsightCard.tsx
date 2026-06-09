"use client";

import { useId } from "react";
import type { Insight } from "@/lib/types";

interface InsightCardProps {
  insight: Insight;
  variant?: "default" | "reveal";
}

export function InsightCard({ insight, variant = "default" }: InsightCardProps) {
  const isReveal = variant === "reveal";
  const titleId = useId();

  return (
    <article
      className={`glass-card rounded-3xl ${
        isReveal ? "border border-[#c4a574]/15 p-5 sm:p-6" : "p-8"
      }`}
      aria-labelledby={titleId}
    >
      <p className="text-xs uppercase tracking-widest text-[#c4a574]/70">
        {isReveal ? "What we noticed" : "Insight"}
      </p>
      <h2
        id={titleId}
        className={`font-display mt-1.5 text-[#f5ede0] ${
          isReveal ? "text-xl sm:text-[1.35rem]" : "mt-2 text-2xl text-white"
        }`}
      >
        {insight.title}
      </h2>
      <p
        className={`leading-relaxed ${
          isReveal ? "mt-2.5 text-sm text-[#f5ede0]/75" : "mt-4 text-white/80"
        }`}
      >
        {insight.body}
      </p>
      <dl
        className={`grid grid-cols-2 gap-4 text-sm ${
          isReveal ? "mt-4" : "mt-6"
        }`}
      >
        <div>
          <dt className={isReveal ? "text-[#f5ede0]/45" : "text-white/50"}>
            Potential savings
          </dt>
          <dd
            className={`font-display ${
              isReveal ? "text-lg text-[#f5ede0]" : "text-xl text-white"
            }`}
          >
            {insight.estimatedSavingKg} kg/mo
          </dd>
        </div>
        <div>
          <dt className={isReveal ? "text-[#f5ede0]/45" : "text-white/50"}>
            Difficulty
          </dt>
          <dd className={`capitalize ${isReveal ? "text-[#f5ede0]" : "text-white"}`}>
            {insight.difficulty}
          </dd>
        </div>
      </dl>
      {!isReveal && (
        <p className="mt-4 text-xs text-white/40">
          <span className="sr-only">Reasoning: </span>
          {insight.reason}
        </p>
      )}
    </article>
  );
}
