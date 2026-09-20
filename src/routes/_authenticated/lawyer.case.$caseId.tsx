import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AnalysisPanel, AssistantPanel, DocumentsPanel, MessagesPanel } from "@/components/case-detail";
import { EmptyState, SectionTitle, StatusBadge, UrgencyBadge } from "@/components/brand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCaseBundle } from "@/lib/cases.functions";
import { respondToCase } from "@/lib/workspace.functions";
import { formatDate } from "@/lib/nyaysetu";
import { LAWYER_NAV } from "@/lib/nav";
import { useMe } from "@/hooks/use-me";

export const Route = createFileRoute("/_authenticated/lawyer/case/$caseId")({
  component: LawyerCasePage,
});

function LawyerCasePage() {
  const { caseId } = Route.useParams();
  const { data: me } = useMe();
  const queryClient = useQueryClient();
  const fetchBundle = useServerFn(getCaseBundle);
  const respond = useServerFn(respondToCase);

  const { data: bundle, isLoading } = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => fetchBundle({ data: { caseId } }),
  });

  const [decision, setDecision] = useState<"accepted" | "rejected" | null>(null);

  const decide = useMutation({
    mutationFn: (value: "accepted" | "rejected") => respond({ data: { caseId, decision: value } }),
    onSuccess: (_r, value) => {
      toast.success(value === "accepted" ? "Matter accepted." : "Matter declined.");
      void queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      void queryClient.invalidateQueries({ queryKey: ["lawyer-queue"] });
      void queryClient.invalidateQueries({ queryKey: ["lawyer-cases"] });
      void queryClient.invalidateQueries({ queryKey: ["lawyer-requests"] });
      setDecision(null);
    },
    onError: (e: Error) => {
      toast.error(e.message);
      setDecision(null);
    },
  });

  if (isLoading) {
    return (
      <AppShell nav={LAWYER_NAV}>
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="mt-6 h-96 w-full rounded-lg" />
      </AppShell>
    );
  }

  const record = bundle?.record;
  if (!record) {
    return (
      <AppShell nav={LAWYER_NAV}>
        <EmptyState title="Brief unavailable" description="This matter is outside your access." />
      </AppShell>
    );
  }

  const isMine = record.assigned_lawyer_id === me?.userId;

  return (
    <AppShell nav={LAWYER_NAV}>
      <SectionTitle
        eyebrow={record.case_number}
        title={record.title}
        description={`${record.category} · ${record.court ?? "Court to be assigned"} · filed ${formatDate(
          record.filed_on ?? record.created_at,
        )}${record.filing_number ? ` · filing ${record.filing_number}` : ""}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <UrgencyBadge urgency={record.urgency} />
            <StatusBadge status={record.status} />
            {!isMine && record.status === "pending" && (
              <>
                <Button size="sm" onClick={() => setDecision("accepted")}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDecision("rejected")}>
                  Decline
                </Button>
              </>
            )}
          </div>
        }
      />

      <Tabs defaultValue="brief" className="mt-8">
        <TabsList>
          <TabsTrigger value="brief">Brief</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="client">Client chat</TabsTrigger>
        </TabsList>

        <TabsContent value="brief" className="mt-6">
          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
                  Citizen's statement of facts
                </p>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                  {record.description}
                </p>
              </div>
              <AnalysisPanel analysis={bundle?.analysis ?? null} />
            </div>
            <AssistantPanel
              caseId={caseId}
              audience="lawyer"
              suggestions={[
                "Draft the issues arising from this brief.",
                "What limitation period applies here?",
                "Which precedents on record are strongest, and why?",
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentsPanel documents={bundle?.documents ?? []} />
        </TabsContent>

        <TabsContent value="client" className="mt-6">
          <div className="max-w-3xl">
            <MessagesPanel
              caseId={caseId}
              messages={bundle?.messages ?? []}
              currentUserId={me?.userId ?? ""}
              disabled={!isMine}
              {...(isMine ? {} : { disabledReason: "Accept this matter to message the client." })}
            />
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!decision} onOpenChange={(open) => !open && setDecision(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              {decision === "accepted" ? "Accept this matter?" : "Decline this matter?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {decision === "accepted"
                ? `You will be recorded as the advocate on ${record.case_number} and secure messaging with the client opens immediately.`
                : `${record.case_number} returns to the intake queue and the client is shown other advocates.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => decision && decide.mutate(decision)}>
              {decision === "accepted" ? "Accept matter" : "Decline matter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
