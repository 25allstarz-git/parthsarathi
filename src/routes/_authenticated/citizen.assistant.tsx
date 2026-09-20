import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AssistantPanel } from "@/components/case-detail";
import { AiNotice, SectionTitle } from "@/components/brand";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listMyCases } from "@/lib/cases.functions";
import { CITIZEN_NAV } from "@/lib/nav";

export const Route = createFileRoute("/_authenticated/citizen/assistant")({
  component: CitizenAssistant,
});

function CitizenAssistant() {
  const fetchCases = useServerFn(listMyCases);
  const { data: cases = [] } = useQuery({ queryKey: ["my-cases"], queryFn: () => fetchCases() });
  const [caseId, setCaseId] = useState("none");

  return (
    <AppShell nav={CITIZEN_NAV}>
      <SectionTitle
        eyebrow="AI case assistant"
        title="Ask about your matter"
        description="Plain-language answers grounded in the documents and analysis already on your file."
      />

      <div className="mt-6 max-w-3xl space-y-4">
        <AiNotice />

        <div>
          <label className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Ground the answer in a matter
          </label>
          <Select value={caseId} onValueChange={setCaseId}>
            <SelectTrigger className="mt-2" aria-label="Choose a matter">
              <SelectValue placeholder="General questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">General questions about court procedure</SelectItem>
              {cases.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.case_number} — {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AssistantPanel
          key={caseId}
          {...(caseId !== "none" ? { caseId } : {})}
          audience="citizen"
          suggestions={[
            "What does my case mean in simple terms?",
            "What documents should I arrange before the first hearing?",
            "How long does a matter like this usually take?",
            "What should I ask an advocate at the first consultation?",
          ]}
        />
      </div>
    </AppShell>
  );
}
