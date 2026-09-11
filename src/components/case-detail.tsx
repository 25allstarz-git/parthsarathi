import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AiNotice, EmptyState, SecureNotice } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { askCaseAssistant, sendCaseMessage, getDocumentDownloadUrl } from "@/lib/cases.functions";
import { formatBytes, formatDateTime, formatDate } from "@/lib/nyaysetu";
import ReactMarkdown from "react-markdown";
import type { CaseAnalysis, CaseDocument, CaseMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AnalysisPanel({ analysis }: { analysis: CaseAnalysis | null }) {
  if (!analysis) {
    return (
      <EmptyState
        icon={<Sparkles className="size-6" />}
        title="No analysis on record"
        description="This matter was filed without an AI analysis."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Plain-language summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground">{analysis.summary}</p>
          {analysis.urgency_reason && (
            <div className="rounded-md border border-border bg-surface p-3">
              <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                Why this urgency
              </p>
              <p className="mt-1.5 text-sm text-foreground">{analysis.urgency_reason}</p>
            </div>
          )}
          <AiNotice />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Extracted facts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.extracted_facts.map((fact, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    {fact.label}
                  </p>
                  <span className="font-mono text-[10px] text-gold">
                    {Math.round((fact.confidence ?? 0) * 100)}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground">{fact.value}</p>
                <p className="mt-1.5 text-xs text-muted-foreground italic">Source: {fact.source}</p>
                <Progress value={(fact.confidence ?? 0) * 100} className="mt-2 h-1" />
              </div>
            ))}
            {analysis.extracted_facts.length === 0 && (
              <p className="text-sm text-muted-foreground">No facts were extracted.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Key dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.key_dates.map((d, i) => (
                <div key={i} className="flex gap-3 border-l-2 border-gold/50 pl-3">
                  <div>
                    <p className="font-mono text-xs text-gold">{d.date}</p>
                    <p className="text-sm text-foreground">{d.event}</p>
                    <p className="text-xs text-muted-foreground italic">Source: {d.source}</p>
                  </div>
                </div>
              ))}
              {analysis.key_dates.length === 0 && (
                <p className="text-sm text-muted-foreground">No dates identified.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.parties.map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-surface px-3 py-2">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    {p.role}
                  </span>
                  <span className="text-sm text-foreground">{p.name}</span>
                </div>
              ))}
              {analysis.parties.length === 0 && (
                <p className="text-sm text-muted-foreground">No parties identified.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Legal context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis.legal_insights.map((insight, i) => (
            <div key={i}>
              <p className="text-sm font-medium text-foreground">{insight.heading}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{insight.detail}</p>
              <p className="mt-1 text-xs text-muted-foreground italic">Basis: {insight.source}</p>
              {i < analysis.legal_insights.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Similar matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.similar_cases.map((c, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-xs text-gold">{c.case_number}</p>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {Math.round((c.similarity ?? 0) * 100)}% similar
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.court}</p>
                <p className="mt-1.5 text-xs text-foreground">Outcome: {c.outcome}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Precedents cited</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.precedents.map((p, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <p className="font-mono text-xs text-gold">{p.citation}</p>
                <p className="mt-1 text-sm font-medium text-foreground">{p.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.holding}</p>
                <p className="mt-1.5 text-xs text-foreground italic">Relevance: {p.relevance}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DocumentsPanel({ documents }: { documents: CaseDocument[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const getUrl = useServerFn(getDocumentDownloadUrl);

  async function open(doc: CaseDocument) {
    if (!doc.storage_path) {
      toast.error("This document has no stored file.");
      return;
    }
    setBusy(doc.id);
    try {
      const res = await getUrl({ data: { documentId: doc.id } });
      window.open(res.url, "_blank", "noopener,noreferrer");
    } catch (error: any) {
      toast.error(error.message || "Could not open the document.");
    } finally {
      setBusy(null);
    }
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="size-6" />}
        title="No documents filed"
        description="No papers were uploaded with this matter."
      />
    );
  }

  return (
    <div className="space-y-3">
      <SecureNotice>
        Documents are stored in an access-controlled vault. Links expire after five minutes.
      </SecureNotice>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
        >
          <FileText className="size-5 shrink-0 text-gold" strokeWidth={1.6} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{doc.file_name}</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {formatBytes(doc.size_bytes)} · uploaded {formatDate(doc.created_at)}
            </p>
          </div>
          <Button variant="outline" size="sm" disabled={busy === doc.id} onClick={() => void open(doc)}>
            {busy === doc.id ? <Loader2 className="size-4 animate-spin" /> : "Open"}
          </Button>
        </div>
      ))}
    </div>
  );
}

export function MessagesPanel({
  caseId,
  messages,
  currentUserId,
  disabled,
  disabledReason,
}: {
  caseId: string;
  messages: CaseMessage[];
  currentUserId: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();
  const send = useServerFn(sendCaseMessage);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  useEffect(() => {
    const channel = supabase
      .channel(`case-messages-${caseId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "case_messages", filter: `case_id=eq.${caseId}` },
        () => queryClient.invalidateQueries({ queryKey: ["case", caseId] }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [caseId, queryClient]);

  const mutation = useMutation({
    mutationFn: (text: string) => send({ data: { caseId, body: text } }),
    onSuccess: () => {
      setBody("");
      void queryClient.invalidateQueries({ queryKey: ["case", caseId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Card className="flex h-[32rem] flex-col">
      <CardHeader className="border-b border-border">
        <CardTitle className="font-display text-lg">Secure messages</CardTitle>
        <SecureNotice>Visible only to the citizen and the assigned advocate.</SecureNotice>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation below.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2",
                  mine ? "bg-ink text-ink-foreground" : "border border-border bg-surface",
                )}
              >
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase opacity-70">
                  {m.sender_name}
                </p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{m.body}</p>
                <p className="mt-1 text-right font-mono text-[10px] opacity-60">
                  {formatDateTime(m.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </CardContent>
      <div className="border-t border-border p-3">
        {disabled ? (
          <p className="text-center text-xs text-muted-foreground">{disabledReason}</p>
        ) : (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const text = body.trim();
              if (!text) return;
              mutation.mutate(text);
            }}
          >
            <Input
              value={body}
              maxLength={4000}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write a message…"
            />
            <Button type="submit" size="icon" disabled={mutation.isPending || !body.trim()}>
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
}

export function AssistantPanel({
  caseId,
  audience,
  suggestions,
}: {
  caseId?: string;
  audience: "citizen" | "lawyer" | "judge";
  suggestions: string[];
}) {
  const [question, setQuestion] = useState("");
  const [thread, setThread] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const ask = useServerFn(askCaseAssistant);

  const mutation = useMutation({
    mutationFn: (q: string) =>
      ask({
        data: {
          ...(caseId ? { caseId } : {}),
          question: q,
          audience,
          history: thread.slice(-8),
        },
      }),
    onSuccess: (result, q) =>
      setThread((prev) => [
        ...prev,
        { role: "user", content: q },
        { role: "assistant", content: result.answer },
      ]),
    onError: (error: Error) => toast.error(error.message),
  });

  function submit(q: string) {
    const text = q.trim();
    if (!text) return;
    setQuestion("");
    mutation.mutate(text);
  }

  return (
    <Card className="flex h-[32rem] flex-col">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Sparkles className="size-4 text-gold" /> Legal assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 overflow-y-auto py-4">
        {thread.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ask about this matter. Answers are grounded in the filed record.
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
            <AiNotice />
          </div>
        )}
        {thread.map((m, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg px-3 py-2 text-sm",
              m.role === "user"
                ? "ml-auto max-w-[85%] bg-ink text-ink-foreground whitespace-pre-wrap"
                : "border border-border bg-surface",
            )}
          >
            {m.role === "assistant" ? (
              <div className="prose prose-sm prose-p:leading-relaxed prose-pre:p-0 dark:prose-inv...">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({ node, ...props }) => <ul className="mb-2 ml-4 list-disc space-y-1 las..." {...props} />,
                    ol: ({ node, ...props }) => <ol className="mb-2 ml-4 list-decimal space-y-1..." {...props} />,
                    li: ({ node, ...props }) => <li {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                    a: ({ node, ...props }) => <a className="text-primary underline underline-o..." {...props} />,
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            ) : (
              m.content
            )}
          </div>
        ))}
        {mutation.isPending && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Reading the record…
          </p>
        )}
      </CardContent>
      <div className="border-t border-border p-3">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit(question);
          }}
        >
          <Input
            value={question}
            maxLength={2000}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about this matter…"
          />
          <Button type="submit" size="icon" disabled={mutation.isPending || !question.trim()}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
