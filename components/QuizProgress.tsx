import { CATEGORY_LABELS } from "@/lib/constants";
import type { FootprintCategory } from "@/lib/types";

interface QuizProgressProps {
  step: number;
  total: number;
  category: FootprintCategory;
  static?: boolean;
}

const CATEGORY_ACCENT: Record<FootprintCategory, string> = {
  transport: "text-[#c4a574]",
  diet: "text-[#8faa7e]",
  energy: "text-[#e8a87c]",
  shopping: "text-[#c4a574]",
  waste: "text-[#9aaa82]",
};

export function QuizProgress({
  step,
  total,
  category,
  static: isStatic = false,
}: QuizProgressProps) {
  const progress = ((step + 1) / total) * 100;

  return (
    <div className="quiz-progress w-full shrink-0" aria-label="Assessment progress">
      <div className="mb-2.5 flex items-baseline justify-between gap-4">
        <span
          className={`text-[0.78rem] font-medium tracking-[0.1em] uppercase sm:text-[0.82rem] ${CATEGORY_ACCENT[category]}`}
        >
          {CATEGORY_LABELS[category]}
        </span>
        <span
          className="shrink-0 text-[0.78rem] font-medium tracking-[0.08em] text-[#f5ede0]/82 uppercase sm:text-[0.82rem]"
          aria-live="polite"
        >
          Step {step + 1} of {total}
        </span>
      </div>
      <div
        className="h-[3px] w-full overflow-hidden rounded-full bg-[#f5ede0]/18"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label={`${Math.round(progress)} percent complete`}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r from-[#c4a574]/85 to-[#e8a87c] ${
            isStatic ? "" : "transition-all duration-700"
          }`}
          style={{
            width: `${progress}%`,
            ...(isStatic
              ? {}
              : { transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }),
          }}
        />
      </div>
    </div>
  );
}
