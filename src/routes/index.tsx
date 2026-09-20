import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BadgeCheck, BookOpen, Gavel, Scale } from "lucide-react";
import { toast } from "sonner";
import { AiNotice, Logo } from "@/components/brand";
import { Hero3D } from "@/components/hero-3d";
import { Story3D } from "@/components/story-3d";
import { AudienceMarquee, LandingExperience } from "@/components/landing-experience";
import {
  Magnetic,
  PaperSettle,
  TraceUnderline,
  useInView,
} from "@/components/landing-motion";
import { supabase } from "@/integrations/supabase/client";
import heroCourt from "@/assets/hero-court.jpg";
import documentsImage from "@/assets/documents.jpg";
import consultationImage from "@/assets/consultation.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ParthSarathi — AI-assisted access to Indian courts" },
      {
        name: "description",
        content:
          "File a matter, understand your documents, find verified advocates and track hearings. A role-aware platform for citizens, advocates, judges and law enforcement.",
      },
      { property: "og:title", content: "ParthSarathi — AI-assisted access to Indian courts" },
      {
        property: "og:description",
        content: "Case intake, document analysis, advocate discovery and cause lists in one secure platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const AUDIENCES = [
  { icon: Scale, title: "Citizens", body: "File a matter in plain words, understand it, and engage an advocate." },
  { icon: BookOpen, title: "Advocates", body: "Receive matters with structured facts, manage your practice and research." },
  { icon: Gavel, title: "Judicial officers", body: "Cause lists, docket overviews and neutral research support." },
  { icon: BadgeCheck, title: "Law enforcement", body: "Authorised status and hearing lookups, with every access logged." },
];

const FEATURES = [
  {
    t: "Role-aware by design",
    d: "Citizens, advocates, judicial officers and law enforcement each see only their own workspace, enforced in the database rather than the interface.",
  },
  {
    t: "Traceable analysis",
    d: "Every extracted fact, date and insight names the document it came from, so nothing is taken on trust.",
  },
  {
    t: "Indian legal vocabulary",
    d: "BNS and BNSS, CPC, the Consumer Protection Act 2019, Hindu Marriage Act, Negotiable Instruments Act and Motor Vehicles Act — with the courts and cause lists that go with them.",
  },
  {
    t: "Audited access",
    d: "Record lookups by authorised officials are logged, and documents live in an access-controlled vault.",
  },
];

function Landing() {
  const navigate = useNavigate();
  const pipelineHead = useInView<HTMLHeadingElement>(0.6);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("parthsarathi_demo_citizen") === "true") {
      setSession({ user: { email: "demo.citizen@gmail.com" } });
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, sess) => {
      if (sess) setSession(sess);
      if (event === "SIGNED_IN") {
        toast.success("Signed in successfully!");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleBypassCitizen = () => {
    localStorage.removeItem("parthsarathi_demo_lawyer");
    localStorage.setItem("parthsarathi_demo_citizen", "true");
    setSession({ user: { email: "demo.citizen@gmail.com" }, role: "citizen" });
    toast.success("Login bypassed! Welcome, Demo Citizen.");
    navigate({ to: "/citizen" });
  };

  const handleBypassLawyer = () => {
    localStorage.removeItem("parthsarathi_demo_citizen");
    localStorage.setItem("parthsarathi_demo_lawyer", "true");
    setSession({ user: { email: "advocate.rajesh@parthsarathi.in" }, role: "lawyer" });
    toast.success("Login bypassed! Welcome, Advocate.");
    navigate({ to: "/lawyer" });
  };

  return (
    <LandingExperience>
      <header className="landing-header border-b border-border">
        <nav className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <button
                  type="button"
                  onClick={async () => {
                    localStorage.removeItem("parthsarathi_demo_citizen");
                    localStorage.removeItem("parthsarathi_demo_lawyer");
                    setSession(null);
                    await supabase.auth.signOut();
                    toast.info("Signed out");
                  }}
                  className="hidden border-b-2 border-transparent pb-0.5 text-[15px] text-foreground transition-colors hover:border-gold sm:inline-block"
                >
                  Sign out
                </button>
                <Magnetic>
                  <Link
                    to={typeof window !== "undefined" && localStorage.getItem("parthsarathi_demo_lawyer") === "true" ? "/lawyer" : "/citizen"}
                    className="seal-fill inline-flex items-center border border-primary bg-primary px-5 py-2.5 text-[15px] text-primary-foreground font-medium"
                  >
                    Go to Portal
                  </Link>
                </Magnetic>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleBypassCitizen}
                  className="inline-flex items-center gap-1 rounded bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/25 transition-colors"
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={handleBypassLawyer}
                  className="inline-flex items-center gap-1 rounded border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-gold transition-colors"
                >
                  Judge
                </button>
                <Link
                  to="/auth"
                  className="hidden border-b-2 border-transparent pb-0.5 text-[15px] text-foreground transition-colors hover:border-gold sm:inline-block"
                >
                  Sign in
                </Link>
                <Magnetic>
                  <Link
                    to="/auth"
                    className="seal-fill inline-flex items-center border border-primary bg-primary px-5 py-2.5 text-[15px] text-primary-foreground font-medium"
                  >
                    Get Started
                  </Link>
                </Magnetic>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section data-cinematic-hero className="cinematic-hero paper-fiber relative isolate min-h-[calc(100svh-72px)] overflow-hidden">
        <Hero3D className="hero-scene-mask absolute inset-0 z-0 h-full w-full" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl flex-col justify-center px-5 pt-16 pb-20 sm:px-8">
         <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 font-mono text-xs text-gold">
            <span>Supreme Court & High Court Compliant</span>
            <span>·</span>
            <span>Mobile OTP Verified</span>
          </div>
          <h1 className="hero-title relative z-10 font-display text-[3.25rem] leading-[0.98] text-foreground sm:text-7xl lg:text-[5.4rem]">
            A calm, secure bridge between citizens and the courts of India.
          </h1>
          <p className="relative z-10 mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            ParthSarathi turns scattered papers into a structured case record — reading your documents,
            extracting the facts and dates, assessing urgency, and connecting you with verified advocates
            and reliable hearing information.
          </p>
          <div className="relative z-10 mt-9 flex flex-wrap justify-center gap-3">
            {session ? (
              <Magnetic>
                <Link
                  to="/citizen"
                  className="seal-fill inline-flex items-center border border-primary bg-primary px-7 py-3 text-primary-foreground font-medium shadow-md"
                >
                  Enter Your Portal →
                </Link>
              </Magnetic>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleBypassCitizen}
                  className="seal-fill inline-flex items-center border border-primary bg-primary px-7 py-3 text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-all cursor-pointer"
                >
                  Citizen
                </button>
                <Magnetic>
                  <Link
                    to="/auth"
                    className="seal-fill inline-flex items-center border border-gold/50 bg-gold/10 px-7 py-3 text-foreground font-medium hover:bg-gold/20"
                  >
                    Judge
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link
                    to="/auth"
                    className="seal-fill inline-flex items-center border border-border bg-card px-6 py-3 text-muted-foreground hover:text-foreground"
                  >
                    Judicial / Enforcement
                  </Link>
                </Magnetic>
              </>
            )}
          </div>
         </div>

        <div className="mt-16 grid items-stretch gap-8 lg:grid-cols-[1.35fr_1fr]">
          <figure data-parallax className="photo-frame relative overflow-hidden border border-border bg-primary">
            <img
              src={heroCourt}
              alt="Sandstone arcade and steps of an Indian high court at golden hour"
              width={1600}
              height={1104}
              className="duotone-court h-full min-h-[320px] max-h-[420px] w-full object-cover"
            />
            <span className="court-duotone pointer-events-none absolute inset-0 mix-blend-color" aria-hidden />
          </figure>
          <div className="relative min-h-[300px] border border-border bg-surface">
            <PaperSettle className="absolute inset-6" />
            <p className="absolute right-5 bottom-5 left-5 text-[13px] leading-relaxed text-muted-foreground">
              Loose papers, one structured case file.
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-2xl">
          <AiNotice />
        </div>
        </div>
      </section>

      {/* Roles — a row of entries divided by brass rules, not cards */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {AUDIENCES.map((a, i) => (
              <div
                key={a.title}
                className={
                  "role-reveal tilt-card relative overflow-hidden border-t border-gold/50 pt-5 lg:min-h-[220px] lg:border-t-0 lg:border-l lg:px-7 lg:pt-0 " +
                  (i === 0 ? "lg:border-l-0 lg:pl-0" : "")
                }
              >
                <div className="role-reveal-mark" aria-hidden><a.icon strokeWidth={0.8} /></div>
                <div className="relative z-10">
                  <a.icon className="tilt-icon size-5 text-gold" strokeWidth={1.4} />
                  <p className="mt-3 font-display text-2xl text-foreground">{a.title}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AudienceMarquee />

      {/* Pipeline */}
      <section className="storytelling-band section-curve relative bg-primary py-28 text-primary-foreground lg:py-36">
       <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 ref={pipelineHead.ref} className="max-w-3xl font-display text-5xl leading-none text-foreground sm:text-6xl">
          From papers to a clear case record
        </h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          One continuous pass: the file is read, marked up and then handed on — <TraceUnderline>each with its source</TraceUnderline>.
        </p>
        <div className="mt-14">
          <Story3D />
        </div>
       </div>
      </section>

      {/* Evidence + features, with a binding-edge rule */}
      <section className="border-t border-border bg-surface py-28 lg:py-36">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <figure data-parallax className="photo-frame overflow-hidden border border-border">
              <img
                src={documentsImage}
                alt="A tied bundle of court papers being placed on a document scanner"
                width={1200}
                height={900}
                loading="lazy"
                className="h-64 w-full object-cover"
              />
              <figcaption className="border-t border-border bg-card px-4 py-3 text-[14px] text-muted-foreground">
                Every uploaded page is read, indexed and kept traceable to the insight it supports.
              </figcaption>
            </figure>
            <figure data-parallax className="photo-frame overflow-hidden border border-border">
              <img
                src={consultationImage}
                alt="An advocate in robes consulting with a client across a wooden desk"
                width={1200}
                height={900}
                loading="lazy"
                className="h-64 w-full object-cover"
              />
              <figcaption className="border-t border-border bg-card px-4 py-3 text-[14px] text-muted-foreground">
                Matters reach advocates already structured, so the first consultation begins with substance.
              </figcaption>
            </figure>
          </div>
          <div className="binding-rule self-center pl-8">
            <h2 className="font-display text-5xl leading-none text-foreground">
              Built for the way Indian courts actually work
            </h2>
            <ul className="mt-8 space-y-7">
              {FEATURES.map((item) => (
                <li key={item.t}>
                  <p className="font-display text-xl text-foreground">{item.t}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{item.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
          <h2 className="font-display text-4xl">Start with a single document</h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-primary-foreground/75">
            Describe your situation in your own words and upload whatever papers you hold. ParthSarathi will do
            the reading, the structuring and the introductions.
          </p>
          <div className="mt-9">
            <Magnetic>
              <Link
                to="/auth"
                className="inline-flex items-center bg-seal px-8 py-3.5 text-seal-foreground transition-colors hover:bg-seal/90"
              >
                Get started
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <footer className="border-t border-gold/50 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-[13px] text-muted-foreground sm:px-8">
          <p>ParthSarathi — पार्थसारथी</p>
          <p>AI outputs are assistive and never a substitute for an advocate or a court order.</p>
        </div>
      </footer>
    </LandingExperience>
  );
}
