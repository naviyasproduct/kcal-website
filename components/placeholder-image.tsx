const ratios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
} as const;

type PlaceholderImageProps = {
  ratio: keyof typeof ratios;
  label: string;
};

/**
 * Fixed-ratio grey box shown where a final image will go. Reserves space so
 * swapping in a real `next/image` later causes no layout shift.
 * @param props - Aspect ratio and an accessible label.
 * @returns A placeholder block.
 */
export function PlaceholderImage({ ratio, label }: PlaceholderImageProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`${ratios[ratio]} w-full rounded border border-line bg-surface-muted`}
    />
  );
}
