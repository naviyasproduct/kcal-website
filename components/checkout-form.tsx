"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { deliveryLocations, plans, type BillingPeriod, type Plan } from "@/lib/catalog/data";
import { checkoutSchema, type CheckoutInput } from "@/lib/checkout/schema";
import { formatLkr } from "@/lib/format";
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
    `h-14 w-full rounded-2xl bg-card px-4 text-base ring-1 outline-none transition-shadow focus:ring-2 ${
      errors[field] ? "ring-danger" : "ring-line focus:ring-action"
    }`;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-3xl bg-brand p-5 text-brand-ink">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-accent uppercase">Your plan</p>
            <h2 className="font-display text-2xl font-bold">{plan.name}</h2>
            <p className="text-sm text-brand-ink/70">{plan.tagline} · 3 meals a day</p>
          </div>
          <p className="text-right font-display text-2xl font-bold tabular-nums">
            {formatLkr(plan.price)}
          </p>
        </div>
        <div className="text-ink">
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>
      </section>

      <Group title="Deliver to">
        <div className="grid grid-cols-2 gap-3">
          {deliveryLocations.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => set("locationId", l.id)}
              aria-pressed={values.locationId === l.id}
              className={`h-14 rounded-2xl font-semibold ring-1 transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.98] ${
                values.locationId === l.id ? "bg-leaf-soft ring-2 ring-action" : "bg-card ring-line"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            values.locationId === "address"
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
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

      <Group title="Start date">
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

      <Group title="Your details">
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

      <Group title="Payment">
        <div className="flex h-14 items-center justify-between rounded-2xl bg-leaf-soft px-4 ring-2 ring-action">
          <span className="font-semibold">Cash on delivery</span>
          <svg
            viewBox="0 0 24 24"
            className="size-5 text-action"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
      </Group>

      <button type="submit" disabled={sending} className={buttonStyles("primary", "lg")}>
        {sending ? "Confirming…" : `Confirm · ${formatLkr(plan.price)}`}
      </button>
    </form>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 font-display text-lg font-semibold">{title}</legend>
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
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium">{label}</span>}
      {children}
      {error && <span className="text-sm text-danger">{error}</span>}
    </label>
  );
}
