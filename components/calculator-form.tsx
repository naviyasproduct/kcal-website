"use client";

import { useState, type FormEvent } from "react";
import { plans } from "@/lib/catalog/data";
import { calculate, type NutritionResult } from "@/lib/nutrition/calculate";
import { calculatorInputSchema, type Goal, type Sex } from "@/lib/nutrition/schema";
import { buttonStyles } from "./button";
import { ResultView } from "./result-view";

const goalOptions: { value: Goal; title: string; hint: string }[] = [
  { value: "bulk", title: "Build muscle", hint: "More food, more protein" },
  { value: "cut", title: "Lose fat", hint: "Fewer calories, full plate" },
  { value: "maintain", title: "Stay in shape", hint: "Keep what you have" },
  { value: "healthy", title: "Just eat healthy", hint: "No gym, just good food" },
];

const bodySchema = calculatorInputSchema.pick({ age: true, heightCm: true, weightKg: true });
type BodyField = keyof typeof bodySchema.shape;

const bodyFields: { name: BodyField; label: string; unit: string }[] = [
  { name: "age", label: "Age", unit: "years" },
  { name: "heightCm", label: "Height", unit: "cm" },
  { name: "weightKg", label: "Weight", unit: "kg" },
];

const weeklyPlans = plans.filter((p) => p.billingPeriod === "weekly");
const STEPS = 4;

/**
 * Step-by-step calculator: goal → sex → body → gym days → result.
 * One question per screen; taps advance automatically.
 * @param props - Optional goal picked on the home page.
 * @returns The calculator flow.
 */
export function CalculatorForm({ initialGoal }: { initialGoal?: Goal }) {
  const [step, setStep] = useState(initialGoal ? 1 : 0);
  const [goal, setGoal] = useState<Goal | undefined>(initialGoal);
  const [sex, setSex] = useState<Sex>();
  const [body, setBody] = useState<Record<BodyField, string>>({
    age: "",
    heightCm: "",
    weightKg: "",
  });
  const [errors, setErrors] = useState<Partial<Record<BodyField, string>>>({});
  const [result, setResult] = useState<NutritionResult>();

  function go(next: number) {
    setStep(next);
    window.scrollTo({ top: 0 });
  }

  function parseBody() {
    return bodySchema.safeParse({
      age: body.age === "" ? undefined : Number(body.age),
      heightCm: body.heightCm === "" ? undefined : Number(body.heightCm),
      weightKg: body.weightKg === "" ? undefined : Number(body.weightKg),
    });
  }

  function submitBody(e: FormEvent) {
    e.preventDefault();
    const parsed = parseBody();
    if (!parsed.success) {
      const next: Partial<Record<BodyField, string>> = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as BodyField] ??= issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    go(3);
  }

  function pickGymDays(days: number) {
    const parsed = parseBody();
    if (!goal || !sex || !parsed.success) return go(0);
    setResult(calculate({ goal, sex, gymDaysPerWeek: days, ...parsed.data }, weeklyPlans));
    go(4);
  }

  if (step === 4 && result) {
    return (
      <ResultView
        result={result}
        plan={weeklyPlans.find((p) => p.id === result.recommendedPlanId)}
        onEdit={() => go(0)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(step - 1)}
          disabled={step === 0}
          aria-label="Back"
          className="grid size-10 place-items-center rounded-full ring-1 ring-line transition-[opacity,transform] active:scale-95 disabled:opacity-0"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full origin-left rounded-full bg-action transition-transform duration-500 ease-out"
            style={{ transform: `scaleX(${(step + 1) / STEPS})` }}
          />
        </div>
        <span className="w-10 text-right text-sm text-ink-muted tabular-nums">
          {step + 1}/{STEPS}
        </span>
      </div>

      <div key={step} className="animate-rise flex flex-col gap-5">
        {step === 0 && (
          <>
            <Title>What&apos;s your goal?</Title>
            <div className="grid gap-3 sm:grid-cols-2">
              {goalOptions.map((o) => (
                <Choice
                  key={o.value}
                  selected={goal === o.value}
                  onClick={() => {
                    setGoal(o.value);
                    go(1);
                  }}
                >
                  <span className="block font-display text-lg font-semibold">{o.title}</span>
                  <span className="block text-sm text-ink-muted">{o.hint}</span>
                </Choice>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Title>You are</Title>
            <div className="grid grid-cols-2 gap-3">
              {(["male", "female"] as const).map((s) => (
                <Choice
                  key={s}
                  selected={sex === s}
                  onClick={() => {
                    setSex(s);
                    go(2);
                  }}
                >
                  <span className="block py-4 text-center font-display text-lg font-semibold capitalize">
                    {s}
                  </span>
                </Choice>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <form onSubmit={submitBody} noValidate className="flex flex-col gap-5">
            <Title>About you</Title>
            {bodyFields.map((f) => (
              <label key={f.name} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">{f.label}</span>
                <span
                  className={`flex h-14 items-center rounded-2xl bg-card px-4 ring-1 transition-shadow focus-within:ring-2 ${
                    errors[f.name] ? "ring-danger" : "ring-line focus-within:ring-action"
                  }`}
                >
                  <input
                    name={f.name}
                    inputMode="decimal"
                    autoComplete="off"
                    value={body[f.name]}
                    onChange={(e) => {
                      setBody({ ...body, [f.name]: e.target.value.replace(/[^\d.]/g, "") });
                      if (errors[f.name]) setErrors({ ...errors, [f.name]: undefined });
                    }}
                    aria-invalid={Boolean(errors[f.name])}
                    className="w-full bg-transparent text-lg font-semibold outline-none"
                  />
                  <span className="text-sm text-ink-muted">{f.unit}</span>
                </span>
                {errors[f.name] && <span className="text-sm text-danger">{errors[f.name]}</span>}
              </label>
            ))}
            <button type="submit" className={buttonStyles("primary", "lg")}>
              Next
            </button>
          </form>
        )}

        {step === 3 && (
          <>
            <Title>Gym days per week</Title>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }, (_, d) => (
                <Choice key={d} onClick={() => pickGymDays(d)}>
                  <span className="block py-2 text-center font-display text-2xl font-bold">
                    {d}
                  </span>
                </Choice>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="font-display text-3xl font-bold tracking-tight">{children}</h1>;
}

function Choice({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl p-4 text-left ring-1 transition-[background-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] ${
        selected ? "bg-leaf-soft ring-2 ring-action" : "bg-card ring-line hover:ring-action/50"
      }`}
    >
      {children}
    </button>
  );
}
