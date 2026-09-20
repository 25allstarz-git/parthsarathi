import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo, SecureNotice } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — ParthSarathi" },
      {
        name: "description",
        content: "Choose a new password for your ParthSarathi citizen or advocate account.",
      },
      { property: "og:title", content: "Set a new password — ParthSarathi" },
      { property: "og:description", content: "Account recovery for ParthSarathi users." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { toast.error("Both passwords must match."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/gateway", replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <Logo />
      <h1 className="mt-8 font-display text-2xl">Set a new password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Open this page from the recovery link sent to your registered email.
      </p>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Update password
            </Button>
          </form>
          <div className="mt-5">
            <SecureNotice>
              Recovery links expire quickly and can be used once. Request a new one if this fails.
            </SecureNotice>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
