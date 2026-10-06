import type { Goal } from "@/lib/nutrition/schema";

/*
 * Sample catalogue used until the database (build step 2) is in place.
 * Shapes follow the data model in MASTER_PROMPT.md. Money is integer cents in LKR.
 */

export type MealType = "breakfast" | "lunch" | "dinner";
export type BillingPeriod = "weekly" | "monthly";

export type Meal = {
  slug: string;
  name: string;
  mealType: MealType;
  calories: number;
  proteinG: number;
  carbsG: number;
  saltG: number;
};

export type Plan = {
  id: string;
  name: string;
  goal: Goal;
  tagline: string;
  billingPeriod: BillingPeriod;
  price: number;
  calorieMin: number;
  calorieMax: number;
};

export type DeliveryLocation = { id: string; name: string; type: "campus" | "address" };

export const meals: Meal[] = [
  {
    slug: "kurakkan-roti-egg",
    name: "Kurakkan roti & egg curry",
    mealType: "breakfast",
    calories: 480,
    proteinG: 26,
    carbsG: 52,
    saltG: 1.1,
  },
  {
    slug: "oats-banana-pb",
    name: "Oats, banana & peanut butter",
    mealType: "breakfast",
    calories: 520,
    proteinG: 22,
    carbsG: 68,
    saltG: 0.3,
  },
  {
    slug: "string-hoppers-dhal",
    name: "Red string hoppers & dhal",
    mealType: "breakfast",
    calories: 430,
    proteinG: 18,
    carbsG: 70,
    saltG: 0.9,
  },
  {
    slug: "chicken-red-rice",
    name: "Chicken, red rice & gotukola",
    mealType: "lunch",
    calories: 640,
    proteinG: 48,
    carbsG: 72,
    saltG: 1.4,
  },
  {
    slug: "fish-ambul-thiyal",
    name: "Fish ambul thiyal & brown rice",
    mealType: "lunch",
    calories: 590,
    proteinG: 44,
    carbsG: 64,
    saltG: 1.6,
  },
  {
    slug: "chickpea-veg-bowl",
    name: "Chickpea & veg rice bowl",
    mealType: "lunch",
    calories: 560,
    proteinG: 24,
    carbsG: 82,
    saltG: 1.0,
  },
  {
    slug: "light-chicken-kottu",
    name: "Light chicken kottu",
    mealType: "dinner",
    calories: 610,
    proteinG: 42,
    carbsG: 66,
    saltG: 1.7,
  },
  {
    slug: "tuna-veg-rice",
    name: "Tuna & veg red rice",
    mealType: "dinner",
    calories: 540,
    proteinG: 40,
    carbsG: 58,
    saltG: 1.2,
  },
  {
    slug: "soy-curry-hoppers",
    name: "Soy curry & string hoppers",
    mealType: "dinner",
    calories: 500,
    proteinG: 32,
    carbsG: 60,
    saltG: 1.3,
  },
];

const planBases: Omit<Plan, "id" | "billingPeriod" | "price">[] = [
  { name: "Build", goal: "bulk", tagline: "Gain muscle", calorieMin: 2400, calorieMax: 3600 },
  { name: "Lean", goal: "cut", tagline: "Lose fat", calorieMin: 1200, calorieMax: 2200 },
  {
    name: "Balance",
    goal: "maintain",
    tagline: "Stay in shape",
    calorieMin: 1800,
    calorieMax: 3000,
  },
  {
    name: "Everyday",
    goal: "healthy",
    tagline: "Just eat well",
    calorieMin: 1200,
    calorieMax: 2800,
  },
];

const weeklyPrice: Record<Goal, number> = {
  bulk: 1_350_000,
  cut: 1_150_000,
  maintain: 1_200_000,
  healthy: 1_050_000,
};

/** Monthly is 4 weeks at 10% off. */
export const plans: Plan[] = planBases.flatMap((base) => [
  {
    ...base,
    id: `${base.goal}-weekly`,
    billingPeriod: "weekly" as const,
    price: weeklyPrice[base.goal],
  },
  {
    ...base,
    id: `${base.goal}-monthly`,
    billingPeriod: "monthly" as const,
    price: Math.round((weeklyPrice[base.goal] * 4 * 0.9) / 100) * 100,
  },
]);

export const deliveryLocations: DeliveryLocation[] = [
  { id: "sliit", name: "SLIIT campus", type: "campus" },
  { id: "address", name: "My address", type: "address" },
];

/**
 * Finds a plan by ID.
 * @param id - Plan ID, e.g. `bulk-weekly`.
 * @returns The plan, or undefined.
 */
export function getPlan(id: string): Plan | undefined {
  return plans.find((p) => p.id === id);
}
