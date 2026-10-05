import { describe, expect, it } from "vitest";
import { parseEnv } from "./schema";

const valid = {
  NODE_ENV: "test",
  APP_URL: "http://localhost:3000",
  DATABASE_URL: "postgresql://user:pass@localhost:5432/kcal",
  AUTH_SECRET: "a".repeat(32),
  AI_PROVIDER: "example",
  AI_MODEL: "example-small",
  AI_API_KEY: "test-key",
};

describe("parseEnv", () => {
  it("accepts a complete, valid environment", () => {
    expect(parseEnv(valid).DATABASE_URL).toBe(valid.DATABASE_URL);
  });

  it("rejects a missing variable and names it", () => {
    expect(() => parseEnv({ ...valid, AUTH_SECRET: undefined })).toThrow(/AUTH_SECRET/);
  });

  it("rejects a short AUTH_SECRET", () => {
    expect(() => parseEnv({ ...valid, AUTH_SECRET: "short" })).toThrow(/AUTH_SECRET/);
  });

  it("rejects a non-PostgreSQL DATABASE_URL", () => {
    expect(() => parseEnv({ ...valid, DATABASE_URL: "mysql://x" })).toThrow(/DATABASE_URL/);
  });

  it("never includes secret values in the error", () => {
    expect.assertions(1);
    const secret = "leaky-secret-value";
    try {
      parseEnv({ ...valid, AUTH_SECRET: secret });
    } catch (error) {
      expect((error as Error).message).not.toContain(secret);
    }
  });
});
