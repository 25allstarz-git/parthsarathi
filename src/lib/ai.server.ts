/**
 * Server-only helpers that talk to the Lovable AI gateway.
 * Every output produced here is assistive and is labelled as such in the UI.
 */

const MODEL = process.env["GEMINI_MODEL"] || "gemini-flash-latest";

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "file"; file: { filename: string; file_data: string } };

type ChatMessage = { role: "system" | "user" | "assistant"; content: string | ContentPart[] };

export class AiUnavailableError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function chat(messages: ChatMessage[], jsonMode = false): Promise<string> {
  const key = process.env["GEMINI_API_KEY"];
  if (!key) throw new AiUnavailableError("Gemini API key is not configured.", 401);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

  const contents: any[] = [];
  let systemInstruction: any = undefined;

  for (const msg of messages) {
    if (msg.role === "system") {
      systemInstruction = {
        parts: [
          { text: typeof msg.content === "string" ? msg.content : msg.content.map((p) => (p as any).text).join(" ") },
        ],
      };
      continue;
    }

    const role = msg.role === "user" ? "user" : "model";
    let parts: any[] = [];

    if (typeof msg.content === "string") {
      parts = [{ text: msg.content }];
    } else {
      parts = msg.content.map((p) => {
        if (p.type === "text") return { text: p.text };

        let dataUrl = "";
        if (p.type === "image_url") dataUrl = p.image_url.url;
        else if (p.type === "file") dataUrl = p.file.file_data;

        if (dataUrl.startsWith("data:")) {
          const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
          if (match) {
            return { inlineData: { mimeType: match[1], data: match[2] } };
          }
        }
        return { text: "[Unparseable media file]" };
      });
    }

    contents.push({ role, parts });
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      ...(systemInstruction ? { systemInstruction } : {}),
      generationConfig: {
        ...(jsonMode ? { responseMimeType: "application/json" } : {}),
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Gemini API error", response.status, detail);
    if (response.status === 429) {
      throw new AiUnavailableError("AI assistant is temporarily unavailable, please try again shortly.", 429);
    }
    throw new AiUnavailableError("The analysis service could not process this request.", response.status);
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text;
}

export interface AnalysisResult {
  summary: string;
  category: string;
  urgency: "critical" | "high" | "medium" | "low";
  urgency_reason: string;
  extracted_facts: Array<{ label: string; value: string; source: string; confidence: number }>;
  key_dates: Array<{ date: string; event: string; source: string }>;
  parties: Array<{ role: string; name: string }>;
  legal_insights: Array<{ heading: string; detail: string; source: string }>;
  similar_cases: Array<{
    case_number: string;
    title: string;
    court: string;
    outcome: string;
    similarity: number;
  }>;
  precedents: Array<{ citation: string; title: string; holding: string; relevance: string }>;
  recommended_specializations: string[];
  suggested_title: string;
  suggested_court: string;
}

const ANALYSIS_SYSTEM = `You are the case-analysis engine of ParthSarathi, an Indian court-access platform.
You assist citizens by structuring their legal matter. You never issue a legal judgment or advice of finality.
Work strictly from the material supplied. Where a value is inferred rather than stated, say so in the source field.
Use Indian legal vocabulary, Indian courts, Indian statutes (IPC/BNS, CrPC/BNSS, CPC, Consumer Protection Act 2019,
Hindu Marriage Act, Negotiable Instruments Act, IT Act, Motor Vehicles Act) where relevant.
Respond with a single JSON object and nothing else, matching exactly this shape:
{"summary":string,"category":string,"urgency":"critical"|"high"|"medium"|"low","urgency_reason":string,
"extracted_facts":[{"label":string,"value":string,"source":string,"confidence":number}],
"key_dates":[{"date":string,"event":string,"source":string}],
"parties":[{"role":string,"name":string}],
"legal_insights":[{"heading":string,"detail":string,"source":string}],
"similar_cases":[{"case_number":string,"title":string,"court":string,"outcome":string,"similarity":number}],
"precedents":[{"citation":string,"title":string,"holding":string,"relevance":string}],
"recommended_specializations":[string],"suggested_title":string,"suggested_court":string}
"source" must name the document and location the value came from, e.g. "FIR copy, page 1" or "Inferred from complaint narrative".
confidence and similarity are numbers between 0 and 1. Provide 4-8 facts, 2-5 dates, 2-4 insights, 2-3 similar cases, 2-3 precedents.`;

export async function analyseCase(input: {
  description: string;
  category?: string;
  documents: Array<{ file_name: string; mime_type: string; data_url?: string; text?: string }>;
}): Promise<AnalysisResult> {
  const parts: ContentPart[] = [
    {
      type: "text",
      text: `Citizen's description of the matter:\n${input.description}\n\n${input.category ? `Citizen-selected category: ${input.category}\n\n` : ""
        }${input.documents.length
          ? `Attached documents follow: ${input.documents.map((d) => d.file_name).join(", ")}. Read every page, including scanned pages, and cite the document name in each "source" field.`
          : "No documents were attached; work from the description alone and say so in the source fields."
        }`,
    },
  ];

  for (const doc of input.documents.slice(0, 4)) {
    if (doc.data_url && doc.mime_type.startsWith("image/")) {
      parts.push({ type: "image_url", image_url: { url: doc.data_url } });
    } else if (doc.data_url && doc.mime_type === "application/pdf") {
      parts.push({ type: "file", file: { filename: doc.file_name, file_data: doc.data_url } });
    } else if (doc.text) {
      parts.push({
        type: "text",
        text: `--- ${doc.file_name} ---\n${doc.text.slice(0, 8000)}`,
      });
    }
  }

  const raw = await chat(
    [
      { role: "system", content: ANALYSIS_SYSTEM },
      { role: "user", content: parts },
    ],
    true,
  );

  return parseAnalysis(raw);
}

function parseAnalysis(raw: string): AnalysisResult {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  const parsed = JSON.parse(slice) as Partial<AnalysisResult>;

  const urgency = (["critical", "high", "medium", "low"] as const).includes(
    parsed.urgency as AnalysisResult["urgency"],
  )
    ? (parsed.urgency as AnalysisResult["urgency"])
    : "medium";

  return {
    summary: parsed.summary ?? "",
    category: parsed.category ?? "General",
    urgency,
    urgency_reason: parsed.urgency_reason ?? "",
    extracted_facts: parsed.extracted_facts ?? [],
    key_dates: parsed.key_dates ?? [],
    parties: parsed.parties ?? [],
    legal_insights: parsed.legal_insights ?? [],
    similar_cases: parsed.similar_cases ?? [],
    precedents: parsed.precedents ?? [],
    recommended_specializations: parsed.recommended_specializations ?? [],
    suggested_title: parsed.suggested_title ?? "New matter",
    suggested_court: parsed.suggested_court ?? "District Court",
  };
}

export async function askAssistant(input: {
  question: string;
  audience: "citizen" | "lawyer" | "judge";
  context: string;
  history: ChatMessage[];
}): Promise<string> {
  const persona =
    input.audience === "citizen"
      ? "You explain matters in plain, reassuring language to a citizen who is not a lawyer. Define legal terms simply."
      : input.audience === "lawyer"
        ? "You assist a practising Indian advocate. Be precise, cite statutes and case law, and flag procedural steps and limitation periods."
        : "You assist a judicial officer preparing for a hearing. Be neutral, structured, and focused on issues, submissions and the record.";

  return chat([
    {
      role: "system",
      content: `You are the ParthSarathi legal assistant for the Indian justice system. ${persona}
Ground every answer in the case record supplied below. ${
        input.audience === "citizen"
          ? "Speak naturally like a human assistant. Do not mention internal database field names, do not wrap values in backticks, and express all facts in plain language."
          : "When you rely on the record, quote the document or field you used for traceability."
      }
When something is not in the record, say so explicitly instead of assuming.
Close with a one-line reminder that this is AI assistance and not a legal judgment or a substitute for an advocate.

CASE RECORD:
${input.context || "(No case selected — answer generally about Indian court procedure.)"}`,
    },
    ...input.history.slice(-8),
    { role: "user", content: input.question },
  ]);
}

export async function embedText(text: string): Promise<number[]> {
  const key = process.env["GEMINI_API_KEY"];
  if (!key) throw new AiUnavailableError("Gemini API key is not configured.", 401);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${key}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { parts: [{ text }] },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Gemini Embed API error", response.status, detail);
      throw new AiUnavailableError("The embedding service could not process this request.", response.status);
    }

    const payload = await response.json();
    const embedding = payload?.embedding?.values ?? [];
    return embedding;
  } catch (error) {
    console.warn("Live Gemini embedding unavailable, using deterministic fallback for demo mode:", error);
    // Deterministic mock 768-d vector for demo mode
    const hash = text.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
    return Array.from({ length: 768 }, (_, i) => Math.sin(hash + i) * 0.1);
  }
}
