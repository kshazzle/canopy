"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { FootprintGauge } from "@/components/FootprintGauge";
import { FootprintReveal } from "@/components/FootprintReveal";
import { GlassButton } from "@/components/GlassButton";
import { InsightCard } from "@/components/InsightCard";
import { PageShell } from "@/components/PageShell";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { useCanopyData } from "@/hooks/useCanopyData";
import { useRequireProfile } from "@/hooks/useRequireProfile";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showReveal = searchParams.get("noticed") === "1";
  const { hydrated } = useRequireProfile();

  const {
    profile,
    aggregate,
    insights,
    equivalents,
    grade,
    score,
  } = useCanopyData();

  function completeReveal() {
    router.replace("/dashboard");
  }

  if (!hydrated || !profile || !aggregate || !equivalents || !grade || score === null) {
    return (
      <PageShell staticBackground title="Your Rhythm">
        <p className="text-[#f5ede0]/70">Gathering what we noticed…</p>
      </PageShell>
    );
  }

  if (showReveal) {
    return (
      <PageShell fitViewport scrollable centered staticBackground>
        <div className="flex min-h-0 w-full max-w-3xl flex-1 flex-col">
          <FootprintReveal
            static
            insights={insights}
            onComplete={completeReveal}
          />
        </div>
      </PageShell>
    );
  }

  const topInsight = insights[0];

  return (
    <PageShell
      staticBackground
      title="Your Rhythm"
      subtitle="Patterns from your life — refined as you notice and log."
    >
      <PrivacyNotice />

      <section className="mb-8" aria-labelledby="noticed-heading">
        <h2
          id="noticed-heading"
          className="font-display text-[clamp(1.5rem,3vw,2rem)] text-[#f5ede0]"
        >
          Here&apos;s what we noticed
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[#f5ede0]/55">
          Small observations from your assessment — where attention might matter most.
        </p>
        {topInsight && (
          <div className="mt-6">
            <InsightCard insight={topInsight} variant="reveal" />
          </div>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <FootprintGauge
          score={score}
          grade={grade}
          monthlyKg={aggregate.netMonthlyFootprint}
        />
        <CategoryBreakdown breakdown={profile.breakdown} />
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-3" aria-label="Footprint equivalents">
        <div className="glass-card rounded-3xl p-6 text-center">
          <p className="font-display text-3xl text-[#f5ede0]">{equivalents.trees}</p>
          <p className="mt-2 text-sm text-[#f5ede0]/55">
            trees to offset annually
          </p>
        </div>
        <div className="glass-card rounded-3xl p-6 text-center">
          <p className="font-display text-3xl text-[#f5ede0]">
            {equivalents.kmDriven.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-[#f5ede0]/55">km driven equivalent</p>
        </div>
        <div className="glass-card rounded-3xl p-6 text-center">
          <p className="font-display text-3xl text-[#f5ede0]">{aggregate.totalSaved}</p>
          <p className="mt-2 text-sm text-[#f5ede0]/55">kg saved from logged choices</p>
        </div>
      </section>

      {insights.length > 1 && (
        <section className="mt-8 grid gap-6 md:grid-cols-2" aria-label="More insights">
          {insights.slice(1, 3).map((insight) => (
            <InsightCard key={`${insight.type}-${insight.title}`} insight={insight} />
          ))}
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <GlassButton href="/track" className="px-8 py-3 text-sm">
          Log Today&apos;s Choices
        </GlassButton>
        <GlassButton href="/actions" className="px-8 py-3 text-sm">
          View Gentle Suggestions
        </GlassButton>
        <Link
          href="/onboarding"
          className="focus-ring rounded-full px-8 py-3 text-sm text-[#f5ede0]/70 underline underline-offset-4 hover:text-[#f5ede0]"
        >
          Retake assessment
        </Link>
      </div>
    </PageShell>
  );
}
