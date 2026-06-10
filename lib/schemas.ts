import { z } from "zod";
import type { QuizAnswers } from "./types";
import { KNOWN_ACTION_IDS } from "./constants";

export type { QuizAnswers };

export const quizAnswersSchema = z.object({
  carKmPerWeek: z.number().min(0).max(2000),
  vehicleType: z.enum(["petrol", "hybrid", "ev"]),
  transitKmPerWeek: z.number().min(0).max(2000),
  flightsPerYear: z.number().min(0).max(50),
  beefMealsPerWeek: z.number().min(0).max(21),
  chickenMealsPerWeek: z.number().min(0).max(21),
  vegetarianMealsPerWeek: z.number().min(0).max(21),
  monthlyKwh: z.number().min(0).max(5000),
  clothingItemsPerMonth: z.number().min(0).max(30),
  recyclingHabit: z.number().min(1).max(5),
});

export const footprintProfileSchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  answers: quizAnswersSchema,
  annualKgCo2: z.number().min(0).max(100_000),
  monthlyKgCo2: z.number().min(0).max(10_000),
  breakdown: z
    .array(
      z.object({
        category: z.enum(["transport", "diet", "energy", "shopping", "waste"]),
        kgCo2PerYear: z.number().min(0).max(100_000),
        percentage: z.number().min(0).max(100),
      }),
    )
    .length(5),
});

export const dailyLogSchema = z.object({
  id: z.uuid(),
  date: z.iso.datetime(),
  actionId: z.enum(KNOWN_ACTION_IDS),
  label: z.string().trim().min(1).max(120),
  kgCo2Delta: z.number().min(-500).max(500),
});
