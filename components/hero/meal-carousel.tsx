"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Arrow } from "../brand";
import { buttonStyles } from "../button";

export type HeroSlide = {
  image: StaticImageData;
  alt: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  /** Where "order now" goes. */
  href: string;
};

/** Time each meal stays in the centre, in ms. */
const INTERVAL = 4500;
/** Higher settles faster; ~4.5 takes about half a second. */
const STIFFNESS = 4.5;

/** Repeats the slides so there is always one on each side of the centre and one coming in. */
function loop(slides: HeroSlide[]): HeroSlide[] {
  const times = Math.max(1, Math.ceil(5 / slides.length));
  return Array.from({ length: times }, () => slides).flat();
}

/**
 * Hero slideshow: the centre meal is sharp, its neighbours sit to the sides
 * smaller and blurred, and the centre meal's nutrition and order button sit under
 * it. Slides advance right to left on a timer and follow a drag.
 * @param props - The meals, in order.
 * @returns The carousel, filling its positioned parent.
 */
export function MealCarousel({ slides }: { slides: HeroSlide[] }) {
  const items = useMemo(() => loop(slides), [slides]);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nudgeRef = useRef<(step: number) => void>(() => {});
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const count = items.length;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let position = 0;
    let target = 0;
    let spacing = 1;
    let frame = 0;
    let last = 0;
    let timer = 0;
    let paused = false;
    let drag: { id: number; x: number; from: number; vx: number; t: number } | null = null;

    const layout = () => {
      const { width, height } = stage.getBoundingClientRect();
      const narrow = width < 640;
      spacing = width * (narrow ? 0.66 : 0.42);
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const ratio = items[i].image.width / items[i].image.height;
        const w = Math.min(width * (narrow ? 0.98 : 0.64), height * ratio);
        el.style.width = `${w}px`;
      });
    };

    const render = () => {
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        let d = (i - position) % count;
        if (d > count / 2) d -= count;
        if (d < -count / 2) d += count;
        const a = Math.abs(d);
        const near = Math.min(a, 1);
        const far = Math.max(a - 1, 0);
        const x = Math.sign(d) * (near + far * 0.6) * spacing;
        const scale = 1 - 0.38 * near - 0.1 * far;
        el.style.transform = `translateX(${x}px) scale(${scale})`;
        // Fully opaque on screen; only fades past the edges where the loop wraps round.
        el.style.opacity = String(Math.min(Math.max(3 - a, 0), 1));
        el.style.zIndex = String(100 - Math.round(a * 10));
        el.style.setProperty("--sharp", String(1 - near));
        el.style.setProperty("--soft", String(Math.min(a * 3, 1)));
      });
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 50) / 1000 : 0;
      last = now;
      if (!drag) position += (target - position) * (1 - Math.exp(-STIFFNESS * dt));
      render();
      if (drag || Math.abs(target - position) > 0.0005) {
        frame = requestAnimationFrame(tick);
      } else {
        position = target;
        render();
        frame = 0;
      }
    };
    const animate = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const go = (next: number) => {
      target = next;
      setCurrent(((Math.round(next) % count) + count) % count);
      animate();
    };
    const schedule = () => {
      window.clearTimeout(timer);
      if (reduceMotion || paused || document.hidden) return;
      timer = window.setTimeout(() => {
        go(Math.round(target) + 1);
        schedule();
      }, INTERVAL);
    };
    nudgeRef.current = (step) => {
      go(Math.round(target) + step);
      schedule();
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || drag) return;
      stage.setPointerCapture(e.pointerId);
      drag = { id: e.pointerId, x: e.clientX, from: position, vx: 0, t: e.timeStamp };
      window.clearTimeout(timer);
      stage.dataset.dragging = "";
      animate();
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dt = Math.max(e.timeStamp - drag.t, 1) / 1000;
      const next = drag.from - (e.clientX - drag.x) / spacing;
      drag.vx = 0.7 * ((next - position) / dt) + 0.3 * drag.vx;
      drag.t = e.timeStamp;
      position = next;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      // Fling: project where the slide would coast to, then settle on the nearest one.
      const moved = position + drag.vx * 0.18 - drag.from;
      const snap = Math.round(drag.from) + (Math.abs(moved) < 0.2 ? 0 : Math.sign(moved));
      drag = null;
      delete stage.dataset.dragging;
      go(snap);
      schedule();
    };

    const pause = () => {
      paused = true;
      window.clearTimeout(timer);
    };
    const onFocus = () => {
      if (root.querySelector(":focus-visible")) pause();
    };
    const resume = () => {
      paused = false;
      schedule();
    };
    const onVisibility = () => (document.hidden ? window.clearTimeout(timer) : schedule());

    const resizeObserver = new ResizeObserver(() => {
      layout();
      render();
    });
    resizeObserver.observe(stage);

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);
    root.addEventListener("focusin", onFocus);
    root.addEventListener("focusout", resume);
    document.addEventListener("visibilitychange", onVisibility);

    layout();
    render();
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      resizeObserver.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      root.removeEventListener("mouseenter", pause);
      root.removeEventListener("mouseleave", resume);
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("focusout", resume);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [items]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") nudgeRef.current(1);
    if (e.key === "ArrowLeft") nudgeRef.current(-1);
  };

  const shown = items[current];
  const facts = [
    { label: "protein", value: `${shown.proteinG}g` },
    { label: "carbs", value: `${shown.carbsG}g` },
    { label: "fat", value: `${shown.fatG}g` },
  ];

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="our meals"
      className="absolute inset-0 flex flex-col"
    >
      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="use the arrow keys to browse meals"
        className="relative flex-1 cursor-grab touch-pan-y select-none data-dragging:cursor-grabbing"
      >
        {items.map((slide, i) => (
          <div
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            aria-hidden={i !== current}
            className="absolute bottom-0 left-1/2 w-[46%] -translate-x-1/2 will-change-transform"
            style={i === 0 ? undefined : { opacity: 0 }}
          >
            <Image
              src={slide.image}
              alt=""
              draggable={false}
              loading="eager"
              sizes="(min-width: 640px) 46vw, 90vw"
              className="absolute inset-0 size-full opacity-[var(--soft,0)] blur-md"
            />
            <Image
              src={slide.image}
              alt={slide.alt}
              draggable={false}
              preload={i === 0}
              loading={i === 0 ? undefined : "eager"}
              sizes="(min-width: 640px) 46vw, 90vw"
              className="relative h-auto w-full opacity-[var(--sharp,1)]"
            />
          </div>
        ))}
      </div>
      <div className="relative z-10 flex shrink-0 justify-center px-4 pt-3 pb-2">
        <div
          key={current}
          className="flex animate-rise flex-col items-center gap-4 text-cream sm:flex-row sm:gap-8"
        >
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p className="font-display text-lg leading-tight tracking-[-0.02em] lowercase sm:text-xl">
              {shown.name}
            </p>
            <dl className="flex items-end gap-5">
              <div className="flex flex-col-reverse">
                <dt className="text-xs text-cream/70">calories</dt>
                <dd className="font-display text-2xl leading-none text-accent">
                  {shown.calories}
                  <span className="ml-1 font-sans text-xs font-bold">kcal</span>
                </dd>
              </div>
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="text-xs text-cream/70">{f.label}</dt>
                  <dd className="font-display text-lg leading-tight">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Link href={shown.href} className={buttonStyles("primary")}>
            order now <Arrow className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
