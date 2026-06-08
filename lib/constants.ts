import type { ActionRecommendation, FootprintCategory } from "./types";

export const EMISSION_FACTORS = {
  carKgPerKm: 0.21,
  transitKgPerKm: 0.15,
  flightKgPerKm: 0.25,
  flightAvgKm: 1500,
  beefKgPerMeal: 5,
  chickenKgPerMeal: 2,
  vegetarianKgPerMeal: 0.5,
  gridKgPerKwh: 0.4,
  clothingKgPerItem: 10,
} as const;

export const EQUIVALENTS = {
  kgPerTreePerYear: 21,
  carKgPerKm: 0.21,
  shortFlightKg: 375,
} as const;

export const MONTHLY_REDUCTION_TARGET_PERCENT = 10;

export const CATEGORY_LABELS: Record<FootprintCategory, string> = {
  transport: "Transport",
  diet: "Diet",
  energy: "Home Energy",
  shopping: "Shopping",
  waste: "Waste",
};

export const QUIZ_QUESTIONS = [
  {
    id: "carKmPerWeek",
    category: "transport" as const,
    label: "How many km do you drive per week?",
    min: 0,
    max: 2000,
    step: 10,
    unit: "km",
  },
  {
    id: "transitKmPerWeek",
    category: "transport" as const,
    label: "How many km do you travel by bus or train per week?",
    min: 0,
    max: 2000,
    step: 10,
    unit: "km",
  },
  {
    id: "flightsPerYear",
    category: "transport" as const,
    label: "How many flights do you take per year?",
    min: 0,
    max: 50,
    step: 1,
    unit: "flights",
  },
  {
    id: "beefMealsPerWeek",
    category: "diet" as const,
    label: "Beef meals per week",
    min: 0,
    max: 21,
    step: 1,
    unit: "meals",
  },
  {
    id: "chickenMealsPerWeek",
    category: "diet" as const,
    label: "Chicken or fish meals per week",
    min: 0,
    max: 21,
    step: 1,
    unit: "meals",
  },
  {
    id: "vegetarianMealsPerWeek",
    category: "diet" as const,
    label: "Vegetarian or plant-based meals per week",
    min: 0,
    max: 21,
    step: 1,
    unit: "meals",
  },
  {
    id: "monthlyKwh",
    category: "energy" as const,
    label: "Monthly electricity usage (kWh)",
    min: 0,
    max: 5000,
    step: 50,
    unit: "kWh",
  },
  {
    id: "clothingItemsPerMonth",
    category: "shopping" as const,
    label: "New clothing items purchased per month",
    min: 0,
    max: 30,
    step: 1,
    unit: "items",
  },
  {
    id: "recyclingHabit",
    category: "waste" as const,
    label: "How consistently do you recycle? (1 = rarely, 5 = always)",
    min: 1,
    max: 5,
    step: 1,
    unit: "rating",
  },
] as const;

export const TRACKABLE_ACTIONS = [
  {
    id: "bike-instead",
    label: "Biked instead of drove",
    kgCo2Delta: -2.1,
    category: "transport" as FootprintCategory,
  },
  {
    id: "meatless-meal",
    label: "Ate a meatless meal",
    kgCo2Delta: -4.5,
    category: "diet" as FootprintCategory,
  },
  {
    id: "line-dry",
    label: "Line-dried laundry",
    kgCo2Delta: -0.8,
    category: "energy" as FootprintCategory,
  },
  {
    id: "transit-day",
    label: "Used public transit",
    kgCo2Delta: -1.5,
    category: "transport" as FootprintCategory,
  },
  {
    id: "secondhand",
    label: "Bought secondhand",
    kgCo2Delta: -8,
    category: "shopping" as FootprintCategory,
  },
  {
    id: "recycled",
    label: "Recycled properly",
    kgCo2Delta: -0.5,
    category: "waste" as FootprintCategory,
  },
] as const;

export const RECOMMENDED_ACTIONS: Omit<
  ActionRecommendation,
  "score"
>[] = [
  {
    id: "swap-commute",
    title: "Swap 2 car commutes for transit",
    description:
      "Replace two weekly car trips with bus or train to cut transport emissions.",
    category: "transport",
    kgCo2SavedPerMonth: 8.4,
    difficulty: "easy",
  },
  {
    id: "meatless-monday",
    title: "Add two meatless days per week",
    description:
      "Plant-based meals dramatically lower your diet footprint with minimal lifestyle change.",
    category: "diet",
    kgCo2SavedPerMonth: 36,
    difficulty: "easy",
  },
  {
    id: "led-bulbs",
    title: "Switch to LED bulbs",
    description:
      "Replace remaining incandescent bulbs to reduce home energy consumption.",
    category: "energy",
    kgCo2SavedPerMonth: 4.8,
    difficulty: "easy",
  },
  {
    id: "buy-secondhand",
    title: "Buy one item secondhand this month",
    description:
      "Extending product life avoids the emissions of manufacturing new goods.",
    category: "shopping",
    kgCo2SavedPerMonth: 10,
    difficulty: "medium",
  },
  {
    id: "shorter-showers",
    title: "Take 2-minute shorter showers",
    description: "Less hot water means less energy used for heating.",
    category: "energy",
    kgCo2SavedPerMonth: 3.2,
    difficulty: "easy",
  },
  {
    id: "flight-offset",
    title: "Skip one short-haul flight",
    description:
      "A single short flight can equal months of other lifestyle changes.",
    category: "transport",
    kgCo2SavedPerMonth: 375,
    difficulty: "hard",
  },
  {
    id: "recycle-more",
    title: "Improve recycling habits",
    description:
      "Sort waste properly and compost organics to reduce landfill emissions.",
    category: "waste",
    kgCo2SavedPerMonth: 2.4,
    difficulty: "easy",
  },
];

export const DEFAULT_QUIZ_ANSWERS = {
  carKmPerWeek: 100,
  transitKmPerWeek: 20,
  flightsPerYear: 2,
  beefMealsPerWeek: 2,
  chickenMealsPerWeek: 4,
  vegetarianMealsPerWeek: 7,
  monthlyKwh: 300,
  clothingItemsPerMonth: 2,
  recyclingHabit: 3,
} satisfies import("./types").QuizAnswers;
