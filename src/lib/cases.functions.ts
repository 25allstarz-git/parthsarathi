import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  AppNotification,
  CaseAnalysis,
  CaseDocument,
  CaseMessage,
  CaseRecord,
  CaseRequest,
  LawyerProfile,
} from "./types";

const uuid = z.string().uuid();

function caseNumberFor(category: string): string {
  const year = new Date().getFullYear();
  const serial = Math.floor(100 + Math.random() * 8900);
  const prefixes: Record<string, string> = {
    "Constitutional Law": "W.P.(C)",
    "Criminal Law": "CRL.M.C.",
    "Family Law": "HMA",
    "Property Law": "O.S.",
    "Consumer Protection": "CC",
    "Labour & Employment": "ID",
    "Motor Accident Claims": "MACP",
    "Cyber Law": "CRL.M.C.",
    "Corporate Law": "ARB.P.",
    "Tax & Revenue": "T.A.",
  };
  return `${prefixes[category] ?? "C.S."} ${serial}/${year}`;
}

export const listMyCases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CaseRecord[]> => {
    const { data, error } = await context.supabase
      .from("cases")
      .select("*")
      .eq("citizen_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as CaseRecord[];
  });

export const getCaseBundle = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ caseId: uuid }).parse(input))
  .handler(
    async ({
      data,
      context,
    }): Promise<{
      record: CaseRecord | null;
      documents: CaseDocument[];
      analysis: CaseAnalysis | null;
      requests: CaseRequest[];
      messages: CaseMessage[];
      assignedLawyer: LawyerProfile | null;
    }> => {
      const { supabase } = context;
      const { data: record } = await supabase.from("cases").select("*").eq("id", data.caseId).maybeSingle();
      if (!record) {
        return {
          record: null,
          documents: [],
          analysis: null,
          requests: [],
          messages: [],
          assignedLawyer: null,
        };
      }

      const [documents, analysis, requests, messages] = await Promise.all([
        supabase
          .from("case_documents")
          .select("*")
          .eq("case_id", data.caseId)
          .order("created_at", { ascending: true }),
        supabase
          .from("case_analyses")
          .select("*")
          .eq("case_id", data.caseId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("case_requests")
          .select("*, lawyer:lawyer_profiles!case_requests_lawyer_profile_id_fkey(*)")
          .eq("case_id", data.caseId)
          .order("created_at", { ascending: false }),
        supabase
          .from("case_messages")
          .select("*")
          .eq("case_id", data.caseId)
          .order("created_at", { ascending: true }),
      ]);

      let assignedLawyer: LawyerProfile | null = null;
      const profileId = (record as { assigned_lawyer_profile_id?: string | null })
        .assigned_lawyer_profile_id;
      if (profileId) {
        const { data: lp } = await supabase
          .from("lawyer_profiles")
          .select("*")
          .eq("id", profileId)
          .maybeSingle();
        assignedLawyer = (lp as LawyerProfile | null) ?? null;
      }

      return {
        record: record as unknown as CaseRecord,
        documents: (documents.data ?? []) as unknown as CaseDocument[],
        analysis: (analysis.data ?? null) as unknown as CaseAnalysis | null,
        requests: (requests.data ?? []) as unknown as CaseRequest[],
        messages: (messages.data ?? []) as unknown as CaseMessage[],
        assignedLawyer,
      };
    },
  );

export const createCaseWithAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        description: z.string().trim().max(6000).optional().default(""),
        category: z.string().trim().max(60).optional(),
        court: z.string().trim().max(120).optional(),
        documents: z
          .array(
            z.object({
              fileName: z.string().max(200),
              storagePath: z.string().max(400).optional(),
              mimeType: z.string().max(120).optional(),
              sizeBytes: z.number().int().min(0).max(30_000_000),
              dataUrl: z.string().max(12_000_000).optional(),
              text: z.string().max(200_000).optional(),
            }),
          )
          .max(10),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { analyseCase, AiUnavailableError } = await import("./ai.server");

    let analysis;
    let usedFallback = false;
    try {
      analysis = await analyseCase({
        description: data.description,
        category: data.category ?? "",
        documents: data.documents.map((d) => ({
          file_name: d.fileName,
          mime_type: d.mimeType ?? "application/octet-stream",
          ...(d.dataUrl ? { data_url: d.dataUrl } : {}),
          ...(d.text ? { text: d.text } : {}),
        })),
      });
    } catch (error) {
      if (error instanceof AiUnavailableError) {
        throw new Error(error.message);
      }
      console.error("analysis failed", error);
      // Deterministic fallback so intake always completes; swap-in point for any provider.
      const { demoAnalysis } = await import("./demo-analysis.server");
      analysis = demoAnalysis({
        description: data.description,
        ...(data.category ? { category: data.category } : {}),
        documents: data.documents.map((d) => ({
          file_name: d.fileName,
          mime_type: d.mimeType ?? "application/octet-stream",
        })),
      });
      usedFallback = true;
    }

    const category = data.category || analysis.category;
    const { data: inserted, error } = await supabase
      .from("cases")
      .insert({
        case_number: caseNumberFor(category),
        filing_number: `PS/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 899999)}`,
        title: analysis.suggested_title,
        description: data.description,
        category,
        urgency: analysis.urgency,
        status: "pending",
        court: data.court || analysis.suggested_court,
        parties: analysis.parties,
        citizen_id: userId,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    const caseId = (inserted as { id: string }).id;

    if (data.documents.length) {
      await supabase.from("case_documents").insert(
        data.documents.map((d) => ({
          case_id: caseId,
          file_name: d.fileName,
          storage_path: d.storagePath ?? null,
          mime_type: d.mimeType ?? null,
          size_bytes: d.sizeBytes,
          ocr_text: d.text ?? null,
          uploaded_by: userId,
        })),
      );
    }

    await supabase.from("case_analyses").insert({
      case_id: caseId,
      summary: analysis.summary,
      category: analysis.category,
      urgency: analysis.urgency,
      urgency_reason: analysis.urgency_reason,
      extracted_facts: analysis.extracted_facts,
      key_dates: analysis.key_dates,
      parties: analysis.parties,
      legal_insights: analysis.legal_insights,
      similar_cases: analysis.similar_cases,
      precedents: analysis.precedents,
      recommended_specializations: analysis.recommended_specializations,
      model: usedFallback ? "nyaysetu/deterministic-analysis-v1" : "google/gemini-3.7-flash",
    });

    await supabase.from("notifications").insert({
      user_id: userId,
      title: "Case analysis ready",
      body: `${(inserted as { case_number: string }).case_number} has been analysed and categorised as ${analysis.category}.`,
      kind: "success",
      case_id: caseId,
    });

    return { caseId, caseNumber: (inserted as { case_number: string }).case_number };
  });

export const listLawyers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LawyerProfile[]> => {
    const { data, error } = await context.supabase
      .from("lawyer_profiles")
      .select("*")
      .eq("is_available", true)
      .order("rating", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as LawyerProfile[];
  });

export const requestLawyer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        caseId: uuid,
        lawyerProfileId: uuid,
        note: z.string().trim().max(600).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: lawyer } = await supabase
      .from("lawyer_profiles")
      .select("id, user_id, full_name, is_available")
      .eq("id", data.lawyerProfileId)
      .maybeSingle();
    if (!lawyer) throw new Error("Advocate not found.");
    if (!(lawyer as { is_available: boolean }).is_available)
      throw new Error("This advocate is currently unavailable.");

    const { error } = await supabase.from("case_requests").insert({
      case_id: data.caseId,
      citizen_id: userId,
      lawyer_id: (lawyer as { user_id: string | null }).user_id,
      lawyer_profile_id: data.lawyerProfileId,
      status: "pending",
      note: data.note ?? null,
    });
    if (error) throw new Error(error.message);

    await supabase.from("notifications").insert({
      user_id: userId,
      title: "Request sent",
      body: `Your case was shared with ${(lawyer as { full_name: string }).full_name}. You can message them once they respond.`,
      kind: "info",
      case_id: data.caseId,
    });

    return { ok: true };
  });

export const withdrawRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ requestId: uuid }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("case_requests")
      .update({ status: "rejected", note: "Withdrawn by the citizen" })
      .eq("id", data.requestId)
      .eq("citizen_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendCaseMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        caseId: uuid,
        body: z.string().trim().min(1).max(4000),
        attachmentName: z.string().max(200).optional(),
        attachmentPath: z.string().max(400).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: roleRow }] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle(),
    ]);

    const { error } = await supabase.from("case_messages").insert({
      case_id: data.caseId,
      sender_id: userId,
      sender_name: profile?.full_name || "Member",
      sender_role: (roleRow?.role ?? "citizen") as "citizen" | "lawyer" | "judge" | "law_enforcement",
      body: data.body,
      attachment_name: data.attachmentName ?? null,
      attachment_path: data.attachmentPath ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AppNotification[]> => {
    const { data, error } = await context.supabase
      .from("notifications")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as AppNotification[];
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", context.userId)
      .eq("is_read", false);
    return { ok: true };
  });

export const askCaseAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        caseId: uuid.optional(),
        question: z.string().trim().min(3).max(2000),
        audience: z.enum(["citizen", "lawyer", "judge"]),
        history: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
          .max(10)
          .optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<{ answer: string }> => {
    const { supabase } = context;
    let contextText = "";

    if (data.caseId) {
      const { data: record } = await supabase.from("cases").select("*").eq("id", data.caseId).maybeSingle();
      const { data: analysis } = await supabase
        .from("case_analyses")
        .select("*")
        .eq("case_id", data.caseId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const { data: docs } = await supabase
        .from("case_documents")
        .select("file_name, ocr_text")
        .eq("case_id", data.caseId);

      contextText = JSON.stringify({ case: record, analysis, documents: docs }).slice(0, 24000);
    }

    const { askAssistant, AiUnavailableError } = await import("./ai.server");
    try {
      const answer = await askAssistant({
        question: data.question,
        audience: data.audience,
        context: contextText,
        history: (data.history ?? []).map((m) => ({ role: m.role, content: m.content })),
      });
      return { answer };
    } catch (error) {
      if (error instanceof AiUnavailableError) {
        throw new Error(error.message);
      }
      console.error("assistant failed", error);
      throw new Error("AI assistant is temporarily unavailable, please try again shortly.");
    }
  });

export const getDocumentDownloadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ documentId: uuid }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const { data: doc, error } = await supabase
      .from("case_documents")
      .select("storage_path")
      .eq("id", data.documentId)
      .single();

    if (error || !doc?.storage_path) {
      throw new Error("Document not found or access denied.");
    }

    const serviceClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: signed, error: signError } = await serviceClient.storage
      .from("case-documents")
      .createSignedUrl(doc.storage_path, 600);

    if (signError || !signed) {
      throw new Error("Failed to generate secure download link.");
    }

    return { url: signed.signedUrl };
  });
