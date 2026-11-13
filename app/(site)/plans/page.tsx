import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/brand";
import { PlanGrid } from "@/components/plan-grid";

export const metadata: Metadata = { title: "Plans · kcal" };

/**
 * Plans page.
 * @returns All plans.
 */
export default function PlansPage() {
  return (
    <main>
      <PageHero title="pick a plan">
        <p className="text-lg text-cream/80">
          Not sure?{" "}
          <Link
            href="/calculator"
            className="font-bold text-cream underline decoration-accent decoration-4 underline-offset-4"
          >
            Find my plan
          </Link>
        </p>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <PlanGrid />
      </div>
    </main>
  );
}
