import { describe, expect, it } from "vitest";
import { isChoiceQuestion, QUIZ_QUESTIONS } from "@/lib/constants";
import { quizAnswersSchema } from "@/lib/schemas";
import type { QuizAnswers } from "@/lib/types";

describe("quizAnswersSchema", () => {
  it("accepts default quiz answers", () => {
    const result = quizAnswersSchema.safeParse({
      carKmPerWeek: 100,
      vehicleType: "petrol",
      transitKmPerWeek: 20,
      flightsPerYear: 2,
      beefMealsPerWeek: 2,
      chickenMealsPerWeek: 4,
      vegetarianMealsPerWeek: 7,
      monthlyKwh: 300,
      clothingItemsPerMonth: 2,
      recyclingHabit: 3,
    });
    expect(result.success).toBe(true);
  });

  it("matches numeric quiz question bounds", () => {
    for (const question of QUIZ_QUESTIONS) {
      if (isChoiceQuestion(question)) continue;

      const shape = quizAnswersSchema.shape[question.id as keyof QuizAnswers];
      expect(shape).toBeDefined();

      const minCheck = shape.safeParse(question.min);
      const maxCheck = shape.safeParse(question.max);
      const belowMin = shape.safeParse(question.min - question.step);
      const aboveMax = shape.safeParse(question.max + question.step);

      expect(minCheck.success).toBe(true);
      expect(maxCheck.success).toBe(true);
      expect(belowMin.success).toBe(false);
      expect(aboveMax.success).toBe(false);
    }
  });
});
