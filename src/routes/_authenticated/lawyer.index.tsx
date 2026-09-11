import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Briefcase, Inbox } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AssistantPanel } from "@/components/case-detail";
import { EmptyState, SectionTitle, Stat, StatusBadge, UrgencyBadge } from "@/components/brand";
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
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateLawyerProfile } from "@/lib/account.functions";
import { lawyerCases, lawyerQueue, lawyerRequests, respondToCase } from "@/lib/workspace.functions";
import { formatDate } from "@/lib/nyaysetu";
import { LAWYER_NAV } from "@/lib/nav";
import { useMe } from "@/hooks/use-me";

export const Route = createFileRoute("/_authenticated/lawyer/")({
  component: LawyerWorkspace,
});

function LawyerWorkspace() {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const fetchQueue = useServerFn(lawyerQueue);
  const fetchMine = useServerFn(lawyerCases);
  const fetchRequests = useServerFn(lawyerRequests);
  const respond = useServerFn(respondToCase);
  const saveProfile = useServerFn(updateLawyerProfile);

  const { data: queue = [], isLoading } = useQuery({ queryKey: ["lawyer-queue"], queryFn: () => fetchQueue() });
  const { data: mine = [] } = useQuery({ queryKey: ["lawyer-cases"], queryFn: () => fetchMine() });
  const { data: requests = [] } = useQuery({
    queryKey: ["lawyer-requests"],
    queryFn: () => fetchRequests(),
  });

  const [pendingDecision, setPendingDecision] = useState<{
    caseId: string;
    caseNumber: string;
    decision: "accepted" | "rejected";
  } | null>(null);

  const decide = useMutation({
    mutationFn: (input: { caseId: string; decision: "accepted" | "rejected" }) =>
      respond({ data: input }),
    onSuccess: (_r, input) => {
      toast.success(
        input.decision === "accepted"
          ? "Matter accepted. The citizen has been notified and messaging is now open."
          : "Matter declined. The citizen has been returned to the recommendations.",
      );
      void queryClient.invalidateQueries({ queryKey: ["lawyer-queue"] });
      void queryClient.invalidateQueries({ queryKey: ["lawyer-cases"] });
      void queryClient.invalidateQueries({ queryKey: ["lawyer-requests"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setPendingDecision(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setPendingDecision(null);
    },
  });

  const availability = useMutation({
    mutationFn: (isAvailable: boolean) => saveProfile({ data: { isAvailable } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      void queryClient.invalidateQueries({ queryKey: ["lawyers"] });
      toast.success("Availability updated.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isAvailable = me?.lawyerProfile?.is_available ?? false;
  const directRequests = requests.filter((r) => r.status === "pending");

  return (
    <AppShell nav={LAWYER_NAV}>
      <SectionTitle
        eyebrow="Advocate workspace"
        title="Case queue and practice"
        description="New matters awaiting an advocate, direct requests from citizens, and the matters you are acting in."
        action={
          <div className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-2">
            <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              {isAvailable ? "ACCEPTING NEW MATTERS" : "NOT ACCEPTING"}
            </span>
            <Switch
              checked={isAvailable}
              disabled={!me?.lawyerProfile || availability.isPending}
              onCheckedChange={(v) => availability.mutate(v)}
              aria-label="Toggle availability"
            />
          </div>
        }
      />

      <div className="rise mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Awaiting an advocate" value={queue.length} />
        <Stat label="Direct requests" value={directRequests.length} hint="Citizens who named you" />
        <Stat label="My matters" value={mine.length} />
        <Stat
          label="Critical in queue"
          value={queue.filter((c) => c.urgency === "critical").length}
          hint="Time-sensitive filings"
        />
      </div>

      <Tabs defaultValue="queue" className="mt-8">
        <TabsList>
          <TabsTrigger value="queue">Intake queue</TabsTrigger>
          <TabsTrigger value="requests">Direct requests</TabsTrigger>
          <TabsTrigger value="mine">My matters</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-6 space-y-3">
          {isLoading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-40 w-full rounded-lg" />)}
          {!isLoading && queue.length === 0 && (
            <EmptyState icon={<Briefcase className="size-6" />} title="No matters awaiting an advocate" />
          )}
          {queue.map((c) => (
            <Card key={c.id} className="elevate rise">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gold">{c.case_number}</span>
                  <UrgencyBadge urgency={c.urgency} />
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-2 font-display text-lg">{c.title}</p>
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] text-muted-foreground">
                  <span>{c.category}</span>
                  <span>{c.court ?? "Court to be assigned"}</span>
                  <span>Filed {formatDate(c.filed_on ?? c.created_at)}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link to="/lawyer/case/$caseId" params={{ caseId: c.id }}>
                      Open brief
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    disabled={decide.isPending}
                    onClick={() =>
                      setPendingDecision({
                        caseId: c.id,
                        caseNumber: c.case_number,
                        decision: "accepted",
                      })
                    }
                  >
                    Accept matter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={decide.isPending}
                    onClick={() =>
                      setPendingDecision({
                        caseId: c.id,
                        caseNumber: c.case_number,
                        decision: "rejected",
                      })
                    }
                  >
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="requests" className="mt-6 space-y-3">
          {requests.length === 0 && (
            <EmptyState
              icon={<Inbox className="size-6" />}
              title="No direct requests"
              description="Citizens who choose you from advocate discovery appear here."
            />
          )}
          {requests.map((r) => (
            <Card key={r.id} className="rise">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gold">{r.case?.case_number ?? "—"}</span>
                  {r.case && <UrgencyBadge urgency={r.case.urgency} />}
                  <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    Request {r.status}
                  </span>
                </div>
                <p className="mt-2 font-display text-lg">{r.case?.title ?? "Matter unavailable"}</p>
                {r.note && <p className="mt-1 text-sm text-muted-foreground">“{r.note}”</p>}
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  Received {formatDate(r.created_at)}
                </p>
                {r.case && r.status === "pending" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="secondary">
                      <Link to="/lawyer/case/$caseId" params={{ caseId: r.case.id }}>
                        Open brief
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        setPendingDecision({
                          caseId: r.case!.id,
                          caseNumber: r.case!.case_number,
                          decision: "accepted",
                        })
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setPendingDecision({
                          caseId: r.case!.id,
                          caseNumber: r.case!.case_number,
                          decision: "rejected",
                        })
                      }
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="mine" className="mt-6 space-y-3">
          {mine.length === 0 && (
            <EmptyState title="No matters yet" description="Accept a matter from the intake queue." />
          )}
          {mine.map((c) => (
            <Link
              key={c.id}
              to="/lawyer/case/$caseId"
              params={{ caseId: c.id }}
              className="elevate rise block rounded-lg border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-gold">{c.case_number}</span>
                <UrgencyBadge urgency={c.urgency} />
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-2 font-display text-lg">{c.title}</p>
              <div className="mt-2 flex flex-wrap gap-4 font-mono text-[11px] text-muted-foreground">
                <span>{c.category}</span>
                <span>{c.court ?? "—"}</span>
                {c.next_hearing && (
                  <span className="text-gold">Next hearing {formatDate(c.next_hearing)}</span>
                )}
              </div>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="research" className="mt-6">
          <div className="max-w-3xl">
            <AssistantPanel
              audience="lawyer"
              suggestions={[
                "Summarise the limitation position for a cheque bounce complaint.",
                "Which precedents support anticipatory bail in a 498A matter?",
                "Draft the issues for a consumer complaint on delayed possession.",
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!pendingDecision}
        onOpenChange={(open) => !open && setPendingDecision(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              {pendingDecision?.decision === "accepted" ? "Accept this matter?" : "Decline this matter?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDecision?.decision === "accepted"
                ? `You will be recorded as the advocate on ${pendingDecision?.caseNumber}. The citizen is notified and secure messaging opens immediately.`
                : `${pendingDecision?.caseNumber} returns to the intake queue and the citizen is shown other advocates.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                pendingDecision &&
                decide.mutate({
                  caseId: pendingDecision.caseId,
                  decision: pendingDecision.decision,
                })
              }
            >
              {pendingDecision?.decision === "accepted" ? "Accept matter" : "Decline matter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
