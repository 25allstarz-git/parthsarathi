import { useEffect, useRef, useState } from "react";

/** Shared palette for every 3D element, matched to the courthouse tokens. */
export const PALETTE = {
  navy: "#1F3A5F",
  navyDeep: "#16293F",
  brass: "#B08D48",
  brassLight: "#D8BE86",
  maroon: "#7A2B2B",
  stone: "#F6F3EC",
  stoneDim: "#E4DCC9",
} as const;

/**
 * True when the device can reasonably run a WebGL scene and the user has not
 * asked for reduced motion. SSR-safe: starts false, so the 2D fallback renders
 * first and 3D is opted into after hydration.
 */
export function useSceneCapable(): boolean {
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let ok = false;
    try {
      const canvas = document.createElement("canvas");
      ok = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      ok = false;
    }
    setCapable(ok);
  }, []);

  return capable;
}

/** Tracks whether an element is on screen, for pausing the render loop. */
export function useOnScreen<T extends HTMLElement>(rootMargin = "120px") {
  const ref = useRef<T | null>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, onScreen };
}
