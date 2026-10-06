import Image from "next/image";
import Link from "next/link";
import { buttonStyles } from "@/components/button";
import { MealCard } from "@/components/meal-card";
import { meals } from "@/lib/catalog/data";
import cover from "@/public/images/cover.jpg";

const steps = [
  { title: "Tell us about you", text: "Goal, height, weight, gym days. 30 seconds." },
  { title: "Get your plan", text: "Calories and macros matched to your body." },
  { title: "Eat well, daily", text: "3 fresh meals delivered to campus or home." },
];

const goalCards = [
  { goal: "bulk", title: "Build muscle", tone: "bg-action text-action-ink" },
  { goal: "cut", title: "Lose fat", tone: "bg-accent text-brand" },
  { goal: "maintain", title: "Stay in shape", tone: "bg-brand text-brand-ink" },
  { goal: "healthy", title: "Just eat healthy", tone: "bg-leaf-soft text-brand" },
];

const featured = ["kurakkan-roti-egg", "chicken-red-rice", "light-chicken-kottu"]
  .map((slug) => meals.find((m) => m.slug === slug))
  .filter((m) => m !== undefined);

/**
 * Home page.
 * @returns The landing screen.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-20 px-4 pt-8">
      <section className="flex flex-col gap-8">
        <div className="animate-rise flex max-w-2xl flex-col gap-5">
          <span className="self-start rounded-full bg-leaf-soft px-3 py-1 text-xs font-semibold text-action">
            Now delivering to SLIIT campus
          </span>
          <h1 className="font-display text-5xl leading-[0.95] font-bold tracking-tight sm:text-7xl">
            Meals matched to <span className="text-action">your body.</span>
          </h1>
          <p className="text-lg text-ink-muted">
            3 healthy meals a day, made for your goal and delivered to you.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/calculator" className={buttonStyles("primary", "lg")}>
              Find my plan
            </Link>
            <Link href="/plans" className={buttonStyles("secondary", "lg")}>
              See plans
            </Link>
          </div>
        </div>
        <div className="animate-rise relative aspect-[4/3] overflow-hidden rounded-[2rem] [animation-delay:100ms] sm:aspect-[2.3/1]">
          <Image
            src={cover}
            alt="kcal meal boxes"
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 992px, 100vw"
            className="object-cover object-[70%_center]"
          />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-3xl font-bold tracking-tight">How it works</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="flex gap-4 rounded-3xl bg-card p-5 ring-1 ring-line sm:flex-col"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent font-display font-bold text-brand">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-ink-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-3xl font-bold tracking-tight">What&apos;s your goal?</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {goalCards.map((g) => (
            <Link
              key={g.goal}
              href={`/calculator?goal=${g.goal}`}
              className={`group flex aspect-square flex-col justify-between rounded-3xl p-5 transition-transform duration-200 ease-out hover:-translate-y-1 active:scale-[0.98] ${g.tone}`}
            >
              <span className="font-display text-xl leading-tight font-bold sm:text-2xl">
                {g.title}
              </span>
              <span className="grid size-10 place-items-center self-end rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-1">
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold tracking-tight">On the menu</h2>
          <Link
            href="/meals"
            className="text-sm font-semibold text-action underline-offset-4 hover:underline"
          >
            All meals
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((m) => (
            <MealCard key={m.slug} meal={m} />
          ))}
        </div>
      </section>

      <section className="flex flex-col items-start gap-5 rounded-[2rem] bg-accent p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand">
            Ready in 30 seconds.
          </h2>
          <p className="text-brand/80">Answer 4 questions. Get your plan.</p>
        </div>
        <Link href="/calculator" className={buttonStyles("primary", "lg")}>
          Find my plan
        </Link>
      </section>
    </main>
  );
}
