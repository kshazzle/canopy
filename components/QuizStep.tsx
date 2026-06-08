"use client";

interface QuizStepProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

export function QuizStep({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: QuizStepProps) {
  const inputId = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="glass-card rounded-3xl p-8">
      <label htmlFor={inputId} className="font-display block text-2xl text-white">
        {label}
      </label>
      <div className="mt-6 flex items-center gap-4">
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full flex-1 cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
        <output
          htmlFor={inputId}
          className="min-w-[5rem] text-right font-display text-3xl text-white"
        >
          {value} <span className="text-sm text-white/60">{unit}</span>
        </output>
      </div>
    </div>
  );
}
