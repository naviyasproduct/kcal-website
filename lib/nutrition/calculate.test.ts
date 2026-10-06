import { describe, expect, it } from "vitest";
import { calculate, recommendPlan } from "./calculate";
import type { CalculatorInput } from "./schema";
import { plans } from "@/lib/catalog/data";

const weekly = plans.filter((p) => p.billingPeriod === "weekly");

const male: CalculatorInput = {
  goal: "maintain",
  sex: "male",
  age: 30,
  heightCm: 180,
  weightKg: 80,
  gymDaysPerWeek: 4,
};
const female: CalculatorInput = {
  goal: "maintain",
  sex: "female",
  age: 25,
  heightCm: 160,
  weightKg: 55,
  gymDaysPerWeek: 0,
};

describe("calculate", () => {
  // Male BMR 1780 × 1.55 = 2759. Female BMR 1264 × 1.2 = 1516.8.
  it.each([
    ["male", "bulk", male, 3059, 144],
    ["male", "cut", male, 2207, 160],
    ["male", "maintain", male, 2759, 128],
    ["male", "healthy", male, 2759, 96],
    ["female", "bulk", female, 1817, 99],
    ["female", "cut", female, 1213, 110],
    ["female", "maintain", female, 1517, 88],
    ["female", "healthy", female, 1517, 66],
  ] as const)("%s %s", (_sex, goal, base, calories, proteinG) => {
    const result = calculate({ ...base, goal }, weekly);
    expect(result.calories).toBe(calories);
    expect(result.proteinG).toBe(proteinG);
    expect(result.fatG).toBe(Math.round((calories * 0.25) / 9));
    expect(result.recommendedPlanId).toBe(`${goal}-weekly`);
  });

  it("splits remaining calories into carbs", () => {
    const r = calculate({ ...male, goal: "bulk" }, weekly);
    expect(r.carbsG).toBe(Math.round((3059 - 144 * 4 - 85 * 9) / 4));
  });

  it("applies the female floor of 1200 kcal", () => {
    const r = calculate({ ...female, goal: "cut", age: 60, heightCm: 150, weightKg: 40 }, weekly);
    expect(r.calories).toBe(1200);
  });

  it("applies the male floor of 1500 kcal", () => {
    const r = calculate(
      { ...male, goal: "cut", age: 70, heightCm: 150, weightKg: 45, gymDaysPerWeek: 0 },
      weekly,
    );
    expect(r.calories).toBe(1500);
  });

  it.each([
    { age: 15 },
    { age: 81 },
    { heightCm: 119 },
    { heightCm: 231 },
    { weightKg: 34 },
    { weightKg: 251 },
    { gymDaysPerWeek: 8 },
  ])("rejects out-of-range input %o", (override) => {
    expect(() => calculate({ ...male, ...override }, weekly)).toThrow();
  });

  it("accepts the exact limits", () => {
    expect(() =>
      calculate({ ...male, age: 16, heightCm: 120, weightKg: 35 }, weekly),
    ).not.toThrow();
    expect(() =>
      calculate({ ...male, age: 80, heightCm: 230, weightKg: 250 }, weekly),
    ).not.toThrow();
  });
});

describe("recommendPlan", () => {
  it("returns null when no plan has the goal", () => {
    expect(recommendPlan("bulk", 3000, [])).toBeNull();
  });

  it("picks the plan whose range is closest", () => {
    const candidates = [
      { id: "low", goal: "cut" as const, calorieMin: 1200, calorieMax: 1600 },
      { id: "high", goal: "cut" as const, calorieMin: 2000, calorieMax: 2600 },
    ];
    expect(recommendPlan("cut", 1500, candidates)).toBe("low");
    expect(recommendPlan("cut", 1900, candidates)).toBe("high");
  });
});
