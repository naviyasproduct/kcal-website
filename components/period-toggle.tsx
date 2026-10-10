"use client";

import type { BillingPeriod } from "@/lib/catalog/data";

const options: { value: BillingPeriod; label: string }[] = [
  { value: "weekly", label: "weekly" },
  { value: "monthly", label: "monthly · save 10%" },
];

/**
 * Two-option switch with a sliding solid knob.
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
    <div role="radiogroup" className="relative grid grid-cols-2 rounded-full bg-cream-deep p-1.5">
      <span
        aria-hidden
        className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-brand transition-transform duration-500 ease-bounce"
        style={{ transform: value === "monthly" ? "translateX(100%)" : "none" }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`relative h-12 rounded-full px-4 font-display text-sm tracking-[-0.02em] transition-colors duration-300 sm:px-6 ${
            value === o.value ? "text-cream" : "text-ink-muted"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
