import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AnalysisPanel, AssistantPanel, DocumentsPanel, MessagesPanel } from "@/components/case-detail";
import { EmptyState, SectionTitle, StatusBadge, UrgencyBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCaseBundle, listLawyers, requestLawyer } from "@/lib/cases.functions";
import { formatDate, formatFee } from "@/lib/nyaysetu";
import { useMe } from "@/hooks/use-me";
import { CITIZEN_NAV } from "@/lib/nav";

export const Route = createFileRoute("/_authenticated/citizen/case/$caseId")({
  component: CitizenCasePage,
});

function CitizenCasePage() {
  const { caseId } = Route.useParams();
  const { data: me } = useMe();
  const queryClient = useQueryClient();

  const fetchBundle = useServerFn(getCaseBundle);
  const fetchLawyers = useServerFn(listLawyers);
  const request = useServerFn(requestLawyer);

  const { data: bundle, isLoading } = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => fetchBundle({ data: { caseId } }),
  });
  const { data: lawyers = [] } = useQuery({ queryKey: ["lawyers"], queryFn: () => fetchLawyers() });

  const requestMutation = useMutation({
    mutationFn: (lawyerProfileId: string) => request({ data: { caseId, lawyerProfileId } }),
    onSuccess: () => {
      toast.success("Request sent to the advocate.");
      void queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <AppShell nav={CITIZEN_NAV}>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading the record…
        </p>
      </AppShell>
    );
  }

  const record = bundle?.record;
  if (!record) {
    return (
      <AppShell nav={CITIZEN_NAV}>
        <EmptyState title="Record unavailable" description="This matter is outside your access." />
      </AppShell>
    );
  }

  const wanted = bundle?.analysis?.recommended_specializations ?? [];
  const recommended = [...lawyers]
    .map((l) => ({
      lawyer: l,
      score: l.specializations.filter((s) => wanted.some((w) => s.toLowerCase().includes(w.toLowerCase())))
        .length,
    }))
    .sort((a, b) => b.score - a.score || b.lawyer.rating - a.lawyer.rating)
    .slice(0, 6);

  const requestedIds = new Set((bundle?.requests ?? []).map((r) => r.lawyer_profile_id));

  return (
    <AppShell nav={CITIZEN_NAV}>
      <SectionTitle
        eyebrow={record.case_number}
        title={record.title}
        description={`${record.category} · ${record.court ?? "Court to be assigned"} · filed ${formatDate(
          record.filed_on ?? record.created_at,
        )}`}
        action={
          <div className="flex gap-2">
            <UrgencyBadge urgency={record.urgency} />
            <StatusBadge status={record.status} />
          </div>
        }
      />

      <Tabs defaultValue="analysis" className="mt-8">
        <TabsList>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="advocates">Advocates</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-6">
          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <AnalysisPanel analysis={bundle?.analysis ?? null} />
            <AssistantPanel
              caseId={caseId}
              audience="citizen"
              suggestions={[
                "What does this mean for me in simple terms?",
                "What are my next steps?",
                "What documents should I arrange?",
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentsPanel documents={bundle?.documents ?? []} />
        </TabsContent>

        <TabsContent value="advocates" className="mt-6 space-y-4">
          {bundle?.assignedLawyer && (
            <Card>
              <CardContent className="pt-6">
                <p className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
                  Assigned advocate
                </p>
                <p className="mt-1 font-display text-xl">{bundle.assignedLawyer.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {bundle.assignedLawyer.specializations.join(" · ")}
                </p>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {recommended.map(({ lawyer }) => (
              <Card key={lawyer.id} className="elevate">
                <CardContent className="space-y-2 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg">{lawyer.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {lawyer.specializations.join(" · ")}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-gold">★ {lawyer.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{lawyer.bio}</p>
                  <div className="flex flex-wrap gap-3 font-mono text-[11px] text-muted-foreground">
                    <span>{lawyer.experience_years} yrs</span>
                    <span>{lawyer.cases_handled} matters</span>
                    <span>{lawyer.success_rate}% success</span>
                    <span>{formatFee(lawyer.consultation_fee)} consult</span>
                  </div>
                  <Button
                    className="w-full"
                    variant={requestedIds.has(lawyer.id) ? "outline" : "default"}
                    disabled={requestedIds.has(lawyer.id) || requestMutation.isPending}
                    onClick={() => requestMutation.mutate(lawyer.id)}
                  >
                    {requestedIds.has(lawyer.id) ? "Request sent" : "Request this advocate"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <div className="max-w-3xl">
            <MessagesPanel
              caseId={caseId}
              messages={bundle?.messages ?? []}
              currentUserId={me?.userId ?? ""}
              disabled={!record.assigned_lawyer_id}
              {...(record.assigned_lawyer_id
                ? {}
                : { disabledReason: "Messaging opens once an advocate accepts your matter." })}
            />
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
