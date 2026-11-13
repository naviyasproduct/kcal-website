import type { Goal } from "@/lib/nutrition/schema";

/*
 * Sample catalogue used until the database (build step 2) is in place.
 * Shapes follow the data model in MASTER_PROMPT.md. Money is integer cents in LKR.
 */

export type MealType = "breakfast" | "lunch" | "dinner";
export type BillingPeriod = "weekly" | "monthly";

/**
 * One meal at its regular (1×) portion. `fatG` is not shown on the menu, but the
 * calculator needs it to size a day of meals to the customer's fat target.
 */
export type Meal = {
  slug: string;
  name: string;
  mealType: MealType;
  imageUrl: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
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

/*
 * Menu built from the photos in media/meals-images (cropped WebPs in public/images/meals).
 * Nutrition figures are estimates for a regular portion until the real recipes are costed;
 * each one is consistent with 4/4/9 kcal per gram of protein/carbs/fat.
 */
export const meals: Meal[] = [
  {
    slug: "egg-scramble-bowl",
    name: "Veggie egg scramble & brown rice",
    mealType: "breakfast",
    imageUrl: "/images/meals/egg-scramble-bowl.webp",
    calories: 445,
    proteinG: 24,
    carbsG: 44,
    fatG: 19,
    saltG: 1.0,
  },
  {
    slug: "chicken-salad-box",
    name: "Grilled chicken salad box",
    mealType: "breakfast",
    imageUrl: "/images/meals/chicken-salad-box.webp",
    calories: 430,
    proteinG: 46,
    carbsG: 30,
    fatG: 14,
    saltG: 1.1,
  },
  {
    slug: "tuna-salad-bowl",
    name: "Tuna salad bowl",
    mealType: "breakfast",
    imageUrl: "/images/meals/tuna-salad-bowl.webp",
    calories: 480,
    proteinG: 39,
    carbsG: 50,
    fatG: 14,
    saltG: 1.3,
  },
  {
    slug: "chicken-rice-bowl",
    name: "Chicken rice bowl",
    mealType: "lunch",
    imageUrl: "/images/meals/chicken-rice-bowl.webp",
    calories: 610,
    proteinG: 55,
    carbsG: 55,
    fatG: 19,
    saltG: 1.4,
  },
  {
    slug: "spiced-chicken-mince",
    name: "Spiced chicken mince & rice",
    mealType: "lunch",
    imageUrl: "/images/meals/spiced-chicken-mince.webp",
    calories: 610,
    proteinG: 49,
    carbsG: 68,
    fatG: 16,
    saltG: 1.5,
  },
  {
    slug: "pepper-salmon-rice",
    name: "Pepper salmon & rice",
    mealType: "lunch",
    imageUrl: "/images/meals/pepper-salmon-rice.webp",
    calories: 640,
    proteinG: 42,
    carbsG: 70,
    fatG: 21,
    saltG: 1.2,
  },
  {
    slug: "grilled-chicken-veg-rice",
    name: "Grilled chicken & veg rice",
    mealType: "dinner",
    imageUrl: "/images/meals/grilled-chicken-veg-rice.webp",
    calories: 570,
    proteinG: 48,
    carbsG: 60,
    fatG: 15,
    saltG: 1.3,
  },
  {
    slug: "chickpea-curry-rice",
    name: "Chickpea curry & rice",
    mealType: "dinner",
    imageUrl: "/images/meals/chickpea-curry-rice.webp",
    calories: 620,
    proteinG: 23,
    carbsG: 100,
    fatG: 14,
    saltG: 1.2,
  },
  {
    slug: "veggie-power-meal",
    name: "Veggie power meal",
    mealType: "dinner",
    imageUrl: "/images/meals/veggie-power-meal.webp",
    calories: 560,
    proteinG: 22,
    carbsG: 88,
    fatG: 13,
    saltG: 1.0,
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

/** Where a plan can be delivered. Checkout only shows a picker when there is more than one. */
export const deliveryLocations: DeliveryLocation[] = [
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
