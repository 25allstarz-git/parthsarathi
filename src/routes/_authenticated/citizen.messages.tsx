import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { MessagesSquare } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MessagesPanel } from "@/components/case-detail";
import { EmptyState, SectionTitle, StatusBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCaseBundle, listMyCases } from "@/lib/cases.functions";
import { formatDate } from "@/lib/nyaysetu";
import { CITIZEN_NAV } from "@/lib/nav";
import { useMe } from "@/hooks/use-me";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/citizen/messages")({
  component: CitizenMessages,
});

function CitizenMessages() {
  const { data: me } = useMe();
  const fetchCases = useServerFn(listMyCases);
  const fetchBundle = useServerFn(getCaseBundle);

  const { data: cases = [], isLoading } = useQuery({ queryKey: ["my-cases"], queryFn: () => fetchCases() });
  const conversations = cases.filter((c) => c.assigned_lawyer_id);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId && conversations[0]) setActiveId(conversations[0].id);
  }, [activeId, conversations]);

  const { data: bundle } = useQuery({
    queryKey: ["case", activeId],
    queryFn: () => fetchBundle({ data: { caseId: activeId as string } }),
    enabled: !!activeId,
  });

  return (
    <AppShell nav={CITIZEN_NAV}>
      <SectionTitle
        eyebrow="Secure messaging"
        title="Messages"
        description="Case-specific conversations with the advocate acting in each matter. Messages are visible only to you and them."
      />

      {isLoading && <Skeleton className="mt-6 h-96 w-full rounded-lg" />}

      {!isLoading && conversations.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<MessagesSquare className="size-6" />}
            title="No conversations yet"
            description="Messaging opens as soon as an advocate accepts one of your matters."
            action={
              <Button asChild>
                <Link to="/citizen/lawyers">Find an advocate</Link>
              </Button>
            }
          />
        </div>
      )}

      {conversations.length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
          <div className="space-y-2">
            {conversations.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors",
                  activeId === c.id
                    ? "border-gold/50 bg-secondary"
                    : "border-border bg-card hover:bg-secondary/50",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-gold">{c.case_number}</span>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm font-medium">{c.title}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  Filed {formatDate(c.filed_on ?? c.created_at)}
                </p>
              </button>
            ))}
          </div>

          <div>
            {activeId && (
              <MessagesPanel
                caseId={activeId}
                messages={bundle?.messages ?? []}
                currentUserId={me?.userId ?? ""}
              />
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
