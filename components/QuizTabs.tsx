"use client";

import { CATEGORY_LABELS } from "@/lib/constants";
import type { FootprintCategory } from "@/lib/types";

const SECTION_ORDER: FootprintCategory[] = [
  "transport",
  "diet",
  "energy",
  "shopping",
  "waste",
];

interface QuizTabsProps {
  currentCategory: FootprintCategory;
  completedCategories: Set<FootprintCategory>;
  className?: string;
  compact?: boolean;
}

export function QuizTabs({
  currentCategory,
  completedCategories,
  className = "",
  compact = false,
}: QuizTabsProps) {
  return (
    <div
      className={`flex shrink-0 flex-wrap justify-center gap-1.5 sm:gap-2 ${
        compact ? "quiz-tabs-compact" : ""
      } ${className}`}
      role="group"
      aria-label="Assessment sections"
    >
      {SECTION_ORDER.map((category) => {
        const isActive = category === currentCategory;
        const isDone = completedCategories.has(category);

        return (
          <span
            key={category}
            aria-current={isActive ? "step" : undefined}
            data-active={isActive}
            data-done={isDone}
            className="tab-pill"
          >
            {CATEGORY_LABELS[category]}
          </span>
        );
      })}
    </div>
  );
}
