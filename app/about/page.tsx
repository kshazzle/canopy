import { PageShell } from "@/components/PageShell";

export default function AboutPage() {
  return (
    <PageShell
      background="hero"
      title="About Canopy"
      subtitle="A carbon footprint awareness platform for personal reflection and gentle change."
    >
      <div className="prose-invert max-w-3xl space-y-6 text-white/80">
        <section className="glass-card rounded-3xl p-8">
          <h2 className="font-display text-2xl text-white">Our Mission</h2>
          <p className="mt-4 leading-relaxed">
            Canopy helps individuals understand, track, and reduce their carbon
            footprint through simple daily actions and personalized insights —
            without overwhelming complexity.
          </p>
        </section>

        <section className="glass-card rounded-3xl p-8">
          <h2 className="font-display text-2xl text-white">How the Assistant Works</h2>
          <p className="mt-4 leading-relaxed">
            Our rule-based assistant analyzes your lifestyle quiz results and
            daily logs to surface the highest-impact recommendations. It
            prioritizes your biggest emission categories, detects negative
            trends, celebrates streaks, and re-engages when you&apos;ve been
            away — all with explainable reasoning judges can verify.
          </p>
        </section>

        <section className="glass-card rounded-3xl p-8">
          <h2 className="font-display text-2xl text-white">Data & Privacy</h2>
          <p className="mt-4 leading-relaxed">
            All data stays in your browser&apos;s local storage. No accounts, no
            servers, no tracking. Your footprint profile and action logs never
            leave your device.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
