import Link from "next/link";
import { Arrow, Badge, Heart } from "@/components/brand";
import { buttonStyles } from "@/components/button";
import { goalTheme } from "@/components/goal-theme";
import { MealCarousel, type HeroSlide } from "@/components/hero/meal-carousel";
import { MealCard } from "@/components/meal-card";
import { meals } from "@/lib/catalog/data";
import type { Goal } from "@/lib/nutrition/schema";
import meal1 from "@/public/images/hero/meal-1.webp";
import meal2 from "@/public/images/hero/meal-2.webp";

/**
 * Hero slideshow. To add a meal, drop a transparent WebP in public/images/hero (master PNGs live in media/hero) and list it here.
 * Nutrition figures are placeholders until the real recipes are costed.
 */
const heroSlides: HeroSlide[] = [
  {
    image: meal1,
    alt: "grilled chicken salad box with a kcal protein shake",
    name: "grilled chicken power box",
    calories: 620,
    proteinG: 52,
    carbsG: 48,
    fatG: 22,
    href: "/plans",
  },
  {
    image: meal2,
    alt: "plant-based tofu and chickpea box with a kcal plant protein shake",
    name: "plant-based feast",
    calories: 580,
    proteinG: 34,
    carbsG: 62,
    fatG: 20,
    href: "/plans",
  },
];

const steps = [
  { title: "tell us about you", text: "Goal, height, weight, gym days. 30 seconds." },
  { title: "get your plan", text: "Calories and macros matched to your body." },
  { title: "eat well, daily", text: "3 fresh meals delivered to campus or home." },
];

const goalCards: { goal: Goal; title: string }[] = [
  { goal: "bulk", title: "build muscle" },
  { goal: "cut", title: "lose fat" },
  { goal: "maintain", title: "stay in shape" },
  { goal: "healthy", title: "just eat healthy" },
];

const featured = ["kurakkan-roti-egg", "chicken-red-rice", "light-chicken-kottu"]
  .map((slug) => meals.find((m) => m.slug === slug))
  .filter((m) => m !== undefined);

const container = "mx-auto max-w-6xl px-4 sm:px-6";
const sectionTitle = "text-[clamp(2.5rem,6vw,4.5rem)]";

/**
 * Home page: a deep green hero with the meal slideshow standing on a drifting
 * pattern floor, then colour-blocked sections alternating brand colour and cream.
 * @returns The landing screen.
 */
export default function HomePage() {
  return (
    <main>
      <section className="relative isolate h-(--hero-h) overflow-hidden bg-brand-deep [--hero-h:max(36rem,min(100svh,calc(50vw+30rem)))]">
        <h1 className="sr-only">kcal: meals matched to your body, delivered daily</h1>
        <div
          aria-hidden
          className="pattern-drift absolute inset-x-0 bottom-0 opacity-50 [--tile-h:calc(var(--hero-h)*0.22)]"
        />
        <div className="absolute inset-x-0 top-14 bottom-[23%] sm:top-16">
          <MealCarousel slides={heroSlides} />
        </div>
      </section>

      <section
        id="how-it-works"
        className={`${container} reveal flex scroll-mt-24 flex-col gap-8 py-16`}
      >
        <h2 className={sectionTitle}>how it works</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-4 rounded-[2rem] bg-cream-deep p-6">
              <Badge tone="brand">
                <span className="text-2xl">{i + 1}</span>
              </Badge>
              <h3 className="text-2xl">{s.title}</h3>
              <p className="text-ink-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="slant-y bg-brand text-cream">
        <div className={`${container} reveal flex flex-col gap-8`}>
          <h2 className={sectionTitle}>what&apos;s your goal?</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {goalCards.map((g) => (
              <Link
                key={g.goal}
                href={`/calculator?goal=${g.goal}`}
                className={`group relative flex aspect-square flex-col justify-between rounded-[2rem] p-5 transition-transform duration-300 ease-bounce hover:scale-[1.04] active:scale-[0.97] sm:p-6 ${goalTheme[g.goal].block}`}
              >
                <Heart className="absolute top-5 right-5 size-6 scale-0 transition-transform duration-300 ease-bounce group-hover:scale-100" />
                <h3 className="text-[clamp(1.5rem,3.5vw,2.25rem)]">{g.title}</h3>
                <span className="grid size-12 place-items-center self-end rounded-full bg-current/15 transition-transform duration-300 ease-bounce group-hover:translate-x-1">
                  <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${container} reveal flex flex-col gap-8 py-16`}>
        <div className="flex items-end justify-between gap-4">
          <h2 className={sectionTitle}>on the menu</h2>
          <Link
            href="/meals"
            className="flex shrink-0 items-center gap-1 font-bold text-brand transition-transform duration-300 ease-bounce hover:translate-x-1"
          >
            all meals <Arrow className="size-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {featured.map((m) => (
            <MealCard key={m.slug} meal={m} />
          ))}
        </div>
      </section>

      <section className={container}>
        <div className="reveal relative flex flex-col items-start gap-6 overflow-hidden rounded-[2.5rem] bg-accent p-8 text-brand-deep sm:p-12">
          <Heart className="absolute -right-6 -bottom-10 size-48 -rotate-12 text-brand-deep/10 sm:size-64" />
          <h2 className="text-[clamp(2.5rem,7vw,5rem)]">ready in 30 seconds.</h2>
          <p className="text-lg">Answer 4 questions. Get your plan.</p>
          <Link href="/calculator" className={buttonStyles("dark", "lg")}>
            find my plan <Arrow />
          </Link>
        </div>
      </section>
    </main>
  );
}
