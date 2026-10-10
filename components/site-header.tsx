import Link from "next/link";
import { Logo } from "./logo";
import { buttonStyles } from "./button";

const nav = [
  { href: "/plans", label: "plans" },
  { href: "/meals", label: "meals" },
];

/**
 * Sticky brand-colour top bar. The cream logo always sits on the brand colour.
 * @returns The site header.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-brand text-cream">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-1 px-4 sm:h-20 sm:px-6">
        <Link
          href="/"
          aria-label="kcal home"
          className="transition-transform duration-300 ease-bounce hover:scale-105"
        >
          <Logo className="h-8 w-auto sm:h-10" />
        </Link>
        <nav className="ml-auto flex items-center font-medium">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-cream/80 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/calculator" className={`${buttonStyles("primary")} ml-1 h-11 px-5`}>
          find my plan
        </Link>
      </div>
    </header>
  );
}
