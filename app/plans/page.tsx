import type { Metadata } from "next";
import Link from "next/link";
import { PlanGrid } from "@/components/plan-grid";

export const metadata: Metadata = { title: "Plans · kcal" };

/**
 * Plans page.
 * @returns All plans.
 */
export default function PlansPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-bold tracking-tight">Plans</h1>
        <p className="text-ink-muted">
          Not sure?{" "}
          <Link
            href="/calculator"
            className="font-semibold text-action underline-offset-4 hover:underline"
          >
            Find my plan
          </Link>
        </p>
      </div>
      <PlanGrid />
    </main>
  );
}
