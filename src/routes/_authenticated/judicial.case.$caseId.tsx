import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AnalysisPanel, DocumentsPanel, MessagesPanel } from "@/components/case-detail";
import { EmptyState, SectionTitle, StatusBadge, UrgencyBadge, SecureNotice } from "@/components/brand";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getJudicialCaseBundle } from "@/lib/cases.functions";
import { logAccess, findSimilarPrecedents } from "@/lib/workspace.functions";
import { formatDate } from "@/lib/nyaysetu";
import { JUDICIAL_NAV } from "@/lib/nav";

export const Route = createFileRoute("/_authenticated/judicial/case/$caseId")({
  component: JudicialCasePage,
});

function JudicialCasePage() {
  const { caseId } = Route.useParams();
  const fetchBundle = useServerFn(getJudicialCaseBundle);
  const triggerLog = useServerFn(logAccess);

  useEffect(() => {
    // Fire-and-forget audit log when component mounts
    void triggerLog({ data: { action: "view_case", target: caseId } });
  }, [caseId, triggerLog]);

  const { data: bundle, isLoading } = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => fetchBundle({ data: { caseId } }),
  });

  const fetchSimilarPrecedents = useServerFn(findSimilarPrecedents);
  const { data: similarPrecedents, isLoading: loadingPrecedents } = useQuery({
    queryKey: ["similar-precedents", caseId],
    queryFn: () => fetchSimilarPrecedents({ data: { caseId } }),
  });

  if (isLoading) {
    return (
      <AppShell nav={JUDICIAL_NAV}>
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="mt-6 h-96 w-full rounded-lg" />
      </AppShell>
    );
  }

  const record = bundle?.record;
  if (!record) {
    return (
      <AppShell nav={JUDICIAL_NAV}>
        <EmptyState title="Record unavailable" description="This case record cannot be found." />
      </AppShell>
    );
  }

  // Compute Missing Information Flags
  const flags: string[] = [];
  if (!bundle?.analysis) flags.push("No AI analysis available for this case.");
  if (!bundle?.documents || bundle.documents.length === 0) flags.push("No documents have been uploaded.");
  if (bundle?.analysis && (!bundle.analysis.extracted_facts || bundle.analysis.extracted_facts.length === 0)) {
    flags.push("Missing extracted facts.");
  }
  if (bundle?.analysis && (!bundle.analysis.key_dates || bundle.analysis.key_dates.length === 0)) {
    flags.push("Missing key timeline dates.");
  }

  // Sort timeline events
  const timelineEvents = [...(bundle?.analysis?.key_dates || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <AppShell nav={JUDICIAL_NAV}>
      {flags.length > 0 && (
        <Alert variant="destructive" className="mb-6 bg-red-50 text-red-900 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-900">
          <AlertTriangle className="h-4 w-4 stroke-red-600 dark:stroke-red-400" />
          <AlertTitle className="font-semibold text-red-800 dark:text-red-300">Missing Information Detected</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 text-sm text-red-700 dark:text-red-400">
              {flags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <SectionTitle
        eyebrow={record.case_number}
        title={record.title}
        description={`${record.category} · ${record.court ?? "Court to be assigned"} · next hearing ${
          record.next_hearing ? formatDate(record.next_hearing) : "Not listed"
        }`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <UrgencyBadge urgency={record.urgency} />
            <StatusBadge status={record.status} />
          </div>
        }
      />

      <Tabs defaultValue="analysis" className="mt-8">
        <TabsList>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          {bundle?.messages && bundle.messages.length > 0 && (
            <TabsTrigger value="messages">Messages</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="analysis" className="mt-6">
          <div className="max-w-4xl space-y-6">
            <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
              <SecureNotice>
                AI-generated analysis is assistive only and does not constitute a legal judgment or recommendation — verify all facts against source documents before relying on them.
              </SecureNotice>
            </div>
            <AnalysisPanel analysis={bundle?.analysis ?? null} />
            
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display text-lg mb-4 text-foreground">Similar precedents (semantic)</h3>
              {loadingPrecedents ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : similarPrecedents && similarPrecedents.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {similarPrecedents.map((p: any) => (
                    <div key={p.id} className="rounded-md border border-border bg-surface p-4">
                      <p className="font-mono text-xs text-gold font-semibold">{p.citation}</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{p.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{p.court} · {p.year}</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3" title={p.holding}>
                        {p.holding}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No semantic matches found.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentsPanel 
            documents={bundle?.documents ?? []} 
            onOpen={(doc) => {
              void triggerLog({ data: { action: "view_document", target: doc.id } });
            }}
          />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <div className="max-w-3xl rounded-lg border border-border bg-card p-6">
            <h3 className="font-display text-lg mb-6">Chronological Timeline</h3>
            {timelineEvents.length > 0 ? (
              <div className="relative border-l border-border ml-3 space-y-8 pb-4">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="relative pl-6">
                    <span className="absolute -left-2.5 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted ring-4 ring-card">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </span>
                    <time className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {formatDate(event.date)}
                    </time>
                    <p className="mt-1 text-sm text-foreground">{event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No events found for this case timeline.</p>
            )}
          </div>
        </TabsContent>

        {bundle?.messages && bundle.messages.length > 0 && (
          <TabsContent value="messages" className="mt-6">
            <div className="max-w-3xl">
              <MessagesPanel
                caseId={caseId}
                messages={bundle.messages}
                currentUserId=""
                disabled={true}
                disabledReason="Judicial officers have read-only access to messages."
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </AppShell>
  );
}
