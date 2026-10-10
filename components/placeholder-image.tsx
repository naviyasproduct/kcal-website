const ratios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[4/3]",
} as const;

const tones = {
  accent: "bg-accent text-brand/25",
  brand: "bg-brand text-cream/25",
  soft: "bg-brand-soft text-cream/25",
} as const;

type PlaceholderImageProps = {
  ratio: keyof typeof ratios;
  label: string;
  tone?: keyof typeof tones;
  className?: string;
};

/**
 * Fixed-ratio solid block shown where a food photo will go. Reserves space so
 * swapping in a real `next/image` later causes no layout shift.
 * @param props - Aspect ratio, accessible label, tint and mask classes.
 * @returns A placeholder block.
 */
export function PlaceholderImage({
  ratio,
  label,
  tone = "brand",
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`${ratios[ratio]} ${tones[tone]} grid w-full place-items-center ${className}`}
    >
      <svg viewBox="0 0 48 48" className="h-2/5 w-2/5" fill="currentColor" aria-hidden>
        <path d="M4 22h40a2 2 0 0 1 2 2c0 10-8.5 18-20 18h-4C10.5 42 2 34 2 24a2 2 0 0 1 2-2Z" />
        <path
          d="M17 6c2 2 2 4 0 6s-2 4 0 6M25 4c2 2.5 2 5 0 7.5s-2 5 0 7.5M33 6c2 2 2 4 0 6s-2 4 0 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
