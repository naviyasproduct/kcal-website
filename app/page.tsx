import Image, { type StaticImageData } from "next/image";
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
import goalBulk from "@/public/images/goals/bulk.webp";
import goalCut from "@/public/images/goals/cut.webp";
import goalHealthy from "@/public/images/goals/healthy.webp";
import goalMaintain from "@/public/images/goals/maintain.webp";

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
  { title: "eat well, daily", text: "3 fresh meals delivered to your door." },
];

/** Goal tiles. Characters are cut-outs from media/hero, standing in front of the title. */
const goalCards: { goal: Goal; title: string; image: StaticImageData }[] = [
  { goal: "bulk", title: "build muscle", image: goalBulk },
  { goal: "cut", title: "lose fat", image: goalCut },
  { goal: "maintain", title: "stay in shape", image: goalMaintain },
  { goal: "healthy", title: "just eat healthy", image: goalHealthy },
];

/** Home menu teaser: a 2×2 grid on phones, the first three in a row from `sm` up. */
const featured = [
  "kurakkan-roti-egg",
  "chicken-red-rice",
  "light-chicken-kottu",
  "fish-ambul-thiyal",
]
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
                className={`group relative isolate aspect-[4/5] overflow-hidden rounded-[2rem] transition-transform duration-300 ease-bounce hover:scale-[1.04] active:scale-[0.97] ${goalTheme[g.goal].block}`}
              >
                {/* The title sits behind the character, which overlaps its lower half. */}
                <h3 className="relative p-4 text-[clamp(1.6rem,3.5vw,2.75rem)] leading-[0.92] sm:p-5">
                  {g.title}
                </h3>
                <Image
                  src={g.image}
                  alt=""
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="absolute inset-x-0 -bottom-[4%] z-10 mx-auto h-[76%] w-auto origin-bottom lg:h-[80%] transition-transform duration-500 ease-bounce group-hover:scale-[1.06]"
                />
                <Heart className="absolute top-4 right-4 z-20 size-6 scale-0 transition-transform duration-300 ease-bounce group-hover:scale-100 sm:top-5 sm:right-5" />
                <span
                  className={`absolute right-3 bottom-3 z-20 grid size-10 place-items-center rounded-full transition-transform duration-300 ease-bounce group-hover:translate-x-1 sm:right-4 sm:bottom-4 sm:size-12 ${goalTheme[g.goal].badge}`}
                >
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 sm:[&>*:nth-child(n+4)]:hidden">
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
