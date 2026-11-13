import { nutritionConfig } from "./config";

const { matching } = nutritionConfig;

const mealOrder = ["breakfast", "lunch", "dinner"] as const;

/** The meal fields matching needs. Values are for a regular (1×) portion. */
export type MealForMatch = {
  mealType: (typeof mealOrder)[number];
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type Macros = { calories: number; proteinG: number; carbsG: number; fatG: number };

export type DayItem<M extends MealForMatch> = Macros & { meal: M; portion: number };

export type DayPlan<M extends MealForMatch> = { items: DayItem<M>[]; totals: Macros };

/** Every way to pick one element from each group, in group order. */
function combinations<T>(groups: T[][]): T[][] {
  return groups.reduce<T[][]>(
    (acc, group) => acc.flatMap((picked) => group.map((item) => [...picked, item])),
    [[]],
  );
}

/**
 * How far a day is from the targets: weighted squared relative misses, plus a
 * small penalty for uneven portions. Lower is better.
 */
function score(day: Macros, target: Macros, portions: number[]): number {
  const miss = (value: number, goal: number) => (value - goal) / goal;
  const w = matching.weights;
  const proteinShort = Math.min(0, miss(day.proteinG, target.proteinG));
  const spread = Math.max(...portions) - Math.min(...portions);
  return (
    w.calories * miss(day.calories, target.calories) ** 2 +
    w.proteinShortfall * proteinShort ** 2 +
    w.fat * miss(day.fatG, target.fatG) ** 2 +
    w.carbs * miss(day.carbsG, target.carbsG) ** 2 +
    matching.portionSpread * spread ** 2
  );
}

/**
 * Builds a sample day from the menu: one breakfast, lunch and dinner, each with a
 * portion size, chosen so the day comes as close as possible to the targets.
 * Meal types with nothing on the menu are skipped.
 * @param target - Daily calories and macros, e.g. from `calculate()`.
 * @param meals - Menu meals at a regular portion.
 * @returns The day with per-meal and total figures, or null if the menu is empty.
 */
export function matchDay<M extends MealForMatch>(target: Macros, meals: M[]): DayPlan<M> | null {
  const groups = mealOrder
    .map((type) => meals.filter((m) => m.mealType === type))
    .filter((g) => g.length > 0);
  if (groups.length === 0) return null;

  const portionSets = combinations(groups.map(() => [...matching.portions]));
  let best = { score: Infinity, picked: [] as M[], portions: [] as number[] };

  for (const picked of combinations(groups)) {
    for (const portions of portionSets) {
      const day = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
      picked.forEach((m, i) => {
        day.calories += m.calories * portions[i];
        day.proteinG += m.proteinG * portions[i];
        day.carbsG += m.carbsG * portions[i];
        day.fatG += m.fatG * portions[i];
      });
      const s = score(day, target, portions);
      if (s < best.score) best = { score: s, picked, portions };
    }
  }

  // Round each meal first, so the totals are exactly the sum of what is shown.
  const items = best.picked.map((meal, i) => {
    const p = best.portions[i];
    return {
      meal,
      portion: p,
      calories: Math.round(meal.calories * p),
      proteinG: Math.round(meal.proteinG * p),
      carbsG: Math.round(meal.carbsG * p),
      fatG: Math.round(meal.fatG * p),
    };
  });
  const totals = items.reduce(
    (t, it) => ({
      calories: t.calories + it.calories,
      proteinG: t.proteinG + it.proteinG,
      carbsG: t.carbsG + it.carbsG,
      fatG: t.fatG + it.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
  return { items, totals };
}
