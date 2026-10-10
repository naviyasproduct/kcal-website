import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "@/components/brand";
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
    <main className="slant-b bg-brand text-cream">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 pt-16 text-center">
        <Heart className="animate-pop size-28 text-accent" />
        <h1 className="animate-rise text-[clamp(3rem,10vw,6rem)] [animation-delay:120ms]">
          you&apos;re in!
        </h1>
        {plan && (
          <p className="animate-rise text-lg text-cream/80 [animation-delay:200ms]">
            {plan.name} plan{startDate ? `, first meals on ${startDate}` : ""}. Pay cash on
            delivery.
          </p>
        )}
        <Link
          href="/meals"
          className={`${buttonStyles("primary", "lg")} animate-rise [animation-delay:280ms]`}
        >
          see the menu
        </Link>
      </div>
    </main>
  );
}
