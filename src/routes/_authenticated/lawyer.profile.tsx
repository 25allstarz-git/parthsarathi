import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { EmptyState, SectionTitle, Stat } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateLawyerProfile } from "@/lib/account.functions";
import { formatFee, initials } from "@/lib/nyaysetu";
import { LAWYER_NAV } from "@/lib/nav";
import { useMe } from "@/hooks/use-me";

export const Route = createFileRoute("/_authenticated/lawyer/profile")({
  component: LawyerProfilePage,
});

function LawyerProfilePage() {
  const { data: me } = useMe();
  const queryClient = useQueryClient();
  const save = useServerFn(updateLawyerProfile);
  const profile = me?.lawyerProfile ?? null;

  const [bio, setBio] = useState("");
  const [fee, setFee] = useState("0");
  const [court, setCourt] = useState("");
  const [years, setYears] = useState("0");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setBio(profile.bio ?? "");
    setFee(String(profile.consultation_fee));
    setCourt(profile.court ?? "");
    setYears(String(profile.experience_years));
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (patch: Parameters<typeof save>[0] extends never ? never : Record<string, unknown>) =>
      save({ data: patch as never }),
    onSuccess: () => {
      toast.success("Practice details updated.");
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      void queryClient.invalidateQueries({ queryKey: ["lawyers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!profile) {
    return (
      <AppShell nav={LAWYER_NAV}>
        <EmptyState
          title="No practice profile yet"
          description="Your advocate profile is created during registration. Please complete onboarding to appear in advocate discovery."
        />
      </AppShell>
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const feeValue = Number(fee);
    const yearsValue = Number(years);
    if (!Number.isFinite(feeValue) || feeValue < 0 || feeValue > 200000) {
      setError("Consultation fee must be between ₹0 and ₹2,00,000.");
      return;
    }
    if (!Number.isFinite(yearsValue) || yearsValue < 0 || yearsValue > 60) {
      setError("Years at the bar must be between 0 and 60.");
      return;
    }
    setError(null);
    mutation.mutate({
      bio: bio.trim(),
      consultationFee: Math.round(feeValue),
      court: court.trim(),
      experienceYears: Math.round(yearsValue),
    });
  }

  return (
    <AppShell nav={LAWYER_NAV}>
      <SectionTitle
        eyebrow="Practice profile"
        title={profile.full_name}
        description="What citizens see when your name appears in advocate discovery."
      />

      <div className="rise mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Matters handled" value={profile.cases_handled} />
        <Stat label="Success rate" value={`${profile.success_rate}%`} />
        <Stat label="Years at the bar" value={profile.experience_years} />
        <Stat label="Consultation" value={formatFee(profile.consultation_fee)} />
      </div>

      <div className="mt-8 grid max-w-5xl gap-6 md:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="bio">Professional summary</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  maxLength={1000}
                  rows={5}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1.5"
                  placeholder="Practice focus, notable appearances, approach to client matters."
                />
                <p className="mt-1 text-xs text-muted-foreground">{bio.length}/1000 characters</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="court">Principal court</Label>
                  <Input
                    id="court"
                    value={court}
                    maxLength={120}
                    onChange={(e) => setCourt(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="years">Years at the bar</Label>
                  <Input
                    id="years"
                    type="number"
                    min={0}
                    max={60}
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="fee">Consultation fee (₹)</Label>
                  <Input
                    id="fee"
                    type="number"
                    min={0}
                    max={200000}
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving…" : "Save practice details"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3 pt-6">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-ink font-mono text-xs text-ink-foreground">
                  {initials(profile.full_name)}
                </span>
                <div>
                  <p className="font-display text-lg">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {profile.city ?? "—"} · ★ {profile.rating.toFixed(1)}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  Practice areas
                </p>
                <p className="mt-1 text-sm">{profile.specializations.join(", ")}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  Languages
                </p>
                <p className="mt-1 text-sm">{profile.languages.join(", ")}</p>
              </div>
              {profile.bar_council_id && (
                <div>
                  <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    Bar council
                  </p>
                  <p className="mt-1 font-mono text-xs">{profile.bar_council_id}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between gap-4 pt-6">
              <div>
                <p className="font-display text-base">Accepting new matters</p>
                <p className="text-xs text-muted-foreground">
                  When off, citizens cannot send you new engagement requests.
                </p>
              </div>
              <Switch
                checked={profile.is_available}
                disabled={mutation.isPending}
                onCheckedChange={(v) => mutation.mutate({ isAvailable: v })}
                aria-label="Toggle availability"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
