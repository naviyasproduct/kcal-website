"use client";

import Link from "next/link";
import { useState } from "react";
import { plans, type BillingPeriod } from "@/lib/catalog/data";
import { formatLkr } from "@/lib/format";
import { buttonStyles } from "./button";
import { PeriodToggle } from "./period-toggle";

/**
 * All plans with a weekly / monthly switch.
 * @returns The plan cards.
 */
export function PlanGrid() {
  const [period, setPeriod] = useState<BillingPeriod>("weekly");
  const visible = plans.filter((p) => p.billingPeriod === period);

  return (
    <div className="flex flex-col gap-6">
      <div className="self-start">
        <PeriodToggle value={period} onChange={setPeriod} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((p) => (
          <article
            key={p.goal}
            className="flex flex-col gap-5 rounded-3xl bg-card p-6 ring-1 ring-line"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold">{p.name}</h2>
                <p className="text-sm text-ink-muted">{p.tagline}</p>
              </div>
              <span className="rounded-full bg-leaf-soft px-3 py-1 text-xs font-semibold text-action">
                {p.calorieMin.toLocaleString()}–{p.calorieMax.toLocaleString()} kcal
              </span>
            </div>
            <p>
              <span className="font-display text-3xl font-bold tabular-nums">
                {formatLkr(p.price)}
              </span>
              <span className="text-sm text-ink-muted">
                {" "}
                / {period === "weekly" ? "week" : "month"}
              </span>
            </p>
            <ul className="flex flex-col gap-1.5 text-sm">
              {["3 meals a day", "Macros matched to you", "Pause or cancel anytime"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4 text-action"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href={`/checkout?plan=${p.id}`} className={`${buttonStyles("primary")} mt-auto`}>
              Choose {p.name}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
