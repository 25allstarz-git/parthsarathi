import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { SecureNotice, SectionTitle } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkPhoneUnique, updateProfile } from "@/lib/account.functions";
import { ROLE_LABEL } from "@/lib/nyaysetu";
import { CITIZEN_NAV } from "@/lib/nav";
import { useMe } from "@/hooks/use-me";

export const Route = createFileRoute("/_authenticated/citizen/profile")({
  component: CitizenProfile,
});

function CitizenProfile() {
  const { data: me } = useMe();
  const queryClient = useQueryClient();
  const save = useServerFn(updateProfile);
  const checkUnique = useServerFn(checkPhoneUnique);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!me) return;
    setFullName(me.profile?.full_name ?? "");
    setPhone(me.profile?.phone ?? "");
    setCity(me.profile?.city ?? "");
  }, [me]);

  const mutation = useMutation({
    mutationFn: async () => {
      const formattedPhone = phone.trim();
      if (formattedPhone && formattedPhone !== me?.profile?.phone) {
        const { isAvailable } = await checkUnique({ data: formattedPhone });
        if (!isAvailable) {
          throw new Error("This mobile number is already linked to another ParthSarathi account. Each number can only be used once — if you believe this is a mistake, contact support.");
        }
      }
      return save({ data: { fullName: fullName.trim(), phone: formattedPhone, city: city.trim() } });
    },
    onSuccess: () => {
      toast.success("Your details have been updated.");
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (phone && !/^[+\d][\d\s-]{6,19}$/.test(phone.trim())) {
      setError("Please enter a valid contact number.");
      return;
    }
    setError(null);
    mutation.mutate();
  }

  return (
    <AppShell nav={CITIZEN_NAV}>
      <SectionTitle
        eyebrow="Account"
        title="Profile and settings"
        description="Your contact details are shared with an advocate only after they accept your matter."
      />

      <div className="mt-6 grid max-w-4xl gap-6 md:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  maxLength={120}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={me?.email ?? ""} disabled className="mt-1.5" />
                <p className="mt-1 text-xs text-muted-foreground">
                  Your sign-in address cannot be changed here.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Contact number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    maxLength={20}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98xxx xxxxx"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    maxLength={80}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New Delhi"
                    className="mt-1.5"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-2 pt-6">
              <p className="font-mono text-[10px] tracking-[0.14em] text-gold uppercase">Role</p>
              <p className="font-display text-xl">{me?.role ? ROLE_LABEL[me.role] : "—"}</p>
              <p className="text-sm text-muted-foreground">
                Roles are verified server-side. A citizen account can never reach advocate, judicial or
                law-enforcement records.
              </p>
            </CardContent>
          </Card>
          <SecureNotice>
            Documents and messages are stored in an access-controlled vault and every professional lookup
            is logged.
          </SecureNotice>
        </div>
      </div>
    </AppShell>
  );
}
