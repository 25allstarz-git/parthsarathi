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
import { ADVOCATE_DATABASE, getAdvocateById } from "./advocate-database";

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

export interface DemoCaseStoreItem {
  record: CaseRecord;
  documents: CaseDocument[];
  analysis: CaseAnalysis | null;
  requests: CaseRequest[];
  messages: CaseMessage[];
  assignedLawyer?: LawyerProfile | null;
}

export const demoCaseStore = new Map<string, DemoCaseStoreItem>();
export const demoNotifications: AppNotification[] = [];

export const listMyCases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CaseRecord[]> => {
    let dbCases: CaseRecord[] = [];
    try {
      const { data, error } = await context.supabase
        .from("cases")
        .select("*")
        .eq("citizen_id", context.userId)
        .order("created_at", { ascending: false });
      if (!error && data) dbCases = data as unknown as CaseRecord[];
    } catch {
      // ignore
    }

    const localCases = Array.from(demoCaseStore.values())
      .map((item) => item.record)
      .filter((r) => !dbCases.some((c) => c.id === r.id));

    return [...localCases, ...dbCases];
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
      let record: CaseRecord | null = null;
      let documents: CaseDocument[] = [];
      let analysis: CaseAnalysis | null = null;
      let requests: CaseRequest[] = [];
      let messages: CaseMessage[] = [];
      let assignedLawyer: LawyerProfile | null = null;

      try {
        const { data: dbRecord } = await supabase.from("cases").select("*").eq("id", data.caseId).maybeSingle();
        if (dbRecord) {
          record = dbRecord as unknown as CaseRecord;
          const [docsRes, analysisRes, reqRes, msgRes] = await Promise.all([
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
          documents = (docsRes.data ?? []) as unknown as CaseDocument[];
          analysis = (analysisRes.data ?? null) as unknown as CaseAnalysis | null;
          requests = (reqRes.data ?? []) as unknown as CaseRequest[];
          messages = (msgRes.data ?? []) as unknown as CaseMessage[];

          const profileId = (record as { assigned_lawyer_profile_id?: string | null })
            .assigned_lawyer_profile_id;
          if (profileId) {
            const { data: lp } = await supabase
              .from("lawyer_profiles")
              .select("*")
              .eq("id", profileId)
              .maybeSingle();
            assignedLawyer = (lp as LawyerProfile | null) ?? getAdvocateById(profileId) ?? null;
          }

          // Ensure requests have full lawyer profile
          requests = requests.map((r) => ({
            ...r,
            lawyer: r.lawyer || (r.lawyer_profile_id ? getAdvocateById(r.lawyer_profile_id) : null),
          }));

          // Merge any in-memory requests or messages
          if (demoCaseStore.has(data.caseId)) {
            const item = demoCaseStore.get(data.caseId)!;
            const existingReqIds = new Set(requests.map((r) => r.id));
            for (const r of item.requests) {
              if (!existingReqIds.has(r.id)) {
                requests.unshift({
                  ...r,
                  lawyer: r.lawyer || (r.lawyer_profile_id ? getAdvocateById(r.lawyer_profile_id) : null),
                });
              }
            }
            const existingMsgIds = new Set(messages.map((m) => m.id));
            for (const m of item.messages) {
              if (!existingMsgIds.has(m.id)) {
                messages.push(m);
              }
            }
          }
        }
      } catch {
        // ignore
      }

      if (!record && demoCaseStore.has(data.caseId)) {
        const item = demoCaseStore.get(data.caseId)!;
        return {
          record: item.record,
          documents: item.documents,
          analysis: item.analysis,
          requests: item.requests.map((r) => ({
            ...r,
            lawyer: r.lawyer || (r.lawyer_profile_id ? getAdvocateById(r.lawyer_profile_id) : null),
          })),
          messages: item.messages,
          assignedLawyer: item.assignedLawyer ?? (item.record.assigned_lawyer_id ? getAdvocateById(item.record.assigned_lawyer_id) : null) ?? null,
        };
      }

      return {
        record,
        documents,
        analysis,
        requests,
        messages,
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Server-side document upload
    for (const d of data.documents) {
      if (d.dataUrl) {
        try {
          const base64Data = d.dataUrl.split(",")[1] || d.dataUrl;
          const buffer = Buffer.from(base64Data, "base64");
          const sanitizedFileName = d.fileName.replace(/[^\w.\-]/g, "_");
          const path = `${userId || "demo"}/${crypto.randomUUID()}-${sanitizedFileName}`;
          
          const { error } = await supabaseAdmin.storage.from("case-documents").upload(path, buffer, {
            contentType: d.mimeType || "application/octet-stream",
          });
          
          if (error) {
            console.warn(`Server-side upload failed for ${d.fileName}:`, error.message);
            d.storagePath = undefined;
          } else {
            d.storagePath = path;
          }
        } catch (err) {
          console.warn(`Failed to process document upload for ${d.fileName}:`, err);
          d.storagePath = undefined;
        }
      }
    }

    const { analyseCase, AiUnavailableError, embedText } = await import("./ai.server");

    let analysis;
    let usedFallback = false;
    
    let retries = 0;
    const maxRetries = 3;
    let backoffTime = 2000;
    
    while (true) {
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
        break; // Success
      } catch (error: any) {
        if (error?.status === 429 || error?.status === 503) {
          if (retries < maxRetries) {
            console.warn(`Gemini API busy (Status ${error.status}), retrying in ${backoffTime}ms (Attempt ${retries + 1}/${maxRetries})`);
            await new Promise((resolve) => setTimeout(resolve, backoffTime));
            backoffTime *= 2;
            retries++;
            continue;
          }
        }
        
        console.warn("Live Gemini analysis unavailable (quota exceeded or offline), using deterministic legal analysis engine:", error);
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
        break;
      }
    }

    const category = data.category || analysis.category;
    const caseNumber = caseNumberFor(category);
    const filingNumber = `PS/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 899999)}`;
    const caseId = crypto.randomUUID();

    const caseRecord: CaseRecord = {
      id: caseId,
      case_number: caseNumber,
      filing_number: filingNumber,
      title: analysis.suggested_title,
      description: data.description,
      category,
      urgency: analysis.urgency,
      status: "pending",
      court: data.court || analysis.suggested_court,
      parties: analysis.parties,
      citizen_id: userId,
      assigned_lawyer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const caseDocs: CaseDocument[] = data.documents.map((d) => ({
      id: crypto.randomUUID(),
      case_id: caseId,
      file_name: d.fileName,
      storage_path: d.storagePath ?? null,
      mime_type: d.mimeType ?? "application/pdf",
      size_bytes: d.sizeBytes,
      ocr_text: d.text ?? null,
      uploaded_by: userId,
      created_at: new Date().toISOString(),
    }));

    const caseAnalysisRecord: CaseAnalysis = {
      id: crypto.randomUUID(),
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
      model: usedFallback ? "nyaysetu/deterministic-analysis-v1" : "google/gemini-3.5-flash",
      created_at: new Date().toISOString(),
    };

    // Try inserting into Supabase if accessible
    try {
      const { data: inserted, error: dbErr } = await supabase
        .from("cases")
        .insert({
          case_number: caseRecord.case_number,
          filing_number: caseRecord.filing_number,
          title: caseRecord.title,
          description: caseRecord.description,
          category: caseRecord.category,
          urgency: caseRecord.urgency,
          status: "pending",
          court: caseRecord.court,
          parties: caseRecord.parties,
          citizen_id: userId,
        })
        .select("*")
        .single();

      if (!dbErr && inserted) {
        const realId = (inserted as { id: string }).id;
        caseRecord.id = realId;
        try {
          if (data.documents.length) {
            await supabase.from("case_documents").insert(
              data.documents.map((d) => ({
                case_id: realId,
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
            case_id: realId,
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
            model: usedFallback ? "nyaysetu/deterministic-analysis-v1" : "google/gemini-3.5-flash",
          });
          
          try {
            const embedInput = `${analysis.summary} ${JSON.stringify(analysis.extracted_facts)}`;
            const embedding = await embedText(embedInput);
            if (embedding && embedding.length === 768) {
              await supabase.from("case_embeddings").insert({
                case_id: realId,
                embedding: `[${embedding.join(",")}]`,
              });
            }
          } catch (e) {
            console.warn("Failed to generate or save case embedding:", e);
          }

          await supabase.from("notifications").insert({
            user_id: userId,
            title: "Case analysis ready",
            body: `${caseNumber} has been analysed and categorised as ${analysis.category}.`,
            kind: "success",
            case_id: realId,
          });
        } catch {
          // ignore nested DB error
        }
      }
    } catch {
      // ignore Supabase RLS error in demo mode
    }

    // Always record in demoCaseStore as well for instant, reliable retrieval
    demoCaseStore.set(caseRecord.id, {
      record: caseRecord,
      documents: caseDocs,
      analysis: caseAnalysisRecord,
      requests: [],
      messages: [],
    });

    demoNotifications.unshift({
      id: crypto.randomUUID(),
      user_id: userId,
      title: "Case analysis ready",
      body: `${caseNumber} has been analysed and categorised as ${analysis.category}.`,
      kind: "success",
      read: false,
      case_id: caseRecord.id,
      created_at: new Date().toISOString(),
    });

    return { caseId: caseRecord.id, caseNumber };
  });

export const listLawyers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LawyerProfile[]> => {
    let dbLawyers: LawyerProfile[] = [];
    try {
      const { data, error } = await context.supabase
        .from("lawyer_profiles")
        .select("*")
        .eq("is_available", true)
        .order("rating", { ascending: false });
      if (!error && data && data.length > 0) {
        dbLawyers = data as unknown as LawyerProfile[];
      }
    } catch {
      // ignore Supabase RLS / network errors
    }

    // Merge database profiles with verified advocate directory
    const seen = new Set<string>();
    const result: LawyerProfile[] = [];

    for (const l of dbLawyers) {
      if (!seen.has(l.id)) {
        seen.add(l.id);
        result.push(l);
      }
    }
    for (const l of ADVOCATE_DATABASE) {
      if (!seen.has(l.id)) {
        seen.add(l.id);
        result.push(l);
      }
    }

    return result.sort((a, b) => b.rating - a.rating);
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
    let lawyer: LawyerProfile | null = null;

    try {
      const { data: dbLawyer } = await supabase
        .from("lawyer_profiles")
        .select("*")
        .eq("id", data.lawyerProfileId)
        .maybeSingle();
      if (dbLawyer) lawyer = dbLawyer as unknown as LawyerProfile;
    } catch {
      // ignore
    }

    if (!lawyer) {
      lawyer = getAdvocateById(data.lawyerProfileId) ?? null;
    }

    if (!lawyer) throw new Error("Advocate not found.");
    if (!lawyer.is_available) throw new Error("This advocate is currently unavailable.");

    // Attempt Supabase insert if available
    try {
      await supabase.from("case_requests").insert({
        case_id: data.caseId,
        citizen_id: userId,
        lawyer_id: lawyer.user_id,
        lawyer_profile_id: data.lawyerProfileId,
        status: "pending",
        note: data.note ?? null,
      });

      await supabase.from("notifications").insert({
        user_id: userId,
        title: "Request sent",
        body: `Your case was shared with ${lawyer.full_name}. You can message them once they respond.`,
        kind: "info",
        case_id: data.caseId,
      });
    } catch {
      // ignore DB RLS in demo mode
    }

    // Always update demoCaseStore so request appears immediately in UI
    const caseItem = demoCaseStore.get(data.caseId);
    if (caseItem) {
      const existingReqIndex = caseItem.requests.findIndex(
        (r) => r.lawyer_profile_id === data.lawyerProfileId,
      );
      const reqRecord: CaseRequest = {
        id: crypto.randomUUID(),
        case_id: data.caseId,
        citizen_id: userId,
        lawyer_id: lawyer.user_id,
        lawyer_profile_id: data.lawyerProfileId,
        status: "pending",
        note: data.note ?? null,
        created_at: new Date().toISOString(),
        lawyer,
      };

      if (existingReqIndex >= 0) {
        caseItem.requests[existingReqIndex] = reqRecord;
      } else {
        caseItem.requests.unshift(reqRecord);
      }
    }

    demoNotifications.unshift({
      id: crypto.randomUUID(),
      user_id: userId,
      title: "Request sent",
      body: `Your case was shared with ${lawyer.full_name}. You can message them once they respond.`,
      kind: "info",
      read: false,
      case_id: data.caseId,
      created_at: new Date().toISOString(),
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

    const msg: CaseMessage = {
      id: crypto.randomUUID(),
      case_id: data.caseId,
      sender_id: userId,
      sender_name: profile?.full_name || "Demo Citizen",
      sender_role: (roleRow?.role ?? "citizen") as "citizen" | "lawyer" | "judge" | "law_enforcement",
      body: data.body,
      attachment_name: data.attachmentName ?? null,
      attachment_path: data.attachmentPath ?? null,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from("case_messages").insert({
        case_id: data.caseId,
        sender_id: userId,
        sender_name: msg.sender_name,
        sender_role: msg.sender_role,
        body: msg.body,
        attachment_name: msg.attachment_name,
        attachment_path: msg.attachment_path,
      });
    } catch {
      // ignore DB RLS in demo mode
    }

    if (demoCaseStore.has(data.caseId)) {
      demoCaseStore.get(data.caseId)!.messages.push(msg);
    }
    return { ok: true };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AppNotification[]> => {
    let dbNotifs: AppNotification[] = [];
    try {
      const { data, error } = await context.supabase
        .from("notifications")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (!error && data) dbNotifs = data as unknown as AppNotification[];
    } catch {
      // ignore
    }
    return [...demoNotifications, ...dbNotifs];
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
        return {
          answer: "ParthSarathi Assistant: For matters under Indian Law, ensure all relevant records and notices are preserved. You can connect with verified advocates through 'Find an advocate'. (Note: Configure GEMINI_API_KEY in .env for custom AI-generated responses)."
        };
      }
      return {
        answer: "I am ready to help you navigate your matter and hearings."
      };
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

export const getJudicialCaseBundle = createServerFn({ method: "GET" })
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
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      let record: CaseRecord | null = null;
      let documents: CaseDocument[] = [];
      let analysis: CaseAnalysis | null = null;
      let requests: CaseRequest[] = [];
      let messages: CaseMessage[] = [];
      let assignedLawyer: LawyerProfile | null = null;

      try {
        const { data: dbRecord } = await supabaseAdmin.from("cases").select("*").eq("id", data.caseId).maybeSingle();
        if (dbRecord) {
          record = dbRecord as unknown as CaseRecord;
          const [docsRes, analysisRes, reqRes, msgRes] = await Promise.all([
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
          documents = (docsRes.data ?? []) as unknown as CaseDocument[];
          analysis = (analysisRes.data ?? null) as unknown as CaseAnalysis | null;
          requests = (reqRes.data ?? []) as unknown as CaseRequest[];
          messages = (msgRes.data ?? []) as unknown as CaseMessage[];

          const profileId = (record as { assigned_lawyer_profile_id?: string | null })
            .assigned_lawyer_profile_id;
          if (profileId) {
            const { data: lp } = await supabase
              .from("lawyer_profiles")
              .select("*")
              .eq("id", profileId)
              .maybeSingle();
            assignedLawyer = (lp as LawyerProfile | null) ?? getAdvocateById(profileId) ?? null;
          }

          // Ensure requests have full lawyer profile
          requests = requests.map((r) => ({
            ...r,
            lawyer: r.lawyer || (r.lawyer_profile_id ? getAdvocateById(r.lawyer_profile_id) : null),
          }));

          // Merge any in-memory requests or messages
          if (demoCaseStore.has(data.caseId)) {
            const item = demoCaseStore.get(data.caseId)!;
            const existingReqIds = new Set(requests.map((r) => r.id));
            for (const r of item.requests) {
              if (!existingReqIds.has(r.id)) {
                requests.unshift({
                  ...r,
                  lawyer: r.lawyer || (r.lawyer_profile_id ? getAdvocateById(r.lawyer_profile_id) : null),
                });
              }
            }
            const existingMsgIds = new Set(messages.map((m) => m.id));
            for (const m of item.messages) {
              if (!existingMsgIds.has(m.id)) {
                messages.push(m);
              }
            }
          }
        }
      } catch {
        // ignore
      }

      if (!record && demoCaseStore.has(data.caseId)) {
        const item = demoCaseStore.get(data.caseId)!;
        return {
          record: item.record,
          documents: item.documents,
          analysis: item.analysis,
          requests: item.requests.map((r) => ({
            ...r,
            lawyer: r.lawyer || (r.lawyer_profile_id ? getAdvocateById(r.lawyer_profile_id) : null),
          })),
          messages: item.messages,
          assignedLawyer: item.assignedLawyer ?? (item.record.assigned_lawyer_id ? getAdvocateById(item.record.assigned_lawyer_id) : null) ?? null,
        };
      }

      return {
        record,
        documents,
        analysis,
        requests,
        messages,
        assignedLawyer,
      };
    },
  );

