import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { useReducedMotionPref, registerGsapScroll } from "@/lib/motion";

export function LandingExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPref();
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    if (reduced) return undefined;
    const seen = window.sessionStorage.getItem("nyaysetu-intro-seen");
    if (!seen) {
      setIntro(true);
      window.sessionStorage.setItem("nyaysetu-intro-seen", "true");
      const timeout = window.setTimeout(() => setIntro(false), 920);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      const { gsap, ScrollTrigger } = await registerGsapScroll();
      if (cancelled) return;
      const lenis = new Lenis({ duration: 1.08, smoothWheel: true, wheelMultiplier: 0.9 });
      const raf = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((frame) => {
          const image = frame.querySelector("img");
          if (!image) return;
          gsap.fromTo(
            image,
            { yPercent: -5, scale: 1.08 },
            {
              yPercent: 5,
              scale: 1.02,
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.8 },
            },
          );
        });
      }, root);

      cleanup = () => {
        context.revert();
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced]);

  return (
    <div ref={root} className="landing-experience min-h-screen bg-background">
      {children}
      {intro && (
        <div className="intro-curtain" aria-hidden>
          <span />
        </div>
      )}
    </div>
  );
}

export function AudienceMarquee() {
  const text = "Citizens · Advocates · Judicial officers · Law enforcement · ";
  return (
    <div className="marquee border-y border-gold/35 bg-primary text-primary-foreground" aria-hidden>
      <div className="marquee-track">
        <span>{text.repeat(4)}</span>
        <span>{text.repeat(4)}</span>
      </div>
    </div>
  );
}