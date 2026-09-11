import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { DocumentPipeline } from "@/components/landing-motion";
import { useOnScreen, useSceneCapable } from "@/components/three/scene-support";
import { registerGsapScroll } from "@/lib/motion";

const StoryScene = lazy(() => import("@/components/three/StoryScene"));

const STAGES = [
  { t: "Upload and read", d: "Every page is scanned and read, whether it is a typed order or a photographed notice." },
  { t: "Analyse and classify", d: "Facts, dates and parties are pulled out, the matter is categorised and urgency is assessed." },
  { t: "Engage and track", d: "The structured file reaches a verified advocate, and hearings are tracked from there." },
];

/**
 * Scroll-scrubbed 3D telling of the intake pipeline. Pinned with GSAP
 * ScrollTrigger; falls back to the CSS pipeline when 3D is unavailable.
 */
export function Story3D() {
  const capable = useSceneCapable();
  const wrapper = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const { ref: viewRef, onScreen } = useOnScreen<HTMLDivElement>("200px");

  useEffect(() => {
    if (!capable || !wrapper.current) return;
    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      const { gsap, ScrollTrigger } = await registerGsapScroll();
      if (cancelled || !wrapper.current) return;
      const trigger = ScrollTrigger.create({
        trigger: wrapper.current,
        start: "top top",
        end: "+=2200",
        pin: wrapper.current.querySelector(".story-pin") as HTMLElement,
        pinSpacing: true,
        scrub: true,
        snap: { snapTo: [0, 0.5, 1], duration: { min: 0.15, max: 0.4 }, delay: 0.08 },
        onUpdate: (self) => {
          progress.current = self.progress;
          setStage(self.progress < 0.34 ? 0 : self.progress < 0.68 ? 1 : 2);
        },
      });
      cleanup = () => {
        trigger.kill();
        gsap.killTweensOf(wrapper.current);
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [capable]);

  if (!capable) return <DocumentPipeline />;

  return (
    <div ref={wrapper} className="relative">
      <div className="story-pin relative flex h-screen w-full flex-col justify-end pb-16">
        <div ref={viewRef} className="pointer-events-none absolute inset-x-0 top-0 h-[62%]" aria-hidden>
          <Suspense fallback={null}>
            <StoryScene progress={progress} active={onScreen} />
          </Suspense>
        </div>
        <ol className="relative z-10 grid w-full gap-6 sm:grid-cols-3">
          {STAGES.map((s, i) => (
            <li
              key={s.t}
              className={
                "border-t pt-4 transition-all duration-500 " +
                (stage === i
                  ? "border-gold text-foreground opacity-100"
                  : "border-border text-muted-foreground opacity-45")
              }
            >
              <p className="font-mono text-[12px] text-gold">0{i + 1}</p>
              <p className="mt-2 font-display text-2xl text-foreground">{s.t}</p>
              <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
