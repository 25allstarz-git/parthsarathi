import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { EmptyState, SectionTitle, SecureNotice, StatusBadge, UrgencyBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { enforcementSearch } from "@/lib/workspace.functions";
import { formatDate } from "@/lib/nyaysetu";

export const Route = createFileRoute("/_authenticated/enforcement/")({
  component: EnforcementWorkspace,
});

const NAV = [{ label: "Case lookup", to: "/enforcement" }];

function EnforcementWorkspace() {
  const [query, setQuery] = useState("");
  const search = useServerFn(enforcementSearch);
  const mutation = useMutation({
    mutationFn: (q: string) => search({ data: { query: q } }),
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <AppShell nav={NAV}>
      <SectionTitle
        eyebrow="Law enforcement"
        title="Case status and hearing lookup"
        description="Search by case number, filing number, party name or title. Access is logged."
      />

      <form
        className="mt-6 flex max-w-xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim().length >= 2) mutation.mutate(query.trim());
        }}
      >
        <Input
          value={query}
          maxLength={80}
          placeholder="e.g. W.P.(C) 1189/2026 or party name"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" disabled={mutation.isPending || query.trim().length < 2}>
          {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        </Button>
      </form>
      <div className="mt-3">
        <SecureNotice>Only status and hearing information is released. Filings stay sealed.</SecureNotice>
      </div>

      <div className="mt-8 space-y-6">
        {mutation.data && mutation.data.cases.length === 0 && mutation.data.hearings.length === 0 && (
          <EmptyState title="No records matched" description="Check the case number and try again." />
        )}

        {mutation.data?.cases.map((c) => (
          <Card key={c.id}>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-gold">{c.case_number}</span>
                <UrgencyBadge urgency={c.urgency} />
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-2 font-display text-lg">{c.title}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {c.category} · {c.court ?? "—"} · filed {formatDate(c.filed_on ?? c.created_at)}
                {c.next_hearing ? ` · next hearing ${formatDate(c.next_hearing)}` : ""}
              </p>
            </CardContent>
          </Card>
        ))}

        {mutation.data?.hearings.map((h) => (
          <Card key={h.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <p className="font-mono text-xs text-gold">{h.case_number}</p>
                <p className="mt-1 text-sm">{h.purpose ?? "Hearing"}</p>
                <p className="text-xs text-muted-foreground">
                  {h.court}
                  {h.court_room ? ` · ${h.court_room}` : ""}
                </p>
              </div>
              <p className="font-mono text-sm">
                {formatDate(h.hearing_date)} {h.hearing_time ?? ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
