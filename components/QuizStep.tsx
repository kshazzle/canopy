"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CSSProperties } from "react";
import { CategoryTheme } from "@/components/CategoryTheme";
import type { FootprintCategory } from "@/lib/types";

interface QuizStepProps {
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  category: FootprintCategory;
  onChange: (value: number) => void;
  className?: string;
  /** Skip counter pulse and animated number transitions */
  static?: boolean;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value: number, step: number, min: number, max: number) {
  const rounded = Math.round(value / step) * step;
  return clamp(rounded, min, max);
}

export function QuizStep({
  value,
  min,
  max,
  step,
  unit,
  category,
  onChange,
  className = "",
  static: isStatic = false,
}: QuizStepProps) {
  const inputId = useId();
  const wheelRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const pct = `${((value - min) / (max - min)) * 100}%`;
  const shownValue = isStatic ? value : displayValue;

  useEffect(() => {
    if (isStatic) return;

    const start = displayRef.current;
    const end = value;
    if (start === end) return;

    const duration = 220;
    const startTime = performance.now();
    let frame = 0;

    setIsAdjusting(true);

    function tick(now: number) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayValue(current);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplayValue(end);
        displayRef.current = end;
        setIsAdjusting(false);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, isStatic]);

  const nudge = useCallback(
    (delta: number) => {
      onChange(roundToStep(value + delta, step, min, max));
    },
    [onChange, step, min, max, value],
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -step : step;
      nudge(delta);
    },
    [nudge, step],
  );

  useEffect(() => {
    const node = wheelRef.current;
    if (!node) return;
    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <div
      ref={wheelRef}
      className={`quiz-answer-card glass-panel relative flex w-full flex-col rounded-[1.5rem] p-5 sm:rounded-[1.75rem] sm:p-6 ${className}`}
      data-category={category}
    >
      <CategoryTheme category={category} />

      <p className="relative z-10 mb-3 text-center text-[0.68rem] tracking-[0.14em] text-[#c4a574]/70 uppercase">
        Adjust your answer
      </p>

      <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4">
        <AdjustButton
          label="Decrease value"
          onClick={() => nudge(-step)}
          disabled={value <= min}
        >
          −
        </AdjustButton>

        <div
          className={`quiz-value-display flex min-w-[9rem] flex-col items-center rounded-2xl border border-[#c4a574]/20 bg-[#0a0705]/30 px-5 py-3 sm:min-w-[10rem] sm:px-6 sm:py-4 ${
            !isStatic && isAdjusting ? "quiz-value-display--active" : ""
          }`}
        >
          <output
            htmlFor={inputId}
            className="font-display text-[2.75rem] leading-none tabular-nums text-[#f5ede0] sm:text-[3.25rem]"
            aria-live="polite"
          >
            {shownValue}
          </output>
          <span className="mt-1 text-[0.72rem] uppercase tracking-[0.2em] text-[#c4a574]">
            {unit}
          </span>
        </div>

        <AdjustButton
          label="Increase value"
          onClick={() => nudge(step)}
          disabled={value >= max}
        >
          +
        </AdjustButton>
      </div>

      <p className="relative z-10 mt-3 text-center text-[0.65rem] tracking-wide text-[#f5ede0]/35">
        Drag slider · scroll · or tap ±
      </p>

      <div className="relative z-10 mt-4 sm:mt-5">
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="range-premium range-premium--interactive w-full"
          style={{ "--pct": pct } as CSSProperties}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={`Adjust value between ${min} and ${max} ${unit}`}
        />

        <div className="mt-3 flex justify-between text-[0.68rem] tracking-wide text-[#f5ede0]/30">
          <span className="tabular-nums">{min}</span>
          <span className="tabular-nums">{max}</span>
        </div>
      </div>
    </div>
  );
}

function AdjustButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="quiz-adjust-btn focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c4a574]/25 bg-[#0a0705]/40 text-xl leading-none text-[#f5ede0]/80 transition-all duration-300 hover:border-[#c4a574]/50 hover:bg-[#c4a574]/10 hover:text-[#f5ede0] disabled:pointer-events-none disabled:opacity-25 sm:h-12 sm:w-12"
    >
      {children}
    </button>
  );
}
