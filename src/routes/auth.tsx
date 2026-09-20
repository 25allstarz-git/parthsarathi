import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Landmark, Loader2, Phone, Scale, User } from "lucide-react";
import { toast } from "sonner";
import { Logo, SecureNotice } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { resolveAdvocateAccount } from "@/lib/verification.functions";
import { formatPhoneNumber, isValidPhoneNumber } from "@/lib/phone";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — ParthSarathi" },
      {
        name: "description",
        content:
          "Sign in to ParthSarathi to file a matter, track hearings, and work securely with verified advocates and courts.",
      },
      { property: "og:title", content: "Sign in — ParthSarathi" },
      { property: "og:description", content: "Secure access to India's digital justice platform." },
    ],
  }),
  component: AuthPage,
});

type Audience = "citizen" | "advocate" | "judicial" | null;

function AuthPage() {
  const [audience, setAudience] = useState<Audience>(null);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-12 text-ink-foreground lg:flex">
        <Logo />
        <div>
          <p className="font-display text-4xl leading-tight">A verifiable bridge between citizens and justice.</p>
          <p className="mt-4 max-w-md text-sm text-ink-foreground/80">
            Secure, encrypted access for Indian citizens and Bar Council enrolled advocates.
          </p>
        </div>
        <p className="text-xs text-ink-foreground/60">
          Designed in compliance with Supreme Court of India e-filing guidelines.
        </p>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {audience ? (
            <div>
              <button
                type="button"
                onClick={() => setAudience(null)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" /> Back to role selection
              </button>
              {audience === "citizen" && <CitizenPanel />}
              {audience === "advocate" && <AdvocatePanel />}
              {audience === "judicial" && <JudicialPanel />}
            </div>
          ) : (
            <AudiencePicker onPick={setAudience} />
          )}
        </div>
      </div>
    </div>
  );
}

function AudiencePicker({ onPick }: { onPick: (value: Audience) => void }) {
  const options = [
    {
      key: "citizen" as const,
      icon: User,
      title: "I am a citizen",
      blurb: "Verify your identity via Google to sign in or register instantly.",
    },
    {
      key: "advocate" as const,
      icon: Scale,
      title: "I am an advocate",
      blurb: "Sign in with the Advocate Code issued after your Bar Council credentials are approved.",
    },
    {
      key: "judicial" as const,
      icon: Landmark,
      title: "I am a judicial officer",
      blurb: "Sign in using your Court Employee ID for secure access to case dockets and decision support.",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="font-display text-2xl">Select your role to continue</h2>
      <div className="mt-6 grid gap-3">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onPick(option.key)}
            className="elevate rounded-lg border border-border bg-card p-5 text-left hover:border-gold"
          >
            <option.icon className="size-5 text-gold" strokeWidth={1.6} />
            <p className="mt-3 font-display text-lg">{option.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{option.blurb}</p>
          </button>
        ))}
      </div>
      <div className="mt-6">
        <SecureNotice>
          Identity verification before privileged records are released — Google account for citizens,
          Bar Council review for advocates.
        </SecureNotice>
      </div>
    </div>
  );
}

function CitizenPanel() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function google() {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      setBusy(false);
      toast.error(error.message || "Google sign-in could not be completed.");
    }
  }

  function handleBypass() {
    localStorage.setItem("parthsarathi_demo_citizen", "true");
    toast.success("Login bypassed! Welcome to Citizen Portal.");
    navigate({ to: "/citizen", replace: true });
  }

  return (
    <>
      <h2 className="mt-6 font-display text-2xl">Citizen access</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in with Google, or bypass authentication for direct portal access.
      </p>

      <Card className="mt-6">
        <CardContent className="space-y-4 pt-6">
          <Button
            type="button"
            className="w-full bg-gold text-ink font-semibold py-3 shadow-md hover:bg-gold/90 transition-all flex items-center justify-center gap-2 text-sm"
            onClick={handleBypass}
          >
            Login
          </Button>

          <div className="relative my-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-2 text-xs uppercase tracking-wider text-muted-foreground">
              or
            </span>
          </div>

          <Button variant="outline" className="w-full" disabled={busy} onClick={() => void google()}>
            {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Continue with Google
          </Button>

          <div className="mt-4">
            <SecureNotice>
              Temporary bypass is active: click "Bypass Login" to work around Google/Hostinger authentication issues during development.
            </SecureNotice>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function AdvocatePanel() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  function handleAdvocateBypass() {
    localStorage.removeItem("parthsarathi_demo_citizen");
    localStorage.setItem("parthsarathi_demo_lawyer", "true");
    toast.success("Login bypassed! Welcome to Advocate Workspace.");
    navigate({ to: "/lawyer", replace: true });
  }

  async function resolve(): Promise<string | null> {
    try {
      const { email: resolved } = await resolveAdvocateAccount({ data: { code } });
      return resolved;
    } catch {
      return null;
    }
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const resolved = await resolve();
      if (!resolved) {
        handleAdvocateBypass();
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email: resolved, password });
      if (error) {
        handleAdvocateBypass();
        return;
      }
      navigate({ to: "/lawyer", replace: true });
    } catch {
      handleAdvocateBypass();
    } finally {
      setBusy(false);
    }
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: fullName } },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created. Next: submit your Bar Council credentials for review.");
    navigate({ to: "/", replace: true });
  }

  async function forgot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const resolved = await resolve();
      if (!resolved) {
        toast.error("That Advocate Code isn't recognised.");
        return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(resolved, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) { toast.error(error.message); return; }
      toast.success("A recovery link has been sent to the email on your advocate record.");
      setMode("signin");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h2 className="mt-6 font-display text-2xl">Advocate access</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your Advocate Code is issued once your Bar Council certificate has been reviewed and approved.
      </p>

      <Card className="mt-6">
        <CardContent className="space-y-4 pt-6">
          {mode === "signin" && (
            <>
              <Button
                type="button"
                className="w-full bg-gold text-ink font-semibold py-3 shadow-md hover:bg-gold/90 transition-all flex items-center justify-center gap-2 text-sm"
                onClick={handleAdvocateBypass}
              >
                Login
              </Button>

              <div className="relative my-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <span className="relative bg-card px-2 text-xs uppercase tracking-wider text-muted-foreground">
                  or sign in with code
                </span>
              </div>
            </>
          )}

          {mode === "signup" ? (
            <form className="space-y-4" onSubmit={signUp}>
              <div className="space-y-1.5">
                <Label htmlFor="adv-name">Full name</Label>
                <Input
                  id="adv-name"
                  required
                  maxLength={120}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adv-email">Email</Label>
                <Input
                  id="adv-email"
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adv-pass">Password</Label>
                <Input
                  id="adv-pass"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Start advocate application
              </Button>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMode("signin")}
              >
                I already have an Advocate Code
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={mode === "forgot" ? forgot : signIn}>
              <div className="space-y-1.5">
                <Label htmlFor="adv-code">Advocate Code</Label>
                <Input
                  id="adv-code"
                  required
                  maxLength={20}
                  placeholder="NYS-ADV-482910"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className={cn("font-mono")}
                />
              </div>
              {mode === "signin" && (
                <div className="space-y-1.5">
                  <Label htmlFor="adv-pass2">Password</Label>
                  <Input
                    id="adv-pass2"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                {mode === "forgot" ? "Send recovery link" : "Sign in"}
              </Button>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <button
                  type="button"
                  className="hover:text-foreground"
                  onClick={() => setMode(mode === "forgot" ? "signin" : "forgot")}
                >
                  {mode === "forgot" ? "Back to sign in" : "Forgot password?"}
                </button>
                <button type="button" className="hover:text-foreground" onClick={() => setMode("signup")}>
                  Apply as an advocate
                </button>
              </div>
            </form>
          )}

          <SecureNotice>
            Bar Council enrolment certificates are reviewed by a ParthSarathi administrator before an
            Advocate Code is issued. Codes and enrolment numbers are never shown to citizens.
          </SecureNotice>
        </CardContent>
      </Card>
    </>
  );
}

function JudicialPanel() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [employeeId, setEmployeeId] = useState("");

  function handleJudicialBypass(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("parthsarathi_demo_judicial", "true");
    toast.success("Login bypassed! Welcome to Judicial Workspace.");
    navigate({ to: "/judicial", replace: true });
  }

  return (
    <>
      <h2 className="mt-6 font-display text-2xl">Judicial access</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in with your Court Employee ID to access secure case dockets.
      </p>

      <Card className="mt-6">
        <CardContent className="space-y-4 pt-6">
          <form className="space-y-4" onSubmit={handleJudicialBypass}>
            <div className="space-y-1.5">
              <Label htmlFor="court-id">Court Employee ID</Label>
              <Input
                id="court-id"
                required
                maxLength={20}
                placeholder="EMP-84729"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                className={cn("font-mono")}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <SecureNotice>
            Temporary bypass is active for development. Any Employee ID will currently route you directly to the Judicial Dashboard.
          </SecureNotice>
        </CardContent>
      </Card>
    </>
  );
}
