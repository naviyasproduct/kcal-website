import Link from "next/link";
import { Heart } from "./brand";
import { Logo } from "./logo";

const links = [
  { href: "/plans", label: "plans" },
  { href: "/meals", label: "meals" },
  { href: "/calculator", label: "calculator" },
];

/**
 * Brand-colour footer with a slanted top edge.
 * @returns The footer.
 */
export function SiteFooter() {
  return (
    <footer className="slant-t mt-24 bg-brand text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-12 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="flex flex-col gap-3">
          <Logo className="h-14 w-auto self-start" />
          <p className="flex items-center gap-2 text-cream/80">
            healthy food, healthy life <Heart className="size-4 text-accent" />
          </p>
        </div>
        <nav className="flex gap-6 font-medium text-cream/80">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-accent">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
