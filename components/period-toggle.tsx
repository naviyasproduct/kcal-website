"use client";

import type { BillingPeriod } from "@/lib/catalog/data";

const options: { value: BillingPeriod; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly · save 10%" },
];

/**
 * Two-option segmented switch with a sliding highlight.
 * @param props - Current value and change handler.
 * @returns The toggle.
 */
export function PeriodToggle({
  value,
  onChange,
}: {
  value: BillingPeriod;
  onChange: (v: BillingPeriod) => void;
}) {
  return (
    <div
      role="radiogroup"
      className="relative grid grid-cols-2 rounded-full bg-surface-muted p-1 text-sm font-semibold"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-card shadow-sm ring-1 ring-line transition-transform duration-300 ease-out"
        style={{ transform: value === "monthly" ? "translateX(100%)" : "none" }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`relative h-10 rounded-full px-4 transition-colors ${value === o.value ? "text-ink" : "text-ink-muted"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
