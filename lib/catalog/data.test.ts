import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { meals } from "./data";

describe("meals", () => {
  it.each(meals)("$slug calories agree with its macros", (m) => {
    const fromMacros = m.proteinG * 4 + m.carbsG * 4 + m.fatG * 9;
    expect(Math.abs(m.calories - fromMacros)).toBeLessThanOrEqual(10);
  });

  it.each(meals)("$slug image exists", (m) => {
    expect(existsSync(join(process.cwd(), "public", m.imageUrl))).toBe(true);
  });

  it("has unique slugs", () => {
    expect(new Set(meals.map((m) => m.slug)).size).toBe(meals.length);
  });
});
