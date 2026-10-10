"use client";

import Link from "next/link";
import { useState } from "react";
import { plans, type BillingPeriod } from "@/lib/catalog/data";
import { formatLkr } from "@/lib/format";
import { Arrow, Heart } from "./brand";
import { buttonStyles } from "./button";
import { goalTheme } from "./goal-theme";
import { PeriodToggle } from "./period-toggle";

const perks = ["3 meals a day", "Macros matched to you", "Pause or cancel anytime"];

/**
 * All plans as solid colour blocks, with a weekly / monthly switch.
 * @returns The plan cards.
 */
export function PlanGrid() {
  const [period, setPeriod] = useState<BillingPeriod>("weekly");
  const visible = plans.filter((p) => p.billingPeriod === period);

  return (
    <div className="flex flex-col gap-8">
      <div className="self-start">
        <PeriodToggle value={period} onChange={setPeriod} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {visible.map((p) => (
          <article
            key={p.goal}
            className={`reveal flex flex-col gap-6 rounded-[2rem] p-7 transition-transform duration-300 ease-bounce hover:scale-[1.02] ${goalTheme[p.goal].block}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-5xl">{p.name}</h2>
                <p className="mt-2 font-medium opacity-80">{p.tagline}</p>
              </div>
              <span className="-skew-x-12 bg-current/15 px-3 py-1">
                <span className="block skew-x-12 text-sm font-bold">
                  {p.calorieMin.toLocaleString()}–{p.calorieMax.toLocaleString()} kcal
                </span>
              </span>
            </div>
            <p>
              <span className="font-display text-5xl tracking-[-0.04em] tabular-nums">
                {formatLkr(p.price)}
              </span>
              <span className="font-bold opacity-80">
                {" "}
                / {period === "weekly" ? "week" : "month"}
              </span>
            </p>
            <ul className="flex flex-col gap-2">
              {perks.map((f) => (
                <li key={f} className="flex items-center gap-3 font-medium">
                  <Heart className="size-4 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/checkout?plan=${p.id}`}
              className={`${buttonStyles(goalTheme[p.goal].button, "lg")} mt-auto`}
            >
              choose {p.name.toLowerCase()} <Arrow />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
