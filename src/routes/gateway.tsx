import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { ROLE_HOME } from "@/lib/nyaysetu";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/gateway")({
  ssr: false,
  component: Gateway,
});

function Gateway() {
  const navigate = useNavigate();
  const [sessionReady, setSessionReady] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setAuthError(error);
      } else if (data.session) {
        setSessionReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || session) {
        setSessionReady(true);
        setAuthError(null);
      } else if (event === "SIGNED_OUT") {
        navigate({ to: "/auth", replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: me, isLoading, isError, error: meError, refetch } = useMe({ enabled: sessionReady });

  useEffect(() => {
    if (!sessionReady || isLoading || isError || !me) return;

    if (me.isAdmin) {
      navigate({ to: "/admin/verifications", replace: true });
      return;
    }

    if (!me.role) {
      navigate({ to: "/register", replace: true });
      return;
    }
    navigate({ to: ROLE_HOME[me.role], replace: true });
  }, [me, isLoading, isError, sessionReady, navigate]);

  const error = authError || (isError ? meError : null);

  if (error) {
    // Only log details locally/development console
    if (import.meta.env.DEV) {
      console.error("Gateway auth/profile load failed:", error);
    }
    
    return (
      <div className="grid min-h-screen place-items-center p-4">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="font-display text-lg">Sign-in could not be completed</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "An unexpected error occurred while loading your profile."}
          </p>
          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={() => navigate({ to: "/auth", replace: true })}>
              Return to sign in
            </Button>
            <Button className="flex-1" onClick={() => { setAuthError(null); refetch(); }}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {!sessionReady ? "Waiting for authentication…" : "Preparing your workspace…"}
      </p>
    </div>
  );
}
