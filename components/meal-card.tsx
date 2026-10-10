import type { Meal } from "@/lib/catalog/data";
import { Badge, Heart } from "./brand";
import { PlaceholderImage } from "./placeholder-image";

const toneByType = { breakfast: "accent", lunch: "soft", dinner: "brand" } as const;

/**
 * Meal block with a slant-cut photo and nutrition facts.
 * @param props - The meal to show.
 * @returns A meal card.
 */
export function MealCard({ meal }: { meal: Meal }) {
  const facts = [
    { label: "protein", value: `${meal.proteinG}g` },
    { label: "carbs", value: `${meal.carbsG}g` },
    { label: "salt", value: `${meal.saltG}g` },
  ];
  return (
    <article className="group relative overflow-hidden rounded-[2rem] bg-cream-deep transition-transform duration-300 ease-bounce hover:scale-[1.03]">
      <PlaceholderImage
        ratio="wide"
        label={meal.name}
        tone={toneByType[meal.mealType]}
        className="mask-slant-b"
      />
      <span className="absolute top-4 right-4 grid size-10 scale-0 place-items-center rounded-full bg-cream text-brand transition-transform duration-300 ease-bounce group-hover:scale-100">
        <Heart className="size-5" />
      </span>
      <div className="flex flex-col gap-4 p-5 pt-1">
        <div className="flex flex-col items-start gap-3">
          <Badge tone="brand">{meal.mealType}</Badge>
          <h3 className="text-xl">{meal.name}</h3>
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="font-display text-4xl leading-none tracking-[-0.03em]">
            {meal.calories}
            <span className="ml-1 font-sans text-sm font-bold tracking-normal">kcal</span>
          </p>
          <dl className="flex gap-3 text-right">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse">
                <dt className="text-xs text-ink-muted">{f.label}</dt>
                <dd className="font-display text-base leading-tight">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}
