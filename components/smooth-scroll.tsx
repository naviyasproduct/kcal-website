"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Eased, slightly trailing page scroll for wheel and trackpad. Touch keeps the
 * device's own scrolling, and people who prefer reduced motion get plain scroll.
 * @returns Nothing visible.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Lower lerp trails further behind the wheel; 0.1 is Lenis's default.
    const lenis = new Lenis({ lerp: 0.075, autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
