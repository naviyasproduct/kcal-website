import Link from "next/link";
import { Logo } from "./logo";

/**
 * Site footer.
 * @returns The footer.
 */
export function SiteFooter() {
  return (
    <footer className="mt-20 bg-brand text-brand-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Logo className="h-9 w-auto self-start" />
          <p className="text-sm text-brand-ink/70">Healthy food, healthy life.</p>
        </div>
        <nav className="flex gap-5 text-sm text-brand-ink/80">
          <Link href="/plans" className="hover:text-accent">
            Plans
          </Link>
          <Link href="/meals" className="hover:text-accent">
            Meals
          </Link>
          <Link href="/calculator" className="hover:text-accent">
            Calculator
          </Link>
        </nav>
      </div>
    </footer>
  );
}
