import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { listLawyerApplications, reviewLawyerApplication } from "@/lib/verification.functions";

export const Route = createFileRoute("/_authenticated/admin/verifications")({
  component: AdminVerifications,
});

function AdminVerifications() {
  const queryClient = useQueryClient();
  const list = useServerFn(listLawyerApplications);
  const review = useServerFn(reviewLawyerApplication);

  const { data, isLoading } = useQuery({
    queryKey: ["lawyer-applications"],
    queryFn: () => list({}),
  });

  const [pending, setPending] = useState<{ userId: string; decision: "verified" | "rejected" } | null>(
    null,
  );
  const [note, setNote] = useState("");

  const decide = useMutation({
    mutationFn: () =>
      review({
        data: {
          userId: pending?.userId ?? "",
          decision: pending?.decision ?? "rejected",
          ...(note.trim() ? { note: note.trim() } : {}),
        },
      }),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["lawyer-applications"] });
      toast.success(
        result.advocateCode
          ? `Approved. Advocate Code ${result.advocateCode} issued and sent to the applicant.`
          : "Application rejected. The applicant has been notified.",
      );
      setPending(null);
      setNote("");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <AppShell nav={[{ label: "Advocate verifications", to: "/admin/verifications" }]}>
      {isLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading applications…
        </p>
      ) : !data?.isAdmin ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            This area is restricted to ParthSarathi administrators.
          </CardContent>
        </Card>
      ) : data.applications.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No advocate applications yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.applications.map((application) => (
            <Card key={application.user_id}>
              <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-gold" strokeWidth={1.6} />
                    <p className="font-display text-lg">{application.full_name}</p>
                    <Badge
                      variant={
                        application.status === "verified"
                          ? "default"
                          : application.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {application.status}
                    </Badge>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    Enrolment {application.bar_council_number}
                  </p>
                  {application.applicant_email && (
                    <p className="text-xs text-muted-foreground">{application.applicant_email}</p>
                  )}
                  {application.documentUrl && (
                    <a
                      href={application.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
                    >
                      <ExternalLink className="size-3.5" />
                      {application.document_name ?? "View certificate"}
                    </a>
                  )}
                  {application.review_note && (
                    <p className="text-xs text-muted-foreground">Note: {application.review_note}</p>
                  )}
                </div>

                {application.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setPending({ userId: application.user_id, decision: "verified" })}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPending({ userId: application.user_id, decision: "rejected" })}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pending?.decision === "verified" ? "Approve this advocate?" : "Reject this application?"}
            </DialogTitle>
            <DialogDescription>
              {pending?.decision === "verified"
                ? "An Advocate Code will be generated and sent to the applicant, and their advocate workspace will be unlocked."
                : "The applicant will be notified and can correct their details and apply again."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="review-note">Note to the applicant (optional)</Label>
            <Input
              id="review-note"
              maxLength={600}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button disabled={decide.isPending} onClick={() => decide.mutate()}>
              {decide.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
