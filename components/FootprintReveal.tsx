"use client";

import { useEffect, useState } from "react";
import { GlassButton } from "@/components/GlassButton";
import { InsightCard } from "@/components/InsightCard";
import type { Insight } from "@/lib/types";

type Phase = "story" | "noticed" | "insights";

interface FootprintRevealProps {
  insights: Insight[];
  onComplete: () => void;
  static?: boolean;
}

const STORY_MS = 2400;
const NOTICED_MS = 2000;
const INSIGHT_STAGGER_MS = 700;

export function FootprintReveal({
  insights,
  onComplete,
  static: isStatic = false,
}: FootprintRevealProps) {
  const featured = insights.slice(0, 2);
  const [phase, setPhase] = useState<Phase>(isStatic ? "insights" : "story");
  const [visibleCount, setVisibleCount] = useState(isStatic ? featured.length : 0);

  useEffect(() => {
    if (isStatic) return;

    if (phase === "story") {
      const timer = window.setTimeout(() => setPhase("noticed"), STORY_MS);
      return () => window.clearTimeout(timer);
    }

    if (phase === "noticed") {
      const timer = window.setTimeout(() => setPhase("insights"), NOTICED_MS);
      return () => window.clearTimeout(timer);
    }
  }, [phase, isStatic]);

  useEffect(() => {
    if (isStatic || phase !== "insights" || visibleCount >= featured.length) return;

    const timer = window.setTimeout(
      () => setVisibleCount((count) => Math.min(count + 1, featured.length)),
      visibleCount === 0 ? 400 : INSIGHT_STAGGER_MS,
    );

    return () => window.clearTimeout(timer);
  }, [phase, visibleCount, featured.length, isStatic]);

  const showNoticed = isStatic || phase === "noticed" || phase === "insights";
  const showInsights = isStatic || phase === "insights";
  const showContinue = isStatic || (phase === "insights" && visibleCount >= featured.length);

  return (
    <div className="footprint-reveal flex min-h-0 w-full max-w-3xl flex-1 flex-col items-center justify-start overflow-y-auto px-2 py-2 pb-6 sm:py-4">
      <div className="w-full shrink-0 text-center">
        <p className="font-display text-[clamp(1.45rem,4.5vw,2.15rem)] leading-[1.15] tracking-[-0.02em] text-[#faf5ec] [text-shadow:0_1px_14px_rgba(10,7,5,0.5)]">
          Your footprint tells a story.
        </p>

        <p
          className={`font-display mt-3 text-[clamp(1.1rem,3vw,1.5rem)] leading-snug text-[#f5ede0]/80 sm:mt-4 ${
            isStatic
              ? "opacity-100"
              : `transition-all duration-1000 ${
                  showNoticed
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`
          }`}
          aria-hidden={!showNoticed}
        >
          Here&apos;s what we noticed.
        </p>
      </div>

      <div
        className={`mt-5 w-full shrink-0 space-y-4 sm:mt-6 ${
          isStatic
            ? "opacity-100"
            : `transition-all duration-700 ${
                showInsights ? "opacity-100" : "pointer-events-none opacity-0"
              }`
        }`}
        aria-live="polite"
      >
        {featured.slice(0, visibleCount).map((insight) => (
          <div key={`${insight.type}-${insight.title}`}>
            <InsightCard insight={insight} variant="reveal" />
          </div>
        ))}
      </div>

      <div
        className={`mt-5 shrink-0 pb-2 sm:mt-6 ${
          isStatic
            ? "opacity-100"
            : `transition-all duration-700 ${
                showContinue
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0"
              }`
        }`}
      >
        <GlassButton
          onClick={onComplete}
          variant="premium"
          motionless
          className="px-10 py-3.5 text-sm font-medium tracking-wide"
          ariaLabel="Continue to your full insights"
        >
          Explore Your Rhythm
        </GlassButton>
      </div>
    </div>
  );
}
