import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/button";
import { getPlan } from "@/lib/catalog/data";

export const metadata: Metadata = { title: "You're in · kcal" };

/**
 * Order confirmation.
 * @param props - Page props with the plan and start date.
 * @returns The confirmation screen.
 */
export default async function CheckoutDonePage({ searchParams }: PageProps<"/checkout/done">) {
  const { plan: planId, start } = await searchParams;
  const plan = typeof planId === "string" ? getPlan(planId) : undefined;
  const startDate =
    typeof start === "string" && /^\d{4}-\d{2}-\d{2}$/.test(start)
      ? new Date(`${start}T00:00:00`).toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      : undefined;

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-16 text-center">
      <div className="animate-rise grid size-20 place-items-center rounded-full bg-action text-action-ink">
        <svg
          viewBox="0 0 24 24"
          className="size-10"
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
      <div className="animate-rise flex flex-col gap-2 [animation-delay:80ms]">
        <h1 className="font-display text-4xl font-bold tracking-tight">You&apos;re in!</h1>
        {plan && (
          <p className="text-ink-muted">
            {plan.name} plan{startDate ? `, first meals on ${startDate}` : ""}. Pay cash on
            delivery.
          </p>
        )}
      </div>
      <Link
        href="/meals"
        className={`${buttonStyles("secondary", "lg")} animate-rise [animation-delay:160ms]`}
      >
        See the menu
      </Link>
    </main>
  );
}
