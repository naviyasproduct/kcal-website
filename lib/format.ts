/**
 * Formats integer LKR cents for display, e.g. `Rs 12,000`.
 * @param cents - Amount in cents.
 * @returns The display string.
 */
export function formatLkr(cents: number): string {
  return `Rs ${Math.round(cents / 100).toLocaleString("en-LK")}`;
}
