import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useOnScreen, r as useSceneCapable } from "./scene-support-B_1_89uG.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./nyaysetu-CQpKPlck.mjs";
import { I as BadgeCheck, M as Check, P as BookOpen, d as Scale, u as ScanLine, v as Highlighter, x as FileText, y as Gavel } from "../_libs/lucide-react.mjs";
import { r as Logo, t as AiNotice } from "./brand-Csrv-w1h.mjs";
import { t as Lenis } from "../_libs/lenis.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C2ZlkllF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Theme-aware scales of justice watermark for the landing hero. */
function JusticeScaleWatermark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: cn("justice-watermark", className),
		viewBox: "0 0 720 560",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "3",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		focusable: "false",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M360 64v398" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M318 500h84M280 526h160" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M360 64c-18 0-32 14-32 32s14 32 32 32 32-14 32-32-14-32-32-32Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M194 164h332M360 128v36" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M214 164 146 314M214 164l68 150" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M506 164 438 314M506 164l68 150" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "justice-pan justice-pan-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M112 314h204" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M112 314c8 48 47 76 102 76s94-28 102-76" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "justice-pan justice-pan-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M404 314h204" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M404 314c8 48 47 76 102 76s94-28 102-76" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M338 462h44" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "360",
				cy: "164",
				r: "7"
			})
		]
	});
}
/** Fires once when the element scrolls into view. */
function useInView(threshold = .35) {
	const ref = (0, import_react.useRef)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const node = ref.current;
		if (!node || visible) return;
		if (typeof IntersectionObserver === "undefined") {
			setVisible(true);
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				setVisible(true);
				observer.disconnect();
			}
		}, { threshold });
		observer.observe(node);
		return () => observer.disconnect();
	}, [threshold, visible]);
	return {
		ref,
		visible
	};
}
/** Loose sheets that settle into an aligned case file. Runs once on load. */
function PaperSettle({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("pointer-events-none relative", className),
		"aria-hidden": true,
		children: [[
			{
				sx: "-26px",
				sy: "-18px",
				sr: "-9deg",
				rr: "-2.5deg",
				delay: 0,
				inset: "top-6 left-4"
			},
			{
				sx: "22px",
				sy: "-10px",
				sr: "8deg",
				rr: "1.75deg",
				delay: 120,
				inset: "top-4 left-8"
			},
			{
				sx: "-14px",
				sy: "16px",
				sr: "5deg",
				rr: "-0.75deg",
				delay: 240,
				inset: "top-2 left-6"
			}
		].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("paper-sheet h-[78%] w-[62%] rounded-[2px]", s.inset),
			style: {
				"--sx": s.sx,
				"--sy": s.sy,
				"--sr": s.sr,
				"--rr": s.rr,
				animationDelay: `${s.delay}ms`
			}
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "paper-sheet top-0 left-6 h-[80%] w-[64%] rounded-[2px] border-primary/25 bg-card",
			style: {
				"--sx": "0px",
				"--sy": "28px",
				"--sr": "-3deg",
				animationDelay: "360ms"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full flex-col gap-2.5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-1/3 bg-primary/70" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px w-full bg-gold/60" }),
					[
						92,
						78,
						86,
						64,
						80,
						52
					].map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 bg-foreground/12",
						style: { width: `${w}%` }
					}, i))
				]
			})
		})]
	});
}
/** Draws an underline in on scroll — used for traceability claims. */
function TraceUnderline({ children }) {
	const { ref, visible } = useInView(.9);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		className: "relative inline-block whitespace-nowrap",
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			className: "trace-underline absolute -bottom-1 left-0 w-full",
			height: "6",
			viewBox: "0 0 200 6",
			preserveAspectRatio: "none",
			"data-visible": visible,
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M1 4 C 50 1, 150 6, 199 3",
				fill: "none",
				stroke: "var(--color-gold)",
				strokeWidth: "2",
				strokeLinecap: "round"
			})
		})]
	});
}
var PIPELINE = [
	{
		icon: ScanLine,
		title: "Upload and read",
		body: "PDFs and scans are read with OCR inside an encrypted vault."
	},
	{
		icon: Highlighter,
		title: "Analyse and classify",
		body: "Facts, parties, dates, category and urgency, each with its source."
	},
	{
		icon: Check,
		title: "Engage and track",
		body: "Matched advocates, secure messaging, hearings and cause lists."
	}
];
/** One connected pipeline: a document is scanned, marked up, then cleared. */
function DocumentPipeline() {
	const { ref, visible } = useInView(.3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "relative grid gap-10 md:grid-cols-3 md:gap-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-[68px] right-0 left-0 hidden h-px origin-left bg-gold/50 transition-transform duration-[1200ms] ease-out md:block",
				style: { transform: `scaleX(${visible ? 1 : 0})` },
				"aria-hidden": true
			}),
			PIPELINE.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "reveal relative md:px-8 md:first:pl-0 md:last:pr-0",
				"data-visible": visible,
				style: { transitionDelay: `${i * 180}ms` },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex h-[136px] w-[104px] flex-col gap-2 overflow-hidden border border-border bg-card p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-2/3 bg-primary/60" }),
							[
								88,
								70,
								82,
								58,
								76
							].map((w, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("h-1 transition-colors duration-500", i >= 1 && visible && (j === 1 || j === 3) ? "bg-gold" : "bg-foreground/12"),
								style: {
									width: `${w}%`,
									transitionDelay: `${600 + j * 90}ms`
								}
							}, j)),
							i === 0 && visible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute inset-x-0 h-px bg-gold",
								style: { animation: "ns-scan 1.8s ease-in-out infinite" },
								"aria-hidden": true
							}),
							i === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-2 bottom-2 grid size-7 place-items-center rounded-full bg-primary text-primary-foreground transition-all duration-500",
								style: {
									opacity: visible ? 1 : 0,
									transform: `scale(${visible ? 1 : .6})`,
									transitionDelay: "900ms"
								},
								"aria-hidden": true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "size-4",
									strokeWidth: 2
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(step.icon, {
							className: "size-4 text-gold",
							strokeWidth: 1.5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] text-muted-foreground",
							children: ["Step ", i + 1]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-xl text-foreground",
						children: step.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 max-w-xs text-[15px] leading-relaxed text-muted-foreground",
						children: step.body
					})
				]
			}, step.title)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
				className: "hidden",
				"aria-hidden": true
			})
		]
	});
}
/** Restrained magnetic hover: the element leans toward the cursor by a few pixels. */
function Magnetic({ children, className }) {
	const ref = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		ref,
		className: cn("inline-block will-change-transform", className),
		onMouseMove: (e) => {
			const el = ref.current;
			if (!el) return;
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
			const r = el.getBoundingClientRect();
			const x = ((e.clientX - r.left) / r.width - .5) * 8;
			const y = ((e.clientY - r.top) / r.height - .5) * 6;
			el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
			el.style.transition = "transform 80ms linear";
		},
		onMouseLeave: () => {
			const el = ref.current;
			if (!el) return;
			el.style.transition = "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)";
			el.style.transform = "translate(0px, 0px)";
		},
		children
	});
}
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
function useReducedMotionPref() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const onChange = (e) => setReduced(e.matches);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);
	return reduced;
}
/**
* Register GSAP + ScrollTrigger for scroll timelines.
* Call inside a component effect, then build timelines with
* `gsap.context(() => { ... }, ref)` so they clean up on unmount.
* Skip entirely when reduced motion is requested — render final state.
*/
async function registerGsapScroll() {
	const { gsap } = await import("../_libs/gsap.mjs").then((n) => n.t);
	const { ScrollTrigger } = await import("../_libs/gsap.mjs").then((n) => n.n);
	gsap.registerPlugin(ScrollTrigger);
	return {
		gsap,
		ScrollTrigger
	};
}
var JusticeScene = (0, import_react.lazy)(() => import("./JusticeScene-eBxHhhCu.mjs"));
/**
* Decorative hero visual. Renders a lightweight SVG watermark first (and
* permanently on reduced-motion / low-power devices), upgrading to the
* interactive 3D scales when the device can take it.
*/
function Hero3D({ className }) {
	const capable = useSceneCapable();
	const { ref, onScreen } = useOnScreen();
	const progress = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const node = ref.current;
		if (!capable || !node) return;
		let cancelled = false;
		let cleanup = () => {};
		(async () => {
			const { ScrollTrigger } = await registerGsapScroll();
			if (cancelled) return;
			const trigger = ScrollTrigger.create({
				trigger: node.closest("[data-cinematic-hero]"),
				start: "top top",
				end: "bottom top",
				scrub: true,
				onUpdate: (self) => {
					progress.current = self.progress;
				}
			});
			cleanup = () => trigger.kill();
		})();
		return () => {
			cancelled = true;
			cleanup();
		};
	}, [capable, ref]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("pointer-events-none", className),
		"aria-hidden": true,
		children: capable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JusticeScaleWatermark, { className: "h-full w-full" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto h-full w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JusticeScene, {
					active: onScreen,
					progress
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JusticeScaleWatermark, { className: "h-full w-full" })
	});
}
var StoryScene = (0, import_react.lazy)(() => import("./StoryScene-BxqHQwcQ.mjs"));
var STAGES = [
	{
		t: "Upload and read",
		d: "Every page is scanned and read, whether it is a typed order or a photographed notice."
	},
	{
		t: "Analyse and classify",
		d: "Facts, dates and parties are pulled out, the matter is categorised and urgency is assessed."
	},
	{
		t: "Engage and track",
		d: "The structured file reaches a verified advocate, and hearings are tracked from there."
	}
];
/**
* Scroll-scrubbed 3D telling of the intake pipeline. Pinned with GSAP
* ScrollTrigger; falls back to the CSS pipeline when 3D is unavailable.
*/
function Story3D() {
	const capable = useSceneCapable();
	const wrapper = (0, import_react.useRef)(null);
	const progress = (0, import_react.useRef)(0);
	const [stage, setStage] = (0, import_react.useState)(0);
	const { ref: viewRef, onScreen } = useOnScreen("200px");
	(0, import_react.useEffect)(() => {
		if (!capable || !wrapper.current) return;
		let cleanup = () => {};
		let cancelled = false;
		(async () => {
			const { gsap, ScrollTrigger } = await registerGsapScroll();
			if (cancelled || !wrapper.current) return;
			const trigger = ScrollTrigger.create({
				trigger: wrapper.current,
				start: "top top",
				end: "+=2200",
				pin: wrapper.current.querySelector(".story-pin"),
				pinSpacing: true,
				scrub: true,
				snap: {
					snapTo: [
						0,
						.5,
						1
					],
					duration: {
						min: .15,
						max: .4
					},
					delay: .08
				},
				onUpdate: (self) => {
					progress.current = self.progress;
					setStage(self.progress < .34 ? 0 : self.progress < .68 ? 1 : 2);
				}
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
	if (!capable) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentPipeline, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapper,
		className: "relative",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "story-pin relative flex h-screen w-full flex-col justify-end pb-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: viewRef,
				className: "pointer-events-none absolute inset-x-0 top-0 h-[62%]",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: null,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryScene, {
						progress,
						active: onScreen
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "relative z-10 grid w-full gap-6 sm:grid-cols-3",
				children: STAGES.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-t pt-4 transition-all duration-500 " + (stage === i ? "border-gold text-foreground opacity-100" : "border-border text-muted-foreground opacity-45"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[12px] text-gold",
							children: ["0", i + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-2xl text-foreground",
							children: s.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-xs text-[15px] leading-relaxed text-muted-foreground",
							children: s.d
						})
					]
				}, s.t))
			})]
		})
	});
}
function LandingExperience({ children }) {
	const root = (0, import_react.useRef)(null);
	const reduced = useReducedMotionPref();
	const [intro, setIntro] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (reduced) return void 0;
		if (!window.sessionStorage.getItem("nyaysetu-intro-seen")) {
			setIntro(true);
			window.sessionStorage.setItem("nyaysetu-intro-seen", "true");
			const timeout = window.setTimeout(() => setIntro(false), 920);
			return () => window.clearTimeout(timeout);
		}
	}, [reduced]);
	(0, import_react.useEffect)(() => {
		if (reduced) return;
		let cleanup = () => {};
		let cancelled = false;
		(async () => {
			const { gsap, ScrollTrigger } = await registerGsapScroll();
			if (cancelled) return;
			const lenis = new Lenis({
				duration: 1.08,
				smoothWheel: true,
				wheelMultiplier: .9
			});
			const raf = (time) => lenis.raf(time * 1e3);
			lenis.on("scroll", ScrollTrigger.update);
			gsap.ticker.add(raf);
			gsap.ticker.lagSmoothing(0);
			const context = gsap.context(() => {
				gsap.utils.toArray("[data-parallax]").forEach((frame) => {
					const image = frame.querySelector("img");
					if (!image) return;
					gsap.fromTo(image, {
						yPercent: -5,
						scale: 1.08
					}, {
						yPercent: 5,
						scale: 1.02,
						ease: "none",
						scrollTrigger: {
							trigger: frame,
							start: "top bottom",
							end: "bottom top",
							scrub: .8
						}
					});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: root,
		className: "landing-experience min-h-screen bg-background",
		children: [children, intro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "intro-curtain",
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
		})]
	});
}
function AudienceMarquee() {
	const text = "Citizens · Advocates · Judicial officers · Law enforcement · ";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "marquee border-y border-gold/35 bg-primary text-primary-foreground",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "marquee-track",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text.repeat(4) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text.repeat(4) })]
		})
	});
}
var hero_court_default = "/assets/hero-court-BgKYPuph.jpg";
var documents_default = "/assets/documents-D10EYKak.jpg";
var consultation_default = "/assets/consultation-iCLCFf3H.jpg";
var AUDIENCES = [
	{
		icon: Scale,
		title: "Citizens",
		body: "File a matter in plain words, understand it, and engage an advocate."
	},
	{
		icon: BookOpen,
		title: "Advocates",
		body: "Receive matters with structured facts, manage your practice and research."
	},
	{
		icon: Gavel,
		title: "Judicial officers",
		body: "Cause lists, docket overviews and neutral research support."
	},
	{
		icon: BadgeCheck,
		title: "Law enforcement",
		body: "Authorised status and hearing lookups, with every access logged."
	}
];
var FEATURES = [
	{
		t: "Role-aware by design",
		d: "Citizens, advocates, judicial officers and law enforcement each see only their own workspace, enforced in the database rather than the interface."
	},
	{
		t: "Traceable analysis",
		d: "Every extracted fact, date and insight names the document it came from, so nothing is taken on trust."
	},
	{
		t: "Indian legal vocabulary",
		d: "BNS and BNSS, CPC, the Consumer Protection Act 2019, Hindu Marriage Act, Negotiable Instruments Act and Motor Vehicles Act — with the courts and cause lists that go with them."
	},
	{
		t: "Audited access",
		d: "Record lookups by authorised officials are logged, and documents live in an access-controlled vault."
	}
];
function Landing() {
	const pipelineHead = useInView(.6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LandingExperience, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "landing-header border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-5 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "hidden border-b-2 border-transparent pb-0.5 text-[15px] text-foreground transition-colors hover:border-gold sm:inline-block",
						children: "Sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "seal-fill inline-flex items-center border border-primary bg-primary px-5 py-2.5 text-[15px] text-primary-foreground font-medium",
						children: "Get Started"
					}) })]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"data-cinematic-hero": true,
			className: "cinematic-hero paper-fiber relative isolate min-h-[calc(100svh-72px)] overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero3D, { className: "hero-scene-mask absolute inset-0 z-0 h-full w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl flex-col justify-center px-5 pt-16 pb-20 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-4xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 font-mono text-xs text-gold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Supreme Court & High Court Compliant" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mobile OTP Verified" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "hero-title relative z-10 font-display text-[3.25rem] leading-[0.98] text-foreground sm:text-7xl lg:text-[5.4rem]",
								children: "A calm, secure bridge between citizens and the courts of India."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "relative z-10 mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground",
								children: "ParthSarathi turns scattered papers into a structured case record — reading your documents, extracting the facts and dates, assessing urgency, and connecting you with verified advocates and reliable hearing information."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10 mt-9 flex flex-wrap justify-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/auth",
										className: "seal-fill inline-flex items-center border border-primary bg-primary px-7 py-3 text-primary-foreground font-medium shadow-md",
										children: "File a Matter (Citizen)"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/auth",
										className: "seal-fill inline-flex items-center border border-gold/50 bg-gold/10 px-7 py-3 text-foreground font-medium hover:bg-gold/20",
										children: "Advocate Access"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/auth",
										className: "seal-fill inline-flex items-center border border-border bg-card px-6 py-3 text-muted-foreground hover:text-foreground",
										children: "Judicial / Enforcement"
									}) })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-16 grid items-stretch gap-8 lg:grid-cols-[1.35fr_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
							"data-parallax": true,
							className: "photo-frame relative overflow-hidden border border-border bg-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: hero_court_default,
								alt: "Sandstone arcade and steps of an Indian high court at golden hour",
								width: 1600,
								height: 1104,
								className: "duotone-court h-full min-h-[320px] max-h-[420px] w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "court-duotone pointer-events-none absolute inset-0 mix-blend-color",
								"aria-hidden": true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-h-[300px] border border-border bg-surface",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperSettle, { className: "absolute inset-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "absolute right-5 bottom-5 left-5 text-[13px] leading-relaxed text-muted-foreground",
								children: "Loose papers, one structured case file."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 max-w-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiNotice, {})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-6xl px-5 py-14 sm:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0",
					children: AUDIENCES.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "role-reveal tilt-card relative overflow-hidden border-t border-gold/50 pt-5 lg:min-h-[220px] lg:border-t-0 lg:border-l lg:px-7 lg:pt-0 " + (i === 0 ? "lg:border-l-0 lg:pl-0" : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "role-reveal-mark",
							"aria-hidden": true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(a.icon, { strokeWidth: .8 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(a.icon, {
									className: "tilt-icon size-5 text-gold",
									strokeWidth: 1.4
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-display text-2xl text-foreground",
									children: a.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-[15px] leading-relaxed text-muted-foreground",
									children: a.body
								})
							]
						})]
					}, a.title))
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudienceMarquee, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "storytelling-band section-curve relative bg-primary py-28 text-primary-foreground lg:py-36",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-5 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						ref: pipelineHead.ref,
						className: "max-w-3xl font-display text-5xl leading-none text-foreground sm:text-6xl",
						children: "From papers to a clear case record"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 max-w-2xl text-[17px] leading-relaxed text-muted-foreground",
						children: [
							"One continuous pass: the file is read, marked up and then handed on — ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraceUnderline, { children: "each with its source" }),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-14",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Story3D, {})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border bg-surface py-28 lg:py-36",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						"data-parallax": true,
						className: "photo-frame overflow-hidden border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: documents_default,
							alt: "A tied bundle of court papers being placed on a document scanner",
							width: 1200,
							height: 900,
							loading: "lazy",
							className: "h-64 w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "border-t border-border bg-card px-4 py-3 text-[14px] text-muted-foreground",
							children: "Every uploaded page is read, indexed and kept traceable to the insight it supports."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						"data-parallax": true,
						className: "photo-frame overflow-hidden border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: consultation_default,
							alt: "An advocate in robes consulting with a client across a wooden desk",
							width: 1200,
							height: 900,
							loading: "lazy",
							className: "h-64 w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "border-t border-border bg-card px-4 py-3 text-[14px] text-muted-foreground",
							children: "Matters reach advocates already structured, so the first consultation begins with substance."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "binding-rule self-center pl-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-5xl leading-none text-foreground",
						children: "Built for the way Indian courts actually work"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 space-y-7",
						children: FEATURES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl text-foreground",
							children: item.t
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[15px] leading-relaxed text-muted-foreground",
							children: item.d
						})] }, item.t))
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-primary text-primary-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl px-5 py-24 text-center sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-4xl",
						children: "Start with a single document"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-primary-foreground/75",
						children: "Describe your situation in your own words and upload whatever papers you hold. ParthSarathi will do the reading, the structuring and the introductions."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-9",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "inline-flex items-center bg-seal px-8 py-3.5 text-seal-foreground transition-colors hover:bg-seal/90",
							children: "Get started"
						}) })
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
			className: "border-t border-gold/50 py-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-[13px] text-muted-foreground sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ParthSarathi — पार्थसारथी" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "AI outputs are assistive and never a substitute for an advocate or a court order." })]
			})
		})
	] });
}
//#endregion
export { Landing as component };
