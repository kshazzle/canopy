"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionChip } from "@/components/ActionChip";
import { GlassButton } from "@/components/GlassButton";
import { PageShell } from "@/components/PageShell";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { TRACKABLE_ACTIONS } from "@/lib/constants";
import { addLog } from "@/lib/storage";
import { useCanopyData } from "@/hooks/useCanopyData";
import { useHydrated } from "@/hooks/useHydrated";

export default function TrackPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { profile, logs } = useCanopyData();
  const [customKm, setCustomKm] = useState(10);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!hydrated || profile) return;
    router.replace("/onboarding");
  }, [hydrated, profile, router]);

  function logAction(actionId: string, label: string, kgCo2Delta: number) {
    addLog({ actionId, label, kgCo2Delta });
    setMessage(`Logged: ${label}`);
    setTimeout(() => setMessage(""), 3000);
  }

  function logCustomDistance() {
    const km = Math.min(500, Math.max(0, customKm));
    const saved = -(km * 0.21);
    logAction("custom-distance", `Saved ${km} km of driving`, saved);
  }

  if (!profile) {
    return (
      <PageShell staticBackground title="Track">
        <p className="text-[#f5ede0]/70">Loading…</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      staticBackground
      title="Track Your Day"
      subtitle="Tap an action to log it. Every choice compounds toward a lighter footprint."
    >
      <PrivacyNotice />

      <div
        className="mb-6 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/80"
        role="status"
        aria-live="polite"
      >
        {message || `${logs.length} actions logged total`}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKABLE_ACTIONS.map((action) => (
          <ActionChip
            key={action.id}
            label={action.label}
            kgCo2Delta={action.kgCo2Delta}
            onClick={() => logAction(action.id, action.label, action.kgCo2Delta)}
          />
        ))}
      </div>

      <section className="glass-card mt-10 rounded-3xl p-8" aria-labelledby="custom-distance">
        <h2 id="custom-distance" className="font-display text-2xl text-white">
          Custom: km not driven
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Log how many kilometers you avoided by walking, biking, or working from home.
        </p>
        <div className="mt-6 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="custom-km" className="block text-sm text-white/70">
              Kilometers saved
            </label>
            <input
              id="custom-km"
              type="number"
              min={0}
              max={500}
              value={customKm}
              onChange={(e) => setCustomKm(Number(e.target.value))}
              className="focus-ring mt-2 w-32 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-white"
            />
          </div>
          <GlassButton onClick={logCustomDistance} className="px-6 py-2.5 text-sm">
            Log Distance
          </GlassButton>
        </div>
      </section>

      {logs.length > 0 && (
        <section className="mt-10" aria-labelledby="recent-logs">
          <h2 id="recent-logs" className="font-display mb-4 text-2xl text-white">
            Recent Activity
          </h2>
          <ul className="space-y-3">
            {logs.slice(0, 8).map((log) => (
              <li
                key={log.id}
                className="glass-card flex items-center justify-between rounded-2xl px-5 py-4 text-sm"
              >
                <span className="text-white">{log.label}</span>
                <span className={log.kgCo2Delta < 0 ? "text-green-300" : "text-red-300"}>
                  {log.kgCo2Delta} kg
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
