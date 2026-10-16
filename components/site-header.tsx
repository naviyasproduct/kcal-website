"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { buttonStyles } from "./button";

const leftNav = [
  { href: "/meals", label: "meals" },
  { href: "/plans", label: "plans" },
];

/**
 * Top bar: links either side of a centred logo. On the home page it starts
 * transparent over the hero and fills in with deep green once the page scrolls.
 * @returns The site header.
 */
export function SiteHeader() {
  const home = usePathname() === "/";
  const [scrolled, setScrolled] = useState(false);
  const solid = !home || scrolled;

  useEffect(() => {
    if (!home) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  const link =
    "rounded-full px-2 py-2 font-medium text-cream/80 transition-colors hover:text-accent sm:px-3";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 h-16 sm:h-20">
        <div
          className={`absolute inset-0 bg-brand-deep transition-opacity duration-300 ${solid ? "opacity-100" : "opacity-0"}`}
        />
        <nav className="relative mx-auto grid h-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 text-sm sm:px-6 sm:text-base">
          <div className="flex items-center justify-end gap-0.5 sm:gap-2">
            {leftNav.map((item) => (
              <Link key={item.href} href={item.href} className={link}>
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/"
            aria-label="kcal home"
            className="mx-3 block text-cream transition-transform duration-300 ease-bounce hover:scale-105 sm:mx-8"
          >
            <Logo className="h-8 w-auto sm:h-10" />
          </Link>
          <div className="flex items-center gap-0.5 sm:gap-2">
            <Link href="/#how-it-works" className={`${link} hidden sm:block`}>
              how it works
            </Link>
            <Link
              href="/calculator"
              className={`${buttonStyles("primary")} h-8 px-3 text-xs whitespace-nowrap sm:h-11 sm:px-5 sm:text-sm`}
            >
              find my plan
            </Link>
          </div>
        </nav>
      </header>
      {!home && <div aria-hidden className="h-16 sm:h-20" />}
    </>
  );
}
