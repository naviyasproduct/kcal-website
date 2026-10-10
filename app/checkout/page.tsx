import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { getPlan } from "@/lib/catalog/data";
import { earliestStartDate } from "@/lib/checkout/schema";

export const metadata: Metadata = { title: "Checkout · kcal" };

/**
 * Checkout for the plan in `?plan=`. Unknown plans go back to the plans page.
 * @param props - Page props with search params.
 * @returns The checkout screen.
 */
export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const { plan: planId } = await searchParams;
  const plan = typeof planId === "string" ? getPlan(planId) : undefined;
  if (!plan) redirect("/plans");

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-8 px-4 py-10">
      <h1 className="animate-rise text-[clamp(2.5rem,8vw,4rem)]">checkout</h1>
      <CheckoutForm initialPlan={plan} minDate={earliestStartDate()} />
    </main>
  );
}
