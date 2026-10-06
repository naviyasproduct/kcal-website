import { z } from "zod";
import { nutritionConfig } from "./config";

const { limits } = nutritionConfig;

export const goals = ["bulk", "cut", "maintain", "healthy"] as const;
export type Goal = (typeof goals)[number];

export const sexes = ["male", "female"] as const;
export type Sex = (typeof sexes)[number];

/** Calculator input. Shared by the form (client) and any server use. */
export const calculatorInputSchema = z.object({
  goal: z.enum(goals, { error: "Pick a goal" }),
  sex: z.enum(sexes, { error: "Pick one" }),
  age: z
    .number({ error: "Enter your age" })
    .int("Use whole years")
    .min(limits.age.min, `Must be ${limits.age.min} or older`)
    .max(limits.age.max, `Must be ${limits.age.max} or younger`),
  heightCm: z
    .number({ error: "Enter your height" })
    .min(limits.heightCm.min, `Between ${limits.heightCm.min} and ${limits.heightCm.max} cm`)
    .max(limits.heightCm.max, `Between ${limits.heightCm.min} and ${limits.heightCm.max} cm`),
  weightKg: z
    .number({ error: "Enter your weight" })
    .min(limits.weightKg.min, `Between ${limits.weightKg.min} and ${limits.weightKg.max} kg`)
    .max(limits.weightKg.max, `Between ${limits.weightKg.min} and ${limits.weightKg.max} kg`),
  gymDaysPerWeek: z.number({ error: "Pick a number" }).int().min(0).max(7),
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;
