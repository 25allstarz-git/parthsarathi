import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { MessageSquare, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { EmptyState, SectionTitle } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { listLawyers, listMyCases, requestLawyer } from "@/lib/cases.functions";
import { LEGAL_CATEGORIES, formatFee, initials } from "@/lib/nyaysetu";
import { CITIZEN_NAV } from "@/lib/nav";
import type { LawyerProfile } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/citizen/lawyers")({
  component: FindLawyer,
});

function FindLawyer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchLawyers = useServerFn(listLawyers);
  const fetchCases = useServerFn(listMyCases);
  const request = useServerFn(requestLawyer);

  const { data: lawyers = [], isLoading } = useQuery({
    queryKey: ["lawyers"],
    queryFn: () => fetchLawyers(),
  });
  const { data: cases = [] } = useQuery({ queryKey: ["my-cases"], queryFn: () => fetchCases() });

  const [search, setSearch] = useState("");
  const [specialisation, setSpecialisation] = useState("all");
  const [selected, setSelected] = useState<LawyerProfile | null>(null);
  const [caseId, setCaseId] = useState("");

  const shareable = cases.filter((c) => !c.assigned_lawyer_id);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return lawyers.filter((l) => {
      if (specialisation !== "all" && !l.specializations.includes(specialisation)) return false;
      if (!term) return true;
      return [
        l.full_name,
        l.city ?? "",
        l.court ?? "",
        l.bar_council_id ?? "",
        l.specializations.join(" "),
        l.languages.join(" "),
        l.bio ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [lawyers, search, specialisation]);

  const requestMutation = useMutation({
    mutationFn: (input: { caseId: string; lawyerProfileId: string }) => request({ data: input }),
    onSuccess: (_result, input) => {
      toast.success("Your matter has been shared with the advocate.");
      void queryClient.invalidateQueries({ queryKey: ["case", input.caseId] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setSelected(null);
      navigate({ to: "/citizen/case/$caseId", params: { caseId: input.caseId } });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <AppShell nav={CITIZEN_NAV}>
      <SectionTitle
        eyebrow="Advocate discovery"
        title="Find an advocate"
        description="Verified advocates across practice areas, courts and languages. Share a matter to begin a secure conversation."
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by advocate name, court, city, language, or Bar Council ID..."
            className="pl-9"
            aria-label="Search advocates"
          />
        </div>
        <Select value={specialisation} onValueChange={setSpecialisation}>
          <SelectTrigger className="w-full sm:w-64" aria-label="Filter by practice area">
            <SelectValue placeholder="Practice area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All practice areas</SelectItem>
            {LEGAL_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{filtered.length} verified {filtered.length === 1 ? "advocate" : "advocates"} listed</span>
        {(search || specialisation !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSpecialisation("all");
            }}
            className="font-medium text-gold underline hover:opacity-80"
          >
            Reset filters
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading && [0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-56 rounded-lg" />)}
        {!isLoading && filtered.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState
              title="No advocates match these filters"
              description="Try another practice area or clear the search."
            />
          </div>
        )}
        {filtered.map((l) => (
          <Card key={l.id} className="elevate rise">
            <CardContent className="flex h-full flex-col gap-3 pt-6">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink font-mono text-xs text-ink-foreground">
                  {initials(l.full_name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg">{l.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {l.court ?? "Court not stated"} · {l.city ?? "—"}
                  </p>
                </div>
                <span className="ml-auto flex items-center gap-1 font-mono text-xs text-gold">
                  <Star className="size-3.5 fill-current" /> {l.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{l.specializations.join(" · ")}</p>
              <p className="line-clamp-3 text-sm text-muted-foreground">{l.bio}</p>
              <div className="mt-auto flex flex-wrap gap-3 font-mono text-[11px] text-muted-foreground">
                <span>{l.experience_years} yrs</span>
                <span>{l.cases_handled} matters</span>
                <span>{l.success_rate}% success</span>
                <span>{formatFee(l.consultation_fee)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={
                    l.is_available
                      ? "font-mono text-[10px] tracking-[0.12em] text-success uppercase"
                      : "font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase"
                  }
                >
                  {l.is_available ? "Available" : "Unavailable"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelected(l);
                    setCaseId(shareable[0]?.id ?? "");
                  }}
                >
                  View profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{selected?.full_name}</DialogTitle>
            <DialogDescription>
              {selected?.court ?? "Court not stated"} · {selected?.city ?? "—"} ·{" "}
              {selected?.experience_years} years at the bar
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{selected.bio}</p>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    Practice areas
                  </dt>
                  <dd>{selected.specializations.join(", ")}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    Languages
                  </dt>
                  <dd>{selected.languages.join(", ")}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    Matters handled
                  </dt>
                  <dd>
                    {selected.cases_handled} · {selected.success_rate}% success
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    Consultation
                  </dt>
                  <dd>{formatFee(selected.consultation_fee)}</dd>
                </div>
                {selected.bar_council_id && (
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                      Bar council
                    </dt>
                    <dd className="font-mono text-xs">{selected.bar_council_id}</dd>
                  </div>
                )}
              </dl>

              <div className="rounded-md border border-border bg-surface p-4">
                <p className="font-mono text-[10px] tracking-[0.14em] text-gold uppercase">
                  Share a matter
                </p>
                {shareable.length === 0 ? (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      You have no unassigned matters to share. File a matter first, then return here to consult with {selected.full_name}.
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelected(null);
                        navigate({ to: "/citizen/new" });
                      }}
                    >
                      File a matter now
                    </Button>
                  </div>
                ) : (
                  <Select value={caseId} onValueChange={setCaseId}>
                    <SelectTrigger className="mt-2" aria-label="Choose a matter">
                      <SelectValue placeholder="Choose a matter" />
                    </SelectTrigger>
                    <SelectContent>
                      {shareable.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.case_number} — {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button
              disabled={!caseId || !selected || requestMutation.isPending || !selected.is_available}
              onClick={() =>
                selected && requestMutation.mutate({ caseId, lawyerProfileId: selected.id })
              }
            >
              <MessageSquare className="mr-2 size-4" />
              {requestMutation.isPending ? "Sending…" : "Share and start a conversation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
