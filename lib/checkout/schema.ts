import { z } from "zod";

/**
 * First allowed start date (tomorrow, Sri Lanka time) as `YYYY-MM-DD`.
 * @param now - Current time.
 * @returns The date string.
 */
export function earliestStartDate(now = new Date()): string {
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(tomorrow);
}

/**
 * Checkout form schema. Prices are never part of it: totals come from the server.
 * @param minDate - Earliest start date, `YYYY-MM-DD`.
 * @returns The Zod schema.
 */
export function checkoutSchema(minDate: string) {
  return z
    .object({
      planId: z.string().min(1),
      name: z.string().trim().min(2, "Enter your name").max(80),
      phone: z
        .string()
        .trim()
        .regex(/^(?:\+94|0)7\d{8}$/, "Use a mobile number like 0771234567"),
      locationId: z.enum(["sliit", "address"], { error: "Pick where to deliver" }),
      addressLine: z.string().trim().max(200),
      startDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a start date")
        .refine((d) => d >= minDate, "Pick tomorrow or later"),
    })
    .refine((v) => v.locationId !== "address" || v.addressLine.length >= 5, {
      path: ["addressLine"],
      message: "Enter your delivery address",
    });
}

export type CheckoutInput = z.infer<ReturnType<typeof checkoutSchema>>;
