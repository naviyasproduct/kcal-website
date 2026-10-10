const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display lowercase tracking-[-0.02em] transition-transform duration-300 ease-bounce hover:scale-[1.04] active:scale-[0.96] disabled:pointer-events-none disabled:opacity-60";

const variants = {
  primary: "bg-accent text-brand",
  dark: "bg-brand text-cream",
  light: "bg-cream text-brand",
} as const;

const sizes = {
  md: "h-12 px-6 text-sm",
  lg: "h-16 px-8 text-lg",
} as const;

export type ButtonVariant = keyof typeof variants;

/**
 * Class names for a chunky pill button, or a link styled as one.
 * @param variant - Fill colour.
 * @param size - Height and padding.
 * @returns Tailwind class string.
 */
export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: keyof typeof sizes = "md",
): string {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}
