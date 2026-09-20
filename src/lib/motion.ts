import { useEffect, useState } from "react";
import type { Variants } from "framer-motion";

/**
 * Shared motion utilities for ParthSarathi.
 *
 * Rules of the road:
 * - Framer Motion is the default for component-level animation
 *   (fades, slides, hovers, staggers, layout animations).
 * - GSAP + ScrollTrigger is reserved for coordinated, scrubbed,
 *   multi-element scroll timelines (e.g. the pipeline sequence).
 * - Never run both on the same element.
 * - Everything respects prefers-reduced-motion: use `useReducedMotionPref()`
 *   or the `rise`/`stagger` presets below, which collapse to opacity-only
 *   when reduced motion is requested.
 * - Animate transform/opacity only — never layout-triggering properties.
 */

/** True when the user has requested reduced motion. SSR-safe. */
export function useReducedMotionPref(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade-and-rise entrance. Under reduced motion: opacity only. */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (reduced: boolean = false) => ({
    opacity: 1,
    y: reduced ? 0 : 0,
    transition: { duration: reduced ? 0.2 : 0.55, ease: EASE },
  }),
};

/** Parent that staggers children using `riseVariants`. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: (reduced: boolean = false) => ({
    transition: { staggerChildren: reduced ? 0.03 : 0.12, delayChildren: 0.05 },
  }),
};

/** Scroll-triggered reveal props for a motion element. */
export function scrollReveal(reduced: boolean) {
  return {
    variants: riseVariants,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, margin: "-15% 0px" },
    custom: reduced,
  };
}

/** Restrained hover/tap feedback for interactive elements. */
export const pressFeedback = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
} as const;

/**
 * Register GSAP + ScrollTrigger for scroll timelines.
 * Call inside a component effect, then build timelines with
 * `gsap.context(() => { ... }, ref)` so they clean up on unmount.
 * Skip entirely when reduced motion is requested — render final state.
 */
export async function registerGsapScroll() {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
