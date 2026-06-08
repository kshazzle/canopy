"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { FootprintGauge } from "@/components/FootprintGauge";
import { GlassButton } from "@/components/GlassButton";
import { InsightCard } from "@/components/InsightCard";
import { PageShell } from "@/components/PageShell";
import { useCanopyData } from "@/hooks/useCanopyData";

export default function DashboardPage() {
  const router = useRouter();
  const {
    profile,
    ready,
    aggregate,
    insights,
    equivalents,
    grade,
    score,
    context,
  } = useCanopyData();

  useEffect(() => {
    if (ready && !profile) {
      router.replace("/onboarding");
    }
  }, [ready, profile, router]);

  if (!ready || !profile || !aggregate || !equivalents || !grade || score === null || !context) {
    return (
      <PageShell title="Insights">
        <p className="text-white/70">Loading your footprint data…</p>
      </PageShell>
    );
  }

  const topInsight = insights[0];

  return (
    <PageShell
      title="Your Carbon Insights"
      subtitle="Personalized analysis based on your lifestyle assessment and daily choices."
    >
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
          <p className="text-3xl font-display text-white">{equivalents.trees}</p>
          <p className="mt-2 text-sm text-white/70">trees needed to offset annually</p>
        </div>
        <div className="glass-card rounded-3xl p-6 text-center">
          <p className="text-3xl font-display text-white">{equivalents.kmDriven.toLocaleString()}</p>
          <p className="mt-2 text-sm text-white/70">km driven equivalent</p>
        </div>
        <div className="glass-card rounded-3xl p-6 text-center">
          <p className="text-3xl font-display text-white">{aggregate.totalSaved}</p>
          <p className="mt-2 text-sm text-white/70">kg CO₂ saved from logged actions</p>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="assistant-heading">
        <h2 id="assistant-heading" className="sr-only">
          Assistant recommendation
        </h2>
        <InsightCard insight={topInsight} />
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <GlassButton href="/track" className="px-8 py-3 text-sm">
          Log Today&apos;s Actions
        </GlassButton>
        <GlassButton href="/actions" className="px-8 py-3 text-sm">
          View Recommended Actions
        </GlassButton>
        <Link
          href="/onboarding"
          className="focus-ring rounded-full px-8 py-3 text-sm text-white/70 underline underline-offset-4 hover:text-white"
        >
          Retake assessment
        </Link>
      </div>
    </PageShell>
  );
}
