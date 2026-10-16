import type { Goal } from "@/lib/nutrition/schema";
import type { ButtonVariant } from "./button";

/** Solid colour block, matching button and round arrow badge for each goal. */
export const goalTheme: Record<Goal, { block: string; button: ButtonVariant; badge: string }> = {
  bulk: { block: "bg-accent text-brand-deep", button: "dark", badge: "bg-brand-deep text-cream" },
  cut: { block: "bg-cream-deep text-ink", button: "dark", badge: "bg-brand-deep text-cream" },
  maintain: {
    block: "bg-brand-soft text-cream",
    button: "primary",
    badge: "bg-accent text-brand-deep",
  },
  healthy: { block: "bg-ink text-cream", button: "primary", badge: "bg-accent text-brand-deep" },
};
