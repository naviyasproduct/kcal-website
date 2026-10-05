import { z } from "zod";

/** Server-side environment variables. Nothing secret may use the NEXT_PUBLIC_ prefix. */
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.url(),
  DATABASE_URL: z.string().regex(/^postgres(ql)?:\/\//, "must be a PostgreSQL connection string"),
  AUTH_SECRET: z.string().min(32, "must be at least 32 characters"),
  AI_PROVIDER: z.string().min(1),
  AI_MODEL: z.string().min(1),
  AI_API_KEY: z.string().min(1),
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
