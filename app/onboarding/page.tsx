"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/GlassButton";
import { PageShell } from "@/components/PageShell";
import { QuizProgress } from "@/components/QuizProgress";
import { QuizChoiceStep } from "@/components/QuizChoiceStep";
import { QuizStep } from "@/components/QuizStep";
import {
  DEFAULT_QUIZ_ANSWERS,
  isChoiceQuestion,
  QUIZ_QUESTIONS,
} from "@/lib/constants";
import type { QuizAnswers } from "@/lib/types";
import { saveProfileFromQuiz, StorageQuotaError } from "@/lib/storage";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULT_QUIZ_ANSWERS);
  const [error, setError] = useState("");

  const current = QUIZ_QUESTIONS[step];
  const isLast = step === QUIZ_QUESTIONS.length - 1;

  function updateAnswer<K extends keyof QuizAnswers>(id: K, value: QuizAnswers[K]) {
    setError("");
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function handleNext() {
    if (isLast) {
      try {
        saveProfileFromQuiz(answers);
        router.push("/dashboard?noticed=1");
      } catch (caught) {
        setError(
          caught instanceof StorageQuotaError
            ? "Storage is full. Clear site data for this page and try again."
            : "Could not save your profile. Please try again.",
        );
      }
      return;
    }
    setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <PageShell
      fitViewport
      compactTitle
      staticBackground
      title="Discover Your Rhythm"
      subtitle="Carbon Footprint Assessment"
      centered
    >
      <div className="flex w-full max-w-xl min-h-0 flex-1 flex-col justify-center gap-4 sm:gap-5">
        <QuizProgress
          static
          step={step}
          total={QUIZ_QUESTIONS.length}
          category={current.category}
        />

        <h2
          key={step}
          className="font-display shrink-0 text-center text-[clamp(1.55rem,4.8vw,2.35rem)] leading-[1.15] tracking-[-0.02em] text-[#faf5ec] [text-shadow:0_1px_14px_rgba(10,7,5,0.5)] sm:leading-snug [@media(max-height:740px)]:text-[1.4rem]"
        >
          {current.label}
        </h2>

        {error && (
          <p className="text-center text-sm text-red-300/90" role="alert">
            {error}
          </p>
        )}

        {isChoiceQuestion(current) ? (
          <QuizChoiceStep
            key={`answer-${step}`}
            className="shrink-0"
            category={current.category}
            value={answers.vehicleType}
            options={current.options}
            onChange={(value) => updateAnswer("vehicleType", value)}
          />
        ) : (
          <QuizStep
            key={`answer-${step}`}
            static
            className="shrink-0"
            category={current.category}
            value={answers[current.id]}
            min={current.min}
            max={current.max}
            step={current.step}
            unit={current.unit}
            onChange={(value) => updateAnswer(current.id, value)}
          />
        )}

        <div className="flex shrink-0 items-center justify-between gap-4 pt-1">
          <GlassButton
            onClick={handleBack}
            variant="ghost"
            className="px-6 py-2.5 text-sm sm:px-8 sm:py-3"
            ariaLabel="Go to previous question"
            disabled={step === 0}
          >
            Back
          </GlassButton>
          <GlassButton
            onClick={handleNext}
            variant="premium"
            motionless
            className="px-8 py-3 text-sm font-medium tracking-wide sm:px-10 sm:py-3.5"
            ariaLabel={isLast ? "Complete assessment" : "Go to next question"}
          >
            {isLast ? "See What We Noticed" : "Continue"}
          </GlassButton>
        </div>
      </div>
    </PageShell>
  );
}
