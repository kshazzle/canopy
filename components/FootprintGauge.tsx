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
      <h2 className="font-display text-2xl text-[#f5ede0]">Your monthly rhythm</h2>
      <p className="mt-2 text-center text-sm text-[#f5ede0]/50">
        A quiet snapshot — patterns, not a verdict
      </p>
      <div
        className="relative mt-6"
        role="img"
        aria-label={`Footprint pattern indicator: grade ${grade}, ${score} out of 100`}
      >
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
      <p className="mt-4 text-center text-[#f5ede0]/75">
        <span className="font-display text-3xl text-[#f5ede0]">{monthlyKg}</span> kg
        <span className="block text-sm text-[#f5ede0]/50">
          estimated monthly impact
        </span>
      </p>
    </div>
  );
}
