import type { Metadata } from "next";
import { Badge, Heart } from "@/components/brand";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "kcal — coming soon",
  description: "We're building something to help you live a healthier lifestyle. Coming soon.",
};

/**
 * Holding page shown for every URL until launch (see proxy.ts).
 * Deliberately says nothing about the product, pricing or how it works.
 * @returns The coming-soon screen.
 */
export default function ComingSoonPage() {
  return (
    <main className="relative isolate flex flex-1 flex-col overflow-hidden bg-brand-deep text-cream [--tile-h:clamp(5rem,18vh,9rem)]">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-4 pt-16 pb-[calc(var(--tile-h)+3rem)] text-center sm:px-6">
        <Logo className="animate-pop h-20 w-auto text-cream sm:h-24" />
        <Badge>coming soon</Badge>
        <h1 className="animate-rise text-[clamp(2.75rem,8vw,5.5rem)]">
          something good is on its way
        </h1>
        <p className="animate-rise max-w-xl text-lg text-cream/80 [animation-delay:120ms] sm:text-xl">
          We&apos;re currently building kcal to help you live a healthier, happier lifestyle. We
          can&apos;t wait to share it with you.
        </p>
        <p className="flex items-center gap-2 font-medium text-accent">
          Love yourselves first. <Heart className="size-4" />
        </p>
      </div>
      <div aria-hidden className="pattern-drift absolute inset-x-0 bottom-0 -z-10 opacity-50" />
    </main>
  );
}
