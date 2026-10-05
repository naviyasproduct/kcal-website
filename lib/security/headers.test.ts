import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy, securityHeaders } from "./headers";

describe("buildContentSecurityPolicy", () => {
  it("blocks framing, plugins and foreign origins in production", () => {
    const csp = buildContentSecurityPolicy(false);
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
    expect(csp).not.toContain("unsafe-eval");
  });

  it("allows eval only in development", () => {
    expect(buildContentSecurityPolicy(true)).toContain("'unsafe-eval'");
  });
});

describe("securityHeaders", () => {
  it("includes every required header", () => {
    const keys = securityHeaders(false).map((h) => h.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        "Content-Security-Policy",
        "Strict-Transport-Security",
        "X-Content-Type-Options",
        "Referrer-Policy",
        "X-Frame-Options",
      ]),
    );
  });
});
