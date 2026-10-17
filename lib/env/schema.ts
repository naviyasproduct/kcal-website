import { z } from "zod";

/**
 * Server-side environment variables. Nothing secret may use the NEXT_PUBLIC_ prefix.
 *
 * Variables for features that are not built yet are optional, so the site can be
 * deployed before they exist, but are still checked whenever they are set. When a
 * feature ships, drop `.optional()` from its variables so startup fails fast again:
 * database and auth (build steps 2-3), chatbot (step 9).
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.url().optional(),
  DATABASE_URL: z
    .string()
    .regex(/^postgres(ql)?:\/\//, "must be a PostgreSQL connection string")
    .optional(),
  AUTH_SECRET: z.string().min(32, "must be at least 32 characters").optional(),
  AI_PROVIDER: z.string().min(1).optional(),
  AI_MODEL: z.string().min(1).optional(),
  AI_API_KEY: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables and throws if any are missing or invalid.
 * The error names the failing variables but never includes their values.
 * @param source - Usually `process.env`.
 * @returns The parsed, typed environment.
 */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment variables. ${problems}`);
  }
  return result.data;
}
