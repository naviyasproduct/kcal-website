"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { plans } from "@/lib/catalog/data";
import { calculate, type NutritionResult } from "@/lib/nutrition/calculate";
import { calculatorInputSchema, type Goal, type Sex } from "@/lib/nutrition/schema";
import { Arrow, Heart } from "./brand";
import { buttonStyles } from "./button";
import { ResultView } from "./result-view";

const goalOptions: { value: Goal; title: string; hint: string }[] = [
  { value: "bulk", title: "build muscle", hint: "More food, more protein" },
  { value: "cut", title: "lose fat", hint: "Fewer calories, full plate" },
  { value: "maintain", title: "stay in shape", hint: "Keep what you have" },
  { value: "healthy", title: "just eat healthy", hint: "No gym, just good food" },
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
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(step - 1)}
          disabled={step === 0}
          aria-label="Back"
          className="grid size-12 place-items-center rounded-full bg-cream-deep transition-[opacity,transform] duration-300 ease-bounce hover:scale-110 active:scale-95 disabled:opacity-0"
        >
          <Arrow back />
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-cream-deep">
          <div
            className="h-full origin-left rounded-full bg-brand transition-transform duration-500 ease-bounce"
            style={{ transform: `scaleX(${(step + 1) / STEPS})` }}
          />
        </div>
        <span className="w-12 text-right font-display tabular-nums">
          {step + 1}/{STEPS}
        </span>
      </div>

      <div key={step} className="animate-rise flex flex-col gap-6">
        {step === 0 && (
          <>
            <Title>what&apos;s your goal?</Title>
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
                  <span className="block font-display text-2xl tracking-[-0.03em] lowercase">
                    {o.title}
                  </span>
                  <span className="block text-sm opacity-75">{o.hint}</span>
                </Choice>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Title>you are</Title>
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
                  <span className="block py-6 text-center font-display text-3xl tracking-[-0.03em]">
                    {s}
                  </span>
                </Choice>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <form onSubmit={submitBody} noValidate className="flex flex-col gap-5">
            <Title>about you</Title>
            {bodyFields.map((f) => (
              <label key={f.name} className="flex flex-col gap-2">
                <span className="font-bold">{f.label}</span>
                <span
                  className={`flex h-16 items-center rounded-[1.25rem] bg-cream-deep px-5 transition-shadow ${
                    errors[f.name]
                      ? "ring-3 ring-danger"
                      : "focus-within:ring-3 focus-within:ring-brand"
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
                    className="w-full bg-transparent font-display text-2xl tracking-[-0.03em] outline-none"
                  />
                  <span className="font-bold text-ink-muted">{f.unit}</span>
                </span>
                {errors[f.name] && (
                  <span className="font-medium text-danger">{errors[f.name]}</span>
                )}
              </label>
            ))}
            <button type="submit" className={buttonStyles("primary", "lg")}>
              next <Arrow />
            </button>
          </form>
        )}

        {step === 3 && (
          <>
            <Title>gym days a week</Title>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }, (_, d) => (
                <Choice key={d} onClick={() => pickGymDays(d)}>
                  <span className="block py-3 text-center font-display text-4xl">{d}</span>
                </Choice>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Title({ children }: { children: ReactNode }) {
  return <h1 className="text-[clamp(2.5rem,8vw,4rem)]">{children}</h1>;
}

function Choice({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative rounded-[1.5rem] p-5 text-left transition-[background-color,color,transform] duration-300 ease-bounce hover:scale-[1.03] active:scale-[0.97] ${
        selected ? "bg-brand text-cream" : "bg-cream-deep text-ink hover:bg-accent hover:text-brand"
      }`}
    >
      <Heart
        className={`absolute top-4 right-4 size-5 transition-transform duration-300 ease-bounce ${
          selected ? "scale-100 text-accent" : "scale-0 group-hover:scale-100"
        }`}
      />
      {children}
    </button>
  );
}
