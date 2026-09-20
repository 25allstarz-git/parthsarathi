import { useEffect, useRef, useState, type ReactNode } from "react";
import { FileText, ScanLine, Highlighter, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Theme-aware scales of justice watermark for the landing hero. */
export function JusticeScaleWatermark({ className }: { className?: string }) {
  return (
    <svg
      className={cn("justice-watermark", className)}
      viewBox="0 0 720 560"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M360 64v398" />
      <path d="M318 500h84M280 526h160" />
      <path d="M360 64c-18 0-32 14-32 32s14 32 32 32 32-14 32-32-14-32-32-32Z" />
      <path d="M194 164h332M360 128v36" />
      <path d="M214 164 146 314M214 164l68 150" />
      <path d="M506 164 438 314M506 164l68 150" />
      <g className="justice-pan justice-pan-left">
        <path d="M112 314h204" />
        <path d="M112 314c8 48 47 76 102 76s94-28 102-76" />
      </g>
      <g className="justice-pan justice-pan-right">
        <path d="M404 314h204" />
        <path d="M404 314c8 48 47 76 102 76s94-28 102-76" />
      </g>
      <path d="M338 462h44" />
      <circle cx="360" cy="164" r="7" />
    </svg>
  );
}

/** Fires once when the element scrolls into view. */
export function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, visible]);

  return { ref, visible };
}

/** Loose sheets that settle into an aligned case file. Runs once on load. */
export function PaperSettle({ className }: { className?: string }) {
  const sheets = [
    { sx: "-26px", sy: "-18px", sr: "-9deg", rr: "-2.5deg", delay: 0, inset: "top-6 left-4" },
    { sx: "22px", sy: "-10px", sr: "8deg", rr: "1.75deg", delay: 120, inset: "top-4 left-8" },
    { sx: "-14px", sy: "16px", sr: "5deg", rr: "-0.75deg", delay: 240, inset: "top-2 left-6" },
  ];

  return (
    <div className={cn("pointer-events-none relative", className)} aria-hidden>
      {sheets.map((s, i) => (
        <div
          key={i}
          className={cn("paper-sheet h-[78%] w-[62%] rounded-[2px]", s.inset)}
          style={
            {
              "--sx": s.sx,
              "--sy": s.sy,
              "--sr": s.sr,
              "--rr": s.rr,
              animationDelay: `${s.delay}ms`,
            } as React.CSSProperties
          }
        />
      ))}
      <div
        className="paper-sheet top-0 left-6 h-[80%] w-[64%] rounded-[2px] border-primary/25 bg-card"
        style={{ "--sx": "0px", "--sy": "28px", "--sr": "-3deg", animationDelay: "360ms" } as React.CSSProperties}
      >
        <div className="flex h-full flex-col gap-2.5 p-5">
          <div className="h-2 w-1/3 bg-primary/70" />
          <div className="h-px w-full bg-gold/60" />
          {[92, 78, 86, 64, 80, 52].map((w, i) => (
            <div key={i} className="h-1.5 bg-foreground/12" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Draws an underline in on scroll — used for traceability claims. */
export function TraceUnderline({ children }: { children: ReactNode }) {
  const { ref, visible } = useInView<HTMLSpanElement>(0.9);
  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        className="trace-underline absolute -bottom-1 left-0 w-full"
        height="6"
        viewBox="0 0 200 6"
        preserveAspectRatio="none"
        data-visible={visible}
        aria-hidden
      >
        <path
          d="M1 4 C 50 1, 150 6, 199 3"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

const PIPELINE = [
  {
    icon: ScanLine,
    title: "Upload and read",
    body: "PDFs and scans are read with OCR inside an encrypted vault.",
  },
  {
    icon: Highlighter,
    title: "Analyse and classify",
    body: "Facts, parties, dates, category and urgency, each with its source.",
  },
  {
    icon: Check,
    title: "Engage and track",
    body: "Matched advocates, secure messaging, hearings and cause lists.",
  },
];

/** One connected pipeline: a document is scanned, marked up, then cleared. */
export function DocumentPipeline() {
  const { ref, visible } = useInView<HTMLDivElement>(0.3);

  return (
    <div ref={ref} className="relative grid gap-10 md:grid-cols-3 md:gap-0">
      <div
        className="absolute top-[68px] right-0 left-0 hidden h-px origin-left bg-gold/50 transition-transform duration-[1200ms] ease-out md:block"
        style={{ transform: `scaleX(${visible ? 1 : 0})` }}
        aria-hidden
      />
      {PIPELINE.map((step, i) => (
        <div
          key={step.title}
          className="reveal relative md:px-8 md:first:pl-0 md:last:pr-0"
          data-visible={visible}
          style={{ transitionDelay: `${i * 180}ms` }}
        >
          <div className="relative z-10 flex h-[136px] w-[104px] flex-col gap-2 overflow-hidden border border-border bg-card p-3">
            <div className="h-1.5 w-2/3 bg-primary/60" />
            {[88, 70, 82, 58, 76].map((w, j) => (
              <div
                key={j}
                className={cn(
                  "h-1 transition-colors duration-500",
                  i >= 1 && visible && (j === 1 || j === 3) ? "bg-gold" : "bg-foreground/12",
                )}
                style={{ width: `${w}%`, transitionDelay: `${600 + j * 90}ms` }}
              />
            ))}
            {i === 0 && visible && (
              <span
                className="pointer-events-none absolute inset-x-0 h-px bg-gold"
                style={{ animation: "ns-scan 1.8s ease-in-out infinite" }}
                aria-hidden
              />
            )}

            {i === 2 && (
              <span
                className="absolute right-2 bottom-2 grid size-7 place-items-center rounded-full bg-primary text-primary-foreground transition-all duration-500"
                style={{ opacity: visible ? 1 : 0, transform: `scale(${visible ? 1 : 0.6})`, transitionDelay: "900ms" }}
                aria-hidden
              >
                <Check className="size-4" strokeWidth={2} />
              </span>
            )}
          </div>
          <div className="mt-6 flex items-center gap-2">
            <step.icon className="size-4 text-gold" strokeWidth={1.5} />
            <p className="font-mono text-[11px] text-muted-foreground">Step {i + 1}</p>
          </div>
          <p className="mt-2 font-display text-xl text-foreground">{step.title}</p>
          <p className="mt-1.5 max-w-xs text-[15px] leading-relaxed text-muted-foreground">{step.body}</p>
        </div>
      ))}
      <FileText className="hidden" aria-hidden />
    </div>
  );
}

/** Restrained magnetic hover: the element leans toward the cursor by a few pixels. */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
        el.style.transition = "transform 80ms linear";
      }}
      onMouseLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.transition = "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "translate(0px, 0px)";
      }}
    >
      {children}
    </span>
  );
}
