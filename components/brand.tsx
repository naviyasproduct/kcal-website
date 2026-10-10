import type { ReactNode } from "react";

/**
 * Solid heart, the brand detail from inside the logo's "a".
 * @param props - Optional class names.
 * @returns An inline SVG heart.
 */
export function Heart({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 21.5c-.4 0-.8-.1-1.1-.4C6.3 17.4 2 13.6 2 8.9 2 5.6 4.5 3 7.6 3c1.9 0 3.4.9 4.4 2.4C13 3.9 14.5 3 16.4 3 19.5 3 22 5.6 22 8.9c0 4.7-4.3 8.5-8.9 12.2-.3.3-.7.4-1.1.4Z" />
    </svg>
  );
}

/**
 * Heavy arrow icon.
 * @param props - Optional class names; `back` points it left.
 * @returns An inline SVG arrow.
 */
export function Arrow({
  className = "size-5",
  back = false,
}: {
  className?: string;
  back?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} ${back ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}

const badgeTones = {
  accent: "bg-accent text-brand",
  brand: "bg-brand text-cream",
  cream: "bg-cream text-brand",
} as const;

/**
 * Short label on a slanted block, echoing the angled cuts in the logo.
 * @param props - Label and colour.
 * @returns The badge.
 */
export function Badge({
  children,
  tone = "accent",
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
}) {
  return (
    <span className={`inline-block -skew-x-12 px-3 py-1 ${badgeTones[tone]}`}>
      <span className="block skew-x-12 font-display text-sm tracking-[-0.02em] lowercase">
        {children}
      </span>
    </span>
  );
}

/**
 * Full-width brand-colour page header with a slanted bottom edge.
 * @param props - Title and optional content under it.
 * @returns The header block.
 */
export function PageHero({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="slant-b bg-brand text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pt-10 sm:px-6">
        <h1 className="animate-rise text-[clamp(3rem,9vw,6.5rem)]">{title}</h1>
        {children}
      </div>
    </section>
  );
}
