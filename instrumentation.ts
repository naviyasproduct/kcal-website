import { parseEnv } from "@/lib/env/schema";

/**
 * Runs once when the server starts. Validates env and exits on failure, so a bad
 * config stops the server instead of surfacing on the first request that needs it.
 */
export function register(): void {
  try {
    parseEnv(process.env);
  } catch (error) {
    console.error((error as Error).message);
    if (process.env.NEXT_RUNTIME === "nodejs") process.exit(1);
    throw error;
  }
}
