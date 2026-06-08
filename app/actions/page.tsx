"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/GlassButton";
import { PageShell } from "@/components/PageShell";
import { CATEGORY_LABELS } from "@/lib/constants";
import { addLog } from "@/lib/storage";
import { useCanopyData } from "@/hooks/useCanopyData";

export default function ActionsPage() {
  const router = useRouter();
  const { profile, actions, ready, refresh } = useCanopyData();

  useEffect(() => {
    if (ready && !profile) {
      router.replace("/onboarding");
    }
  }, [ready, profile, router]);

  function handleLog(actionId: string, title: string, monthlySaving: number) {
    const dailySaving = -(monthlySaving / 30);
    addLog({
      actionId,
      label: title,
      kgCo2Delta: Math.round(dailySaving * 10) / 10,
    });
    refresh();
  }

  if (!ready || !profile) {
    return (
      <PageShell title="Actions">
        <p className="text-white/70">Loading…</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Recommended Actions"
      subtitle="Ranked by impact and feasibility for your profile. Your highest-emission categories are prioritized."
    >
      <ul className="space-y-6">
        {actions.map((action, index) => (
          <li key={action.id} className="glass-card rounded-3xl p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-widest text-white/50">
                  #{index + 1} · {CATEGORY_LABELS[action.category]}
                </p>
                <h2 className="font-display mt-2 text-2xl text-white">{action.title}</h2>
                <p className="mt-3 text-white/70">{action.description}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl text-white">
                  {action.kgCo2SavedPerMonth} kg
                </p>
                <p className="text-xs text-white/50">saved per month</p>
                <p className="mt-2 capitalize text-sm text-white/60">
                  {action.difficulty} · score {Math.round(action.score)}
                </p>
              </div>
            </div>
            <GlassButton
              onClick={() =>
                handleLog(action.id, action.title, action.kgCo2SavedPerMonth)
              }
              className="mt-6 px-6 py-2.5 text-sm"
              ariaLabel={`Log action: ${action.title}`}
            >
              Log This Action
            </GlassButton>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
