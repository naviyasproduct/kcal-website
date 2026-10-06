import type { Meal } from "@/lib/catalog/data";
import { PlaceholderImage } from "./placeholder-image";

const toneByType = { breakfast: "sun", lunch: "leaf", dinner: "cream" } as const;

/**
 * Meal tile with photo slot and nutrition facts.
 * @param props - The meal to show.
 * @returns A meal card.
 */
export function MealCard({ meal }: { meal: Meal }) {
  const facts = [
    { label: "kcal", value: meal.calories },
    { label: "protein", value: `${meal.proteinG}g` },
    { label: "carbs", value: `${meal.carbsG}g` },
    { label: "salt", value: `${meal.saltG}g` },
  ];
  return (
    <article className="overflow-hidden rounded-3xl bg-card ring-1 ring-line transition-transform duration-200 ease-out hover:-translate-y-1">
      <PlaceholderImage ratio="wide" label={meal.name} tone={toneByType[meal.mealType]} />
      <div className="flex flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-action uppercase">
            {meal.mealType}
          </p>
          <h3 className="mt-1 font-display text-lg leading-tight font-semibold">{meal.name}</h3>
        </div>
        <dl className="grid grid-cols-4 gap-1 text-center">
          {facts.map((f) => (
            <div key={f.label} className="rounded-xl bg-surface py-2">
              <dd className="text-sm font-semibold">{f.value}</dd>
              <dt className="text-[11px] text-ink-muted">{f.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
