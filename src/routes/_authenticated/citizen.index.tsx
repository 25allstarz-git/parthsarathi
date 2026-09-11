import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Bell, FilePlus2, Scale, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState, SectionTitle, Stat, StatusBadge, UrgencyBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listMyCases, listNotifications } from "@/lib/cases.functions";
import { formatDate, relativeTime } from "@/lib/nyaysetu";
import { CITIZEN_NAV } from "@/lib/nav";
import type { CaseRecord } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/citizen/")({
  component: CitizenDashboard,
});

const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
];

function CitizenDashboard() {
  const fetchCases = useServerFn(listMyCases);
  const fetchNotifications = useServerFn(listNotifications);
  const { data: cases = [], isLoading } = useQuery({ queryKey: ["my-cases"], queryFn: () => fetchCases() });
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
  });

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = cases.filter((c) => {
      if (tab !== "all" && c.status !== tab) return false;
      if (!term) return true;
      return [c.case_number, c.title, c.category, c.court ?? "", c.filing_number ?? ""]
        .join(" ")
        .join(" ")
        .toLowerCase()
        .includes(term);
    });

    const urgencyRank: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return result.sort((a, b) => {
      const rankA = urgencyRank[a.urgency || "medium"] || 0;
      const rankB = urgencyRank[b.urgency || "medium"] || 0;
      
      if (rankA !== rankB) {
        return rankB - rankA; // Higher rank first
      }
      
      // Secondary sort: most recently updated/created. 
      // The array is already returned by the DB sorted by created_at DESC, 
      // but we can explicitly sort by it to be safe.
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }, [cases, tab, search]);

  const open = cases.filter((c) => c.status !== "closed").length;
  const assigned = cases.filter((c) => c.assigned_lawyer_id).length;
  const critical = cases.filter((c) => c.urgency === "critical" || c.urgency === "high").length;

  return (
    <AppShell nav={CITIZEN_NAV}>
      <SectionTitle
        eyebrow="Citizen workspace"
        title="Your matters"
        description="Every matter you have filed, its analysis, assigned advocate and next hearing."
        action={
          <Button asChild>
            <Link to="/citizen/new">
              <FilePlus2 className="mr-2 size-4" /> File a matter
            </Link>
          </Button>
        }
      />

      <div className="rise mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total matters" value={cases.length} />
        <Stat label="Open" value={open} hint="Pending, assigned or active" />
        <Stat label="With an advocate" value={assigned} />
        <Stat label="Time-sensitive" value={critical} hint="Critical or high urgency" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                {TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search case number or title"
                className="pl-9"
                aria-label="Search matters"
              />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading &&
              [0, 1, 2].map((i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)}

            {!isLoading && cases.length === 0 && (
              <EmptyState
                icon={<Scale className="size-6" />}
                title="No matters filed yet"
                description="Describe your situation and upload any papers you have. We will structure it and suggest advocates."
                action={
                  <Button asChild>
                    <Link to="/citizen/new">File your first matter</Link>
                  </Button>
                }
              />
            )}

            {!isLoading && cases.length > 0 && filtered.length === 0 && (
              <EmptyState
                title="No matters match this filter"
                description="Try a different status tab or clear the search."
              />
            )}

            {filtered.map((c: CaseRecord) => (
              <Link
                key={c.id}
                to="/citizen/case/$caseId"
                params={{ caseId: c.id }}
                className="elevate rise block rounded-lg border border-border bg-card p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gold">{c.case_number}</span>
                  <UrgencyBadge urgency={c.urgency} />
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-2 font-display text-lg text-foreground">{c.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] text-muted-foreground">
                  <span>{c.category}</span>
                  <span>{c.court ?? "Court to be assigned"}</span>
                  <span>Filed {formatDate(c.filed_on ?? c.created_at)}</span>
                  {c.next_hearing && (
                    <span className="text-gold">Next hearing {formatDate(c.next_hearing)}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside>
          <p className="flex items-center gap-2 font-display text-lg">
            <Bell className="size-4 text-gold" strokeWidth={1.7} /> Recent activity
          </p>
          <div className="mt-4 border-l border-border pl-4">
            {notifications.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">
                Activity on your matters — analysis, advocate responses and hearings — appears here.
              </p>
            )}
            {notifications.slice(0, 8).map((n) => (
              <div key={n.id} className="relative pb-6 last:pb-0">
                <span
                  className="absolute top-1.5 -left-[21px] size-2 rounded-full bg-gold"
                  aria-hidden
                />
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                {n.body && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{n.body}</p>}
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {relativeTime(n.created_at)}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
