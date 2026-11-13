import { NextResponse, type NextRequest } from "next/server";

/**
 * Pre-launch gate. Until SITE_LAUNCHED=true is set, every URL (pages, public
 * images, image optimisation) serves the coming-soon page, so nothing about the
 * product is reachable. Built JS/CSS under /_next/static stays reachable so the
 * coming-soon page can load; those files have unguessable hashed names.
 *
 * To launch: set SITE_LAUNCHED=true in the host's environment and redeploy.
 * Locally, add SITE_LAUNCHED=true to .env to work on the real site.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.SITE_LAUNCHED === "true") {
    return pathname === "/coming-soon"
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  if (pathname === "/coming-soon" || pathname === "/images/hero/pattern-tile.svg") {
    return NextResponse.next();
  }
  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  // Everything except built assets and the favicon.
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
