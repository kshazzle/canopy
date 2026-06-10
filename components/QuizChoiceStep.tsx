"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";
import { CategoryTheme } from "@/components/CategoryTheme";
import type { FootprintCategory } from "@/lib/types";

interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  hint: string;
}

interface QuizChoiceStepProps<T extends string> {
  value: T;
  options: readonly ChoiceOption<T>[];
  category: FootprintCategory;
  onChange: (value: T) => void;
  className?: string;
}

export function QuizChoiceStep<T extends string>({
  value,
  options,
  category,
  onChange,
  className = "",
}: QuizChoiceStepProps<T>) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusOption = useCallback((index: number) => {
    const node = optionRefs.current[index];
    node?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        const next = (index + 1) % options.length;
        onChange(options[next].value);
        focusOption(next);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const prev = (index - 1 + options.length) % options.length;
        onChange(options[prev].value);
        focusOption(prev);
      }
    },
    [focusOption, onChange, options],
  );

  return (
    <div
      className={`quiz-answer-card glass-panel relative flex w-full flex-col rounded-[1.5rem] p-5 sm:rounded-[1.75rem] sm:p-6 ${className}`}
      data-category={category}
      role="radiogroup"
      aria-label="Select your answer"
    >
      <CategoryTheme category={category} />

      <p className="relative z-10 mb-4 text-center text-[0.68rem] tracking-[0.14em] text-[#c4a574]/70 uppercase">
        Choose one
      </p>

      <div className="relative z-10 flex flex-col gap-2.5 sm:gap-3">
        {options.map((option, index) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              tabIndex={selected ? 0 : -1}
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`quiz-choice-option focus-ring flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 sm:px-5 sm:py-4 ${
                selected
                  ? "border-[#c4a574]/55 bg-[#c4a574]/12 text-[#faf5ec]"
                  : "border-[#c4a574]/18 bg-[#0a0705]/30 text-[#f5ede0]/85 hover:border-[#c4a574]/35 hover:bg-[#c4a574]/6"
              }`}
            >
              <span className="font-display text-[1.15rem] tracking-[-0.01em] sm:text-[1.25rem]">
                {option.label}
              </span>
              <span
                className={`text-[0.68rem] tracking-wide sm:text-[0.72rem] ${
                  selected ? "text-[#c4a574]" : "text-[#f5ede0]/55"
                }`}
              >
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
