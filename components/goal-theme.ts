import type { Goal } from "@/lib/nutrition/schema";
import type { ButtonVariant } from "./button";

/** Solid colour block and matching button for each goal. */
export const goalTheme: Record<Goal, { block: string; button: ButtonVariant }> = {
  bulk: { block: "bg-accent text-brand", button: "dark" },
  cut: { block: "bg-cream-deep text-ink", button: "dark" },
  maintain: { block: "bg-brand-soft text-cream", button: "primary" },
  healthy: { block: "bg-ink text-cream", button: "primary" },
};
