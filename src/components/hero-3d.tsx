import { Suspense, lazy, useEffect, useRef } from "react";
import { JusticeScaleWatermark } from "@/components/landing-motion";
import { useOnScreen, useSceneCapable } from "@/components/three/scene-support";
import { cn } from "@/lib/utils";
import { registerGsapScroll } from "@/lib/motion";

// Code-split: the 3D bundle only downloads on the landing page, after hydration.
const JusticeScene = lazy(() => import("@/components/three/JusticeScene"));

/**
 * Decorative hero visual. Renders a lightweight SVG watermark first (and
 * permanently on reduced-motion / low-power devices), upgrading to the
 * interactive 3D scales when the device can take it.
 */
export function Hero3D({ className }: { className?: string }) {
  const capable = useSceneCapable();
  const { ref, onScreen } = useOnScreen<HTMLDivElement>();
  const progress = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!capable || !node) return;
    let cancelled = false;
    let cleanup = () => {};
    void (async () => {
      const { ScrollTrigger } = await registerGsapScroll();
      if (cancelled) return;
      const trigger = ScrollTrigger.create({
        trigger: node.closest("[data-cinematic-hero]"),
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
      cleanup = () => trigger.kill();
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [capable, ref]);

  return (
    <div ref={ref} className={cn("pointer-events-none", className)} aria-hidden>
      {capable ? (
        <Suspense fallback={<JusticeScaleWatermark className="h-full w-full" />}>
          <div className="pointer-events-auto h-full w-full">
            <JusticeScene active={onScreen} progress={progress} />
          </div>
        </Suspense>
      ) : (
        <JusticeScaleWatermark className="h-full w-full" />
      )}
    </div>
  );
}
