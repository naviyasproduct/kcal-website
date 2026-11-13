import type { Metadata } from "next";
import { CalculatorForm } from "@/components/calculator-form";
import { goals, type Goal } from "@/lib/nutrition/schema";

export const metadata: Metadata = { title: "Find my plan · kcal" };

/**
 * Calculator page. `?goal=` (from the home page) skips the first question.
 * @param props - Page props with search params.
 * @returns The calculator screen.
 */
export default async function CalculatorPage({ searchParams }: PageProps<"/calculator">) {
  const { goal } = await searchParams;
  const initialGoal = goals.find((g) => g === goal) as Goal | undefined;
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <CalculatorForm initialGoal={initialGoal} />
    </main>
  );
}
