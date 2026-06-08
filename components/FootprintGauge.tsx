interface FootprintGaugeProps {
  score: number;
  grade: string;
  monthlyKg: number;
}

export function FootprintGauge({ score, grade, monthlyKg }: FootprintGaugeProps) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-card flex flex-col items-center rounded-3xl p-8">
      <h2 className="font-display text-2xl text-white">Your Footprint Score</h2>
      <div className="relative mt-6" role="img" aria-label={`Footprint score ${score} out of 100, grade ${grade}`}>
        <svg width="140" height="140" viewBox="0 0 120 120" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl text-white">{grade}</span>
          <span className="text-sm text-white/70">{score}/100</span>
        </div>
      </div>
      <p className="mt-4 text-center text-white/80">
        <span className="font-display text-3xl text-white">{monthlyKg}</span> kg CO₂
        <span className="block text-sm">estimated this month</span>
      </p>
    </div>
  );
}
