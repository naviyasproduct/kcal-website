"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { deliveryLocations, plans, type BillingPeriod, type Plan } from "@/lib/catalog/data";
import { checkoutSchema, type CheckoutInput } from "@/lib/checkout/schema";
import { formatLkr } from "@/lib/format";
import { Arrow, Badge, Heart } from "./brand";
import { buttonStyles } from "./button";
import { PeriodToggle } from "./period-toggle";

type Field = keyof CheckoutInput;

/**
 * Checkout: billing period, delivery, start date, contact, cash on delivery.
 * Preview only: confirming goes to the confirmation screen without saving.
 * @param props - Chosen plan and the earliest start date.
 * @returns The checkout form.
 */
export function CheckoutForm({ initialPlan, minDate }: { initialPlan: Plan; minDate: string }) {
  const router = useRouter();
  const [period, setPeriod] = useState<BillingPeriod>(initialPlan.billingPeriod);
  const [values, setValues] = useState({
    name: "",
    phone: "",
    locationId: "sliit",
    addressLine: "",
    startDate: minDate,
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sending, setSending] = useState(false);

  const plan =
    plans.find((p) => p.goal === initialPlan.goal && p.billingPeriod === period) ?? initialPlan;

  function set(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = checkoutSchema(minDate).safeParse({ ...values, planId: plan.id });
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as Field] ??= issue.message;
      setErrors(next);
      return;
    }
    setSending(true);
    router.push(`/checkout/done?plan=${plan.id}&start=${parsed.data.startDate}`);
  }

  const inputClass = (field: Field) =>
    `h-16 w-full rounded-[1.25rem] bg-cream-deep px-5 text-lg font-medium outline-none transition-shadow ${
      errors[field] ? "ring-3 ring-danger" : "focus:ring-3 focus:ring-brand"
    }`;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-8">
      <section className="flex flex-col gap-5 rounded-[2rem] bg-brand p-6 text-cream">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col items-start gap-3">
            <Badge>your plan</Badge>
            <h2 className="text-5xl">{plan.name}</h2>
            <p className="flex items-center gap-2 text-cream/80">
              <Heart className="size-4 text-accent" /> {plan.tagline}, 3 meals a day
            </p>
          </div>
          <p className="text-right font-display text-3xl tracking-[-0.03em] tabular-nums">
            {formatLkr(plan.price)}
          </p>
        </div>
        <PeriodToggle value={period} onChange={setPeriod} />
      </section>

      <Group title="deliver to">
        <div className="grid grid-cols-2 gap-3">
          {deliveryLocations.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => set("locationId", l.id)}
              aria-pressed={values.locationId === l.id}
              className={`h-16 rounded-[1.25rem] font-display tracking-[-0.02em] lowercase transition-[background-color,color,transform] duration-300 ease-bounce hover:scale-[1.03] active:scale-[0.97] ${
                values.locationId === l.id ? "bg-brand text-cream" : "bg-cream-deep text-ink"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-bounce ${
            values.locationId === "address"
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden p-1">
            <Input label="Address" error={errors.addressLine}>
              <input
                value={values.addressLine}
                onChange={(e) => set("addressLine", e.target.value)}
                autoComplete="street-address"
                tabIndex={values.locationId === "address" ? 0 : -1}
                className={inputClass("addressLine")}
              />
            </Input>
          </div>
        </div>
      </Group>

      <Group title="start date">
        <Input error={errors.startDate}>
          <input
            type="date"
            min={minDate}
            value={values.startDate}
            onChange={(e) => set("startDate", e.target.value)}
            className={inputClass("startDate")}
          />
        </Input>
      </Group>

      <Group title="your details">
        <Input label="Name" error={errors.name}>
          <input
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
            className={inputClass("name")}
          />
        </Input>
        <Input label="Mobile" error={errors.phone}>
          <input
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            autoComplete="tel"
            placeholder="07X XXX XXXX"
            className={inputClass("phone")}
          />
        </Input>
      </Group>

      <Group title="payment">
        <div className="flex h-16 items-center justify-between rounded-[1.25rem] bg-brand px-5 text-cream">
          <span className="font-display tracking-[-0.02em]">cash on delivery</span>
          <Heart className="size-5 text-accent" />
        </div>
      </Group>

      <button type="submit" disabled={sending} className={buttonStyles("primary", "lg")}>
        {sending ? (
          "confirming…"
        ) : (
          <>
            confirm · {formatLkr(plan.price)} <Arrow />
          </>
        )}
      </button>
    </form>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-4 font-display text-2xl tracking-[-0.03em]">{title}</legend>
      {children}
    </fieldset>
  );
}

function Input({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      {label && <span className="font-bold">{label}</span>}
      {children}
      {error && <span className="font-medium text-danger">{error}</span>}
    </label>
  );
}
