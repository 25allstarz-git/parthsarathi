import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AiNotice, SectionTitle, SecureNotice } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { createCaseWithAnalysis } from "@/lib/cases.functions";
import { LEGAL_CATEGORIES, PROCESSING_STEPS, formatBytes } from "@/lib/nyaysetu";
import { useMe } from "@/hooks/use-me";
import { CITIZEN_NAV } from "@/lib/nav";

export const Route = createFileRoute("/_authenticated/citizen/new")({
  component: NewCasePage,
});

const MAX_FILE = 8 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

function NewCasePage() {
  const navigate = useNavigate();
  const { data: me } = useMe();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(-1);

  const create = useServerFn(createCaseWithAnalysis);

  const mutation = useMutation({
    mutationFn: async () => {
      const userId = me?.userId;
      const documents: Array<{
        fileName: string;
        storagePath?: string;
        mimeType?: string;
        sizeBytes: number;
        dataUrl?: string;
        text?: string;
      }> = [];

      setStep(0);
      for (const file of files) {
        const dataUrl = await readAsDataUrl(file);
        documents.push({
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          dataUrl,
        });
      }

      setStep(2);
      const result = await create({
        data: {
          description,
          ...(category ? { category } : {}),
          documents,
        },
      });
      if ('error' in result && result.error === 'AI_BUSY') {
        throw new Error("The AI analysis engine is currently experiencing high traffic. Please wait a moment and try again.");
      }
      setStep(PROCESSING_STEPS.length);
      return result;
    },
    onSuccess: (result) => {
      if ('caseId' in result) {
        toast.success(`Matter registered as ${result.caseNumber}`);
        navigate({ to: "/citizen/case/$caseId", params: { caseId: result.caseId } });
      }
    },
    onError: (error: Error) => {
      setStep(-1);
      toast.error(error.message);
    },
  });

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next: File[] = [];
    for (const file of Array.from(list)) {
      if (file.size > MAX_FILE) {
        toast.error(`${file.name} is larger than 8 MB.`);
        continue;
      }
      if (!file.type.match(/^(image\/.*|application\/pdf)$/)) {
        toast.error(`${file.name} is not a supported format. Please upload PDF or image files only.`);
        continue;
      }
      next.push(file);
    }
    setFiles((prev) => [...prev, ...next].slice(0, 5));
  }

  const running = mutation.isPending;

  return (
    <AppShell nav={CITIZEN_NAV}>
      <SectionTitle
        eyebrow="Case intake"
        title="File a new matter"
        description="Describe what happened in your own words and attach any papers — FIR copies, notices, agreements, receipts."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-1.5">
              <Label htmlFor="description">What happened?</Label>
              <Textarea
                id="description"
                rows={9}
                maxLength={6000}
                disabled={running}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include dates, people involved, what you have already done, and what relief you are seeking."
              />
              <p className="text-right font-mono text-[10px] text-muted-foreground">
                {description.length}/6000
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Category (optional — we will confirm it)</Label>
              <Select value={category} onValueChange={setCategory} disabled={running}>
                <SelectTrigger>
                  <SelectValue placeholder="Let ParthSarathi decide" />
                </SelectTrigger>
                <SelectContent>
                  {LEGAL_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Documents (PDF or images, up to 8 MB each)</Label>
              <label
                htmlFor="files"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 py-8 text-center"
              >
                <Upload className="size-5 text-gold" strokeWidth={1.6} />
                <p className="mt-2 text-sm text-foreground">Click to attach documents</p>
                <p className="text-xs text-muted-foreground">
                  Scanned pages are read with OCR before analysis
                </p>
                <input
                  id="files"
                  type="file"
                  multiple
                  accept="application/pdf,image/*"
                  className="hidden"
                  disabled={running}
                  onChange={(e) => addFiles(e.target.files)}
                />
              </label>

              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center gap-3 rounded-md border border-border bg-card p-2.5"
                >
                  <FileText className="size-4 text-gold" />
                  <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {formatBytes(file.size)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={running}
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <SecureNotice>
              Files are encrypted in an access-controlled vault visible only to you and an advocate you
              engage.
            </SecureNotice>

            <Button
              className="w-full"
              disabled={running || (description.trim().length < 30 && files.length === 0)}
              onClick={() => mutation.mutate()}
            >
              {running && <Loader2 className="mr-2 size-4 animate-spin" />}
              Submit for analysis
            </Button>
            {description.trim().length < 30 && files.length === 0 && (
              <p className="text-center text-xs text-muted-foreground">
                Add a case description or attach at least one document.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <p className="font-display text-lg">Processing pipeline</p>
            <ol className="space-y-3">
              {PROCESSING_STEPS.map((s, i) => {
                const done = step >= i && step >= 0;
                const activeStep = running && step === i;
                return (
                  <li key={s.key} className="flex gap-3">
                    <span className="mt-0.5">
                      {done && !activeStep ? (
                        <CheckCircle2 className="size-4 text-success" />
                      ) : activeStep ? (
                        <Loader2 className="size-4 animate-spin text-gold" />
                      ) : (
                        <span className="block size-4 rounded-full border border-border" />
                      )}
                    </span>
                    <span>
                      <span className="block text-sm text-foreground">{s.label}</span>
                      <span className="block text-xs text-muted-foreground">{s.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <AiNotice>
              Analysis is generated by AI to help you understand and organise your matter. It is not
              legal advice and does not bind any court.
            </AiNotice>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
