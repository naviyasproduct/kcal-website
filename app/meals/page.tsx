import type { Metadata } from "next";
import { PageHero } from "@/components/brand";
import { MealCard } from "@/components/meal-card";
import { meals, type MealType } from "@/lib/catalog/data";

export const metadata: Metadata = { title: "Meals · kcal" };

const sections: { type: MealType; title: string }[] = [
  { type: "breakfast", title: "breakfast" },
  { type: "lunch", title: "lunch" },
  { type: "dinner", title: "dinner" },
];

/**
 * Meals catalogue grouped by meal type.
 * @returns The menu.
 */
export default function MealsPage() {
  return (
    <main>
      <PageHero title="this week's menu">
        <nav className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <a
              key={s.type}
              href={`#${s.type}`}
              className="rounded-full bg-cream px-5 py-2.5 font-display text-sm tracking-[-0.02em] text-brand transition-transform duration-300 ease-bounce hover:scale-105 hover:bg-accent"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6">
        {sections.map((s) => (
          <section key={s.type} id={s.type} className="flex scroll-mt-28 flex-col gap-6">
            <h2 className="reveal text-[clamp(2.5rem,6vw,4rem)]">{s.title}</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {meals
                .filter((m) => m.mealType === s.type)
                .map((m) => (
                  <div key={m.slug} className="reveal">
                    <MealCard meal={m} />
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
