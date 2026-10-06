const ratios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[4/3]",
} as const;

const tones = {
  leaf: "bg-leaf-soft text-action/40",
  sun: "bg-accent-soft text-brand/30",
  cream: "bg-surface-muted text-brand/25",
} as const;

type PlaceholderImageProps = {
  ratio: keyof typeof ratios;
  label: string;
  tone?: keyof typeof tones;
};

/**
 * Fixed-ratio tinted box shown where a final photo will go. Reserves space so
 * swapping in a real `next/image` later causes no layout shift.
 * @param props - Aspect ratio, accessible label and tint.
 * @returns A placeholder block.
 */
export function PlaceholderImage({ ratio, label, tone = "cream" }: PlaceholderImageProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`${ratios[ratio]} ${tones[tone]} grid w-full place-items-center`}
    >
      <svg
        viewBox="0 0 48 48"
        className="h-1/3 w-1/3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M6 24h36a18 18 0 0 1-36 0Z" />
        <path d="M18 18c0-4 3-4 3-8M27 18c0-4 3-4 3-8" />
      </svg>
    </div>
  );
}
