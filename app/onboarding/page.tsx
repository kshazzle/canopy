"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/GlassButton";
import { PageShell } from "@/components/PageShell";
import { QuizStep } from "@/components/QuizStep";
import { DEFAULT_QUIZ_ANSWERS, QUIZ_QUESTIONS } from "@/lib/constants";
import type { QuizAnswers } from "@/lib/types";
import { saveProfileFromQuiz } from "@/lib/storage";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULT_QUIZ_ANSWERS);

  const current = QUIZ_QUESTIONS[step];
  const isLast = step === QUIZ_QUESTIONS.length - 1;

  function updateAnswer(value: number) {
    setAnswers((prev) => ({
      ...prev,
      [current.id]: value,
    }));
  }

  function handleNext() {
    if (isLast) {
      saveProfileFromQuiz(answers);
      router.push("/dashboard");
      return;
    }
    setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <PageShell
      title="Carbon Footprint Assessment"
      subtitle="Answer a few quick questions to build your personalized profile. Takes about 3 minutes."
    >
      <div className="mx-auto max-w-2xl">
        <p className="mb-6 text-sm text-white/50" aria-live="polite">
          Step {step + 1} of {QUIZ_QUESTIONS.length}
        </p>

        <QuizStep
          label={current.label}
          value={answers[current.id]}
          min={current.min}
          max={current.max}
          step={current.step}
          unit={current.unit}
          onChange={updateAnswer}
        />

        <div className="mt-8 flex justify-between gap-4">
          <GlassButton
            onClick={handleBack}
            className="px-8 py-3 text-sm"
            ariaLabel="Go to previous question"
          >
            Back
          </GlassButton>
          <GlassButton
            onClick={handleNext}
            className="px-8 py-3 text-sm"
            ariaLabel={isLast ? "Complete assessment" : "Go to next question"}
          >
            {isLast ? "See My Footprint" : "Next"}
          </GlassButton>
        </div>
      </div>
    </PageShell>
  );
}
