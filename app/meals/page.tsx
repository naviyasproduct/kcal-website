import type { Metadata } from "next";
import { MealCard } from "@/components/meal-card";
import { meals, type MealType } from "@/lib/catalog/data";

export const metadata: Metadata = { title: "Meals · kcal" };

const sections: { type: MealType; title: string }[] = [
  { type: "breakfast", title: "Breakfast" },
  { type: "lunch", title: "Lunch" },
  { type: "dinner", title: "Dinner" },
];

/**
 * Meals catalogue grouped by meal type.
 * @returns The menu.
 */
export default function MealsPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <h1 className="font-display text-4xl font-bold tracking-tight">This week&apos;s meals</h1>
      <nav className="sticky top-16 z-20 -mx-4 flex gap-2 bg-surface/85 px-4 py-3 backdrop-blur-md">
        {sections.map((s) => (
          <a
            key={s.type}
            href={`#${s.type}`}
            className="rounded-full bg-card px-4 py-2 text-sm font-semibold ring-1 ring-line transition-colors hover:bg-leaf-soft"
          >
            {s.title}
          </a>
        ))}
      </nav>
      {sections.map((s) => (
        <section key={s.type} id={s.type} className="flex scroll-mt-32 flex-col gap-4">
          <h2 className="font-display text-2xl font-bold">{s.title}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {meals
              .filter((m) => m.mealType === s.type)
              .map((m) => (
                <MealCard key={m.slug} meal={m} />
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
