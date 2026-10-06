const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-action text-action-ink hover:bg-action-hover",
  secondary: "bg-card text-ink ring-1 ring-line hover:bg-surface-muted",
  accent: "bg-accent text-brand hover:bg-accent-soft",
} as const;

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
} as const;

/**
 * Class names for a button or a link styled as one.
 * @param variant - Visual style.
 * @param size - Height and padding.
 * @returns Tailwind class string.
 */
export function buttonStyles(
  variant: keyof typeof variants = "primary",
  size: keyof typeof sizes = "md",
): string {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}
