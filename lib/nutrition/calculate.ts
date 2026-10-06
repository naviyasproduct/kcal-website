import { nutritionConfig as cfg } from "./config";
import { calculatorInputSchema, type CalculatorInput, type Goal } from "./schema";

export type NutritionResult = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  recommendedPlanId: string | null;
};

/** The plan fields the recommendation needs. */
export type PlanForMatch = { id: string; goal: Goal; calorieMin: number; calorieMax: number };

/**
 * Picks the plan for a goal whose calorie range contains the target, or the
 * closest one for that goal if none contains it.
 * @param goal - Customer goal.
 * @param calories - Daily calorie target.
 * @param plans - Candidate plans (one billing period).
 * @returns The plan ID, or null when no plan matches the goal.
 */
export function recommendPlan(goal: Goal, calories: number, plans: PlanForMatch[]): string | null {
  const distance = (p: PlanForMatch) =>
    calories < p.calorieMin ? p.calorieMin - calories : Math.max(0, calories - p.calorieMax);
  const best = plans.filter((p) => p.goal === goal).sort((a, b) => distance(a) - distance(b))[0];
  return best?.id ?? null;
}

/**
 * Daily calories and macros from body data and goal (Mifflin-St Jeor).
 * Throws if the input is outside the allowed limits.
 * @param input - Body data and goal.
 * @param plans - Plans to recommend from.
 * @returns Targets in kcal and grams, plus the recommended plan.
 */
export function calculate(input: CalculatorInput, plans: PlanForMatch[]): NutritionResult {
  const { goal, sex, age, heightCm, weightKg, gymDaysPerWeek } = calculatorInputSchema.parse(input);

  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  const tdee = bmr * cfg.activityByGymDays[gymDaysPerWeek];
  const g = cfg.goal[goal];
  const calories = Math.round(
    Math.max(tdee * g.calorieFactor + g.calorieDelta, cfg.calorieFloor[sex]),
  );

  const proteinG = Math.round(weightKg * g.proteinPerKg);
  const fatG = Math.round((calories * cfg.fatShare) / cfg.kcalPerGram.fat);
  const carbKcal = calories - proteinG * cfg.kcalPerGram.protein - fatG * cfg.kcalPerGram.fat;
  const carbsG = Math.max(0, Math.round(carbKcal / cfg.kcalPerGram.carbs));

  return {
    calories,
    proteinG,
    carbsG,
    fatG,
    recommendedPlanId: recommendPlan(goal, calories, plans),
  };
}
