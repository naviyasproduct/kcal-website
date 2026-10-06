import Link from "next/link";
import type { CSSProperties } from "react";
import type { Plan } from "@/lib/catalog/data";
import type { NutritionResult } from "@/lib/nutrition/calculate";
import { formatLkr } from "@/lib/format";
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
    { label: "Protein", grams: result.proteinG, kcal: result.proteinG * 4, color: "bg-action" },
    { label: "Carbs", grams: result.carbsG, kcal: result.carbsG * 4, color: "bg-accent" },
    { label: "Fat", grams: result.fatG, kcal: result.fatG * 9, color: "bg-brand" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <section className="animate-rise flex flex-col items-center gap-2 rounded-3xl bg-brand px-6 py-8 text-brand-ink">
        <p className="text-sm text-brand-ink/70">Your daily target</p>
        <div className="relative grid size-40 place-items-center">
          <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
              className="stroke-brand-ink/15"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              className="stroke-accent"
              strokeDasharray={RING}
              strokeDashoffset={RING * 0.08}
              style={
                {
                  "--ring-length": RING,
                  animation: "ring 900ms cubic-bezier(0.2,0.8,0.2,1) both",
                } as CSSProperties
              }
            />
          </svg>
          <div className="text-center">
            <p className="font-display text-4xl font-bold tabular-nums">
              {result.calories.toLocaleString()}
            </p>
            <p className="text-sm text-brand-ink/70">kcal / day</p>
          </div>
        </div>
      </section>

      <section className="animate-rise grid grid-cols-3 gap-3 [animation-delay:80ms]">
        {macros.map((m) => (
          <div key={m.label} className="rounded-2xl bg-card p-3 ring-1 ring-line">
            <p className="text-xs text-ink-muted">{m.label}</p>
            <p className="font-display text-2xl font-bold tabular-nums">{m.grams}g</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className={`animate-grow h-full origin-left rounded-full ${m.color}`}
                style={{ width: `${Math.round((m.kcal / macroKcal) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      {plan && (
        <section className="animate-rise flex flex-col gap-4 rounded-3xl bg-card p-5 ring-1 ring-line [animation-delay:160ms]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-action uppercase">
                Best plan for you
              </p>
              <h2 className="font-display text-2xl font-bold">{plan.name}</h2>
              <p className="text-sm text-ink-muted">{plan.tagline} · 3 meals a day</p>
            </div>
            <p className="text-right">
              <span className="block font-display text-xl font-bold">{formatLkr(plan.price)}</span>
              <span className="text-xs text-ink-muted">per week</span>
            </p>
          </div>
          <Link href={`/checkout?plan=${plan.id}`} className={buttonStyles("primary", "lg")}>
            Subscribe to this plan
          </Link>
        </section>
      )}

      <div className="flex flex-col items-center gap-2 text-center">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-action underline-offset-4 hover:underline"
          >
            Change my answers
          </button>
        )}
        <p className="text-xs text-ink-muted">This is an estimate, not medical advice.</p>
      </div>
    </div>
  );
}
