import { PlaceholderImage } from "@/components/placeholder-image";

/**
 * Home page.
 * @returns The landing screen.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">kcal</h1>
      <p className="text-ink-muted">Meals matched to your body. Delivered daily.</p>
      <PlaceholderImage ratio="video" label="Hero image" />
    </main>
  );
}
