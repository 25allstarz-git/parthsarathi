import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { AssistantPanel } from "@/components/case-detail";
import { EmptyState, SectionTitle, Stat, StatusBadge, UrgencyBadge } from "@/components/brand";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { judicialDocket, listHearings, listPrecedents } from "@/lib/workspace.functions";
import { formatDate } from "@/lib/nyaysetu";

export const Route = createFileRoute("/_authenticated/judicial/")({
  component: JudicialWorkspace,
});

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const NAV = [{ label: "Bench workspace", to: "/judicial" }];

function JudicialWorkspace() {
  const [docketSearch, setDocketSearch] = useState("");
  const [precedentSearch, setPrecedentSearch] = useState("");
  const debouncedPrecedentSearch = useDebounce(precedentSearch, 300);

  const fetchDocket = useServerFn(judicialDocket);
  const fetchHearings = useServerFn(listHearings);
  const fetchPrecedents = useServerFn(listPrecedents);

  const { data: docket = [] } = useQuery({ queryKey: ["docket"], queryFn: () => fetchDocket() });
  const { data: hearings = [] } = useQuery({
    queryKey: ["hearings"],
    queryFn: () => fetchHearings({ data: {} }),
  });
  const { data: precedents = [] } = useQuery({
    queryKey: ["precedents", debouncedPrecedentSearch],
    queryFn: () => fetchPrecedents({ data: debouncedPrecedentSearch ? { search: debouncedPrecedentSearch } : {} }),
  });

  const docketLower = docketSearch.toLowerCase();
  
  const filteredHearings = hearings.filter(h => {
    if (!docketLower) return true;
    return (h.case_number || "").toLowerCase().includes(docketLower) ||
           (h.purpose || "").toLowerCase().includes(docketLower) ||
           (h.judge_name || "").toLowerCase().includes(docketLower);
  });

  const filteredDocket = docket.filter(c => {
    if (!docketLower) return true;
    return (c.case_number || "").toLowerCase().includes(docketLower) ||
           (c.title || "").toLowerCase().includes(docketLower) ||
           (c.court || "").toLowerCase().includes(docketLower);
  });

  return (
    <AppShell nav={NAV}>
      <SectionTitle
        eyebrow="Judicial workspace"
        title="Docket and cause list"
        description="Listed matters, scheduled hearings and research support for the bench."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Matters on record" value={docket.length} />
        <Stat label="Listed hearings" value={hearings.length} />
        <Stat label="Critical matters" value={docket.filter((c) => c.urgency === "critical").length} />
      </div>

      <Tabs defaultValue="causelist" className="mt-8">
        <TabsList>
          <TabsTrigger value="causelist">Cause list</TabsTrigger>
          <TabsTrigger value="docket">Docket</TabsTrigger>
          <TabsTrigger value="precedents">Precedents</TabsTrigger>
          <TabsTrigger value="assistant">Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="causelist" className="mt-6 space-y-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by case number, title, or court..." 
              value={docketSearch}
              onChange={(e) => setDocketSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {filteredHearings.length === 0 && <EmptyState title="No matters match your search." />}
          {filteredHearings.map((h) => (
            <Link key={h.id} to="/judicial/case/$caseId" params={{ caseId: h.case_id }} className="block">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                  <div>
                    <p className="font-mono text-xs text-gold">
                      {h.item_no ? `Item ${h.item_no} · ` : ""}
                      {h.case_number}
                    </p>
                    <p className="mt-1 text-sm text-foreground">{h.purpose ?? "Hearing"}</p>
                    <p className="text-xs text-muted-foreground">
                      {h.court}
                      {h.court_room ? ` · ${h.court_room}` : ""}
                      {h.judge_name ? ` · ${h.judge_name}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-foreground">{formatDate(h.hearing_date)}</p>
                    <p className="font-mono text-xs text-muted-foreground">{h.hearing_time ?? ""}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="docket" className="mt-6 space-y-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by case number, title, or court..." 
              value={docketSearch}
              onChange={(e) => setDocketSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {filteredDocket.length === 0 && <EmptyState title="No matters match your search." />}
          {filteredDocket.map((c) => (
            <Link key={c.id} to="/judicial/case/$caseId" params={{ caseId: c.id }} className="block">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-gold">{c.case_number}</span>
                    <UrgencyBadge urgency={c.urgency} />
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="mt-2 font-display text-lg">{c.title}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {c.category} · {c.court ?? "—"}
                    {c.next_hearing ? ` · next hearing ${formatDate(c.next_hearing)}` : ""}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="precedents" className="mt-6 space-y-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search precedents by title, citation, or category..." 
              value={precedentSearch}
              onChange={(e) => setPrecedentSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {precedents.length === 0 && <EmptyState title="No precedents match your search." />}
          {precedents.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-6">
                <p className="font-mono text-xs text-gold">{p.citation}</p>
                <p className="mt-1 font-display text-lg">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  {p.court} · {p.year} · {p.category}
                </p>
                <p className="mt-2 text-sm text-foreground">{p.holding}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assistant" className="mt-6">
          <div className="max-w-3xl">
            <AssistantPanel
              audience="judge"
              suggestions={[
                "Frame the issues arising in a delayed possession dispute.",
                "What is the settled position on bail in economic offences?",
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
