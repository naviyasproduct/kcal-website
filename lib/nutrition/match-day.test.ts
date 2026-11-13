import { describe, expect, it } from "vitest";
import { meals, plans } from "@/lib/catalog/data";
import { calculate } from "./calculate";
import { nutritionConfig } from "./config";
import { matchDay, type MealForMatch } from "./match-day";
import { goals, type CalculatorInput } from "./schema";

const weekly = plans.filter((p) => p.billingPeriod === "weekly");

const bodies: CalculatorInput[] = [
  { goal: "maintain", sex: "male", age: 30, heightCm: 180, weightKg: 80, gymDaysPerWeek: 4 },
  { goal: "maintain", sex: "female", age: 25, heightCm: 160, weightKg: 55, gymDaysPerWeek: 0 },
  { goal: "maintain", sex: "male", age: 22, heightCm: 172, weightKg: 68, gymDaysPerWeek: 6 },
  { goal: "maintain", sex: "female", age: 45, heightCm: 165, weightKg: 85, gymDaysPerWeek: 2 },
];
const profiles = bodies.flatMap((b) => goals.map((goal) => ({ ...b, goal })));

describe("matchDay with the real menu", () => {
  it.each(profiles)("fits $sex $goal $weightKg kg", (input) => {
    const target = calculate(input, weekly);
    const day = matchDay(target, meals);
    expect(day).not.toBeNull();
    const { totals } = day!;
    expect(Math.abs(totals.calories - target.calories) / target.calories).toBeLessThan(0.05);
    // 85%, not 100%: for a heavy person cutting, even the most protein-dense day on the
    // current menu tops out around 88% of a 2 g/kg target at the right calories.
    expect(totals.proteinG).toBeGreaterThanOrEqual(target.proteinG * 0.85);
  });

  it("picks one breakfast, lunch and dinner, in that order", () => {
    const day = matchDay(calculate(profiles[0], weekly), meals)!;
    expect(day.items.map((i) => i.meal.mealType)).toEqual(["breakfast", "lunch", "dinner"]);
  });

  it("only uses portion sizes from the config", () => {
    for (const input of profiles) {
      const day = matchDay(calculate(input, weekly), meals)!;
      for (const item of day.items) {
        expect(nutritionConfig.matching.portions).toContain(item.portion);
      }
    }
  });

  it("totals are the sum of the shown meal figures", () => {
    const day = matchDay(calculate(profiles[5], weekly), meals)!;
    for (const key of ["calories", "proteinG", "carbsG", "fatG"] as const) {
      expect(day.totals[key]).toBe(day.items.reduce((sum, i) => sum + i[key], 0));
    }
  });
});

describe("matchDay edge cases", () => {
  // A 500 kcal meal (30 g protein, 50 g carbs, 20 g fat); the target is three of them at 1.5×.
  const meal = (mealType: MealForMatch["mealType"]): MealForMatch => ({
    mealType,
    calories: 500,
    proteinG: 30,
    carbsG: 50,
    fatG: 20,
  });
  const target = { calories: 2250, proteinG: 135, carbsG: 225, fatG: 90 };

  it("returns null for an empty menu", () => {
    expect(matchDay(target, [])).toBeNull();
  });

  it("skips meal types the menu does not have", () => {
    const day = matchDay(target, [meal("dinner"), meal("breakfast")])!;
    expect(day.items.map((i) => i.meal.mealType)).toEqual(["breakfast", "dinner"]);
  });

  it("scales portions evenly to hit the target exactly", () => {
    const day = matchDay(target, [meal("breakfast"), meal("lunch"), meal("dinner")])!;
    expect(day.totals).toEqual(target);
    expect(day.items.map((i) => i.portion)).toEqual([1.5, 1.5, 1.5]);
  });
});
