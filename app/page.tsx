import Image from "next/image";
import Link from "next/link";
import { Arrow, Badge, Heart } from "@/components/brand";
import { buttonStyles } from "@/components/button";
import { goalTheme } from "@/components/goal-theme";
import { MealCard } from "@/components/meal-card";
import { meals } from "@/lib/catalog/data";
import type { Goal } from "@/lib/nutrition/schema";
import cover from "@/public/images/cover.jpg";

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
 * Home page: colour-blocked sections alternating brand colour and cream.
 * @returns The landing screen.
 */
export default function HomePage() {
  return (
    <main>
      <section className="slant-b bg-brand text-cream">
        <div className={`${container} flex flex-col gap-8 pt-8 sm:pt-12`}>
          <div className="animate-rise flex flex-col items-start gap-6">
            <Badge>now delivering to sliit campus</Badge>
            <h1 className="text-[clamp(3rem,9vw,8rem)]">
              meals matched to <span className="text-accent">your body.</span>
            </h1>
            <p className="max-w-md text-lg text-cream/80">
              3 healthy meals a day, made for your goal and delivered to you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/calculator" className={buttonStyles("primary", "lg")}>
                find my plan <Arrow />
              </Link>
              <Link href="/plans" className={buttonStyles("light", "lg")}>
                see plans
              </Link>
            </div>
          </div>
          <div className="animate-rise overflow-hidden rounded-[2rem] [animation-delay:120ms]">
            <div className="mask-slant relative aspect-[4/3] sm:aspect-[2.3/1]">
              <Image
                src={cover}
                alt="kcal meal boxes"
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1152px) 1104px, 100vw"
                className="object-cover object-[72%_center]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`${container} reveal flex flex-col gap-8 py-16`}>
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
        <div className="reveal relative flex flex-col items-start gap-6 overflow-hidden rounded-[2.5rem] bg-accent p-8 text-brand sm:p-12">
          <Heart className="absolute -right-6 -bottom-10 size-48 -rotate-12 text-brand/10 sm:size-64" />
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
