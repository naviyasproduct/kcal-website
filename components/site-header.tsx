import Link from "next/link";
import { Logo } from "./logo";
import { buttonStyles } from "./button";

const nav = [
  { href: "/plans", label: "Plans" },
  { href: "/meals", label: "Meals" },
];

/**
 * Sticky top bar with logo, navigation and the main call to action.
 * @returns The site header.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
        <Link href="/" className="text-action" aria-label="kcal home">
          <Logo className="h-7 w-auto" />
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm font-medium">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/calculator" className={`${buttonStyles("primary")} h-10 px-4`}>
          Find my plan
        </Link>
      </div>
    </header>
  );
}
