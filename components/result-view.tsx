import Link from "next/link";
import type { CSSProperties } from "react";
import type { Plan } from "@/lib/catalog/data";
import type { NutritionResult } from "@/lib/nutrition/calculate";
import { formatLkr } from "@/lib/format";
import { Arrow, Badge, Heart } from "./brand";
import { buttonStyles } from "./button";

const RING = 2 * Math.PI * 52;

type ResultViewProps = {
  result: NutritionResult;
  plan: Plan | undefined;
  onEdit?: () => void;
};

/**
 * Result screen shared by the calculator and (later) the chatbot.
 * One main action: subscribe to the recommended plan.
 * @param props - Targets, recommended plan and an optional edit handler.
 * @returns The result screen.
 */
export function ResultView({ result, plan, onEdit }: ResultViewProps) {
  const macroKcal = result.proteinG * 4 + result.carbsG * 4 + result.fatG * 9;
  const macros = [
    {
      label: "protein",
      grams: result.proteinG,
      kcal: result.proteinG * 4,
      block: "bg-brand text-cream",
    },
    {
      label: "carbs",
      grams: result.carbsG,
      kcal: result.carbsG * 4,
      block: "bg-accent text-brand",
    },
    { label: "fat", grams: result.fatG, kcal: result.fatG * 9, block: "bg-cream-deep text-ink" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <section className="animate-rise flex flex-col items-center gap-3 rounded-[2rem] bg-brand px-6 py-10 text-cream">
        <h1 className="text-3xl">your daily target</h1>
        <div className="relative grid size-56 place-items-center">
          <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="12"
              className="stroke-cream/15"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              className="stroke-accent"
              strokeDasharray={RING}
              strokeDashoffset={RING * 0.08}
              style={
                {
                  "--ring-length": RING,
                  animation: "ring 1100ms var(--ease-bounce) both",
                } as CSSProperties
              }
            />
          </svg>
          <div className="text-center">
            <p className="font-display text-6xl leading-none tracking-[-0.04em] tabular-nums">
              {result.calories.toLocaleString()}
            </p>
            <p className="font-bold text-cream/80">kcal a day</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {macros.map((m, i) => (
          <div
            key={m.label}
            className={`animate-rise flex flex-col gap-1 rounded-[1.5rem] p-4 ${m.block}`}
            style={{ animationDelay: `${80 + i * 60}ms` }}
          >
            <p className="text-sm font-bold">{m.label}</p>
            <p className="font-display text-3xl leading-none tracking-[-0.03em] tabular-nums">
              {m.grams}g
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-current/15">
              <div
                className="h-full origin-left rounded-full bg-current [animation:grow_900ms_var(--ease-bounce)_both]"
                style={{ width: `${Math.round((m.kcal / macroKcal) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      {plan && (
        <section className="animate-rise flex flex-col gap-5 rounded-[2rem] bg-cream-deep p-6 [animation-delay:260ms]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col items-start gap-3">
              <Badge>best plan for you</Badge>
              <h2 className="text-5xl">{plan.name}</h2>
              <p className="flex items-center gap-2 text-ink-muted">
                <Heart className="size-4 text-brand" /> {plan.tagline}, 3 meals a day
              </p>
            </div>
            <p className="text-right">
              <span className="block font-display text-2xl tracking-[-0.03em]">
                {formatLkr(plan.price)}
              </span>
              <span className="text-sm text-ink-muted">a week</span>
            </p>
          </div>
          <Link href={`/checkout?plan=${plan.id}`} className={buttonStyles("primary", "lg")}>
            subscribe to this plan <Arrow />
          </Link>
        </section>
      )}

      <div className="flex flex-col items-center gap-2 pt-2 text-center">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="font-bold text-brand underline decoration-accent decoration-4 underline-offset-4"
          >
            change my answers
          </button>
        )}
        <p className="text-sm text-ink-muted">This is an estimate, not medical advice.</p>
      </div>
    </div>
  );
}
