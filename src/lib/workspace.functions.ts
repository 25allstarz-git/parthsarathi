import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { CaseRecord, Hearing, Precedent } from "./types";
import { demoCaseStore } from "./cases.functions";
import { ADVOCATE_DATABASE } from "./advocate-database";

const uuid = z.string().uuid();

/** Cases awaiting an advocate — the lawyer's intake queue. */
export const lawyerQueue = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CaseRecord[]> => {
    let dbCases: CaseRecord[] = [];
    try {
      const { data, error } = await context.supabase
        .from("cases")
        .select("*")
        .eq("status", "pending")
        .order("urgency", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(60);
      if (!error && data) dbCases = data as unknown as CaseRecord[];
    } catch {
      // ignore
    }

    const demoPending: CaseRecord[] = [];
    for (const item of demoCaseStore.values()) {
      if (item.record.status === "pending") {
        demoPending.push(item.record);
      }
    }

    const seen = new Set(dbCases.map((c) => c.id));
    const result = [...dbCases];
    for (const c of demoPending) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        result.push(c);
      }
    }
    return result;
  });

/** Cases the signed-in advocate is acting in. */
export const lawyerCases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CaseRecord[]> => {
    let dbCases: CaseRecord[] = [];
    try {
      const { data, error } = await context.supabase
        .from("cases")
        .select("*")
        .eq("assigned_lawyer_id", context.userId)
        .order("next_hearing", { ascending: true, nullsFirst: false });
      if (!error && data) dbCases = data as unknown as CaseRecord[];
    } catch {
      // ignore
    }

    const demoMine: CaseRecord[] = [];
    for (const item of demoCaseStore.values()) {
      if (item.record.assigned_lawyer_id === context.userId) {
        demoMine.push(item.record);
      }
    }

    const seen = new Set(dbCases.map((c) => c.id));
    const result = [...dbCases];
    for (const c of demoMine) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        result.push(c);
      }
    }
    return result;
  });

export const respondToCase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        caseId: uuid,
        decision: z.enum(["accepted", "rejected"]),
        note: z.string().trim().max(600).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    try {
      await context.supabase.rpc("respond_to_case", {
        _case_id: data.caseId,
        _decision: data.decision,
        ...(data.note ? { _note: data.note } : {}),
      });
    } catch {
      // ignore
    }

    if (demoCaseStore.has(data.caseId)) {
      const item = demoCaseStore.get(data.caseId)!;
      if (data.decision === "accepted") {
        item.record.status = "assigned";
        item.record.assigned_lawyer_id = context.userId;
        item.record.assigned_lawyer_profile_id = "a1000000-0000-0000-0000-000000000001";
        item.assignedLawyer = ADVOCATE_DATABASE[0];
      } else {
        if (item.record.assigned_lawyer_id === context.userId) {
          item.record.assigned_lawyer_id = null;
          item.record.assigned_lawyer_profile_id = null;
          item.record.status = "pending";
          item.assignedLawyer = null;
        }
      }
      for (const req of item.requests) {
        if (
          req.lawyer_id === context.userId ||
          req.lawyer_profile_id === "a1000000-0000-0000-0000-000000000001"
        ) {
          req.status = data.decision;
        }
      }
    }
    return { ok: true };
  });

/** Judicial docket — all listed cases visible to judicial officers. */
export const judicialDocket = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CaseRecord[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("cases")
      .select("*")
      .order("next_hearing", { ascending: true, nullsFirst: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as CaseRecord[];
  });

export const listHearings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ from: z.string().max(10).optional(), to: z.string().max(10).optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }): Promise<Hearing[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin.from("hearings").select("*").order("hearing_date", { ascending: true });
    if (data.from) query = query.gte("hearing_date", data.from);
    if (data.to) query = query.lte("hearing_date", data.to);
    const { data: rows, error } = await query.limit(200);
    if (error) throw new Error(error.message);
    return (rows ?? []) as unknown as Hearing[];
  });

export const listPrecedents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ search: z.string().trim().max(120).optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }): Promise<Precedent[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin.from("precedents").select("*").order("year", { ascending: false });
    if (data.search) {
      const term = `%${data.search.replace(/[%_]/g, "")}%`;
      query = query.or(`title.ilike.${term},citation.ilike.${term},category.ilike.${term}`);
    }
    const { data: rows, error } = await query.limit(60);
    if (error) throw new Error(error.message);
    return (rows ?? []) as unknown as Precedent[];
  });

/** Case status + hearing lookup for authorised law-enforcement users. */
export const enforcementSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ query: z.string().trim().min(2).max(80) }).parse(input),
  )
  .handler(
    async ({
      data,
      context,
    }): Promise<{ cases: CaseRecord[]; hearings: Hearing[] }> => {
      const term = `%${data.query.replace(/[%_]/g, "")}%`;
      const [cases, hearings] = await Promise.all([
        context.supabase
          .from("cases")
          .select("*")
          .or(`case_number.ilike.${term},filing_number.ilike.${term},title.ilike.${term}`)
          .limit(25),
        context.supabase
          .from("hearings")
          .select("*")
          .or(`case_number.ilike.${term},party_name.ilike.${term}`)
          .order("hearing_date", { ascending: true })
          .limit(25),
      ]);

      return {
        cases: (cases.data ?? []) as unknown as CaseRecord[],
        hearings: (hearings.data ?? []) as unknown as Hearing[],
      };
    },
  );

/** Direct engagement requests addressed to the signed-in advocate. */
export const lawyerRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(
    async ({
      context,
    }): Promise<Array<{ id: string; status: string; note: string | null; created_at: string; case: CaseRecord | null }>> => {
      let dbRequests: any[] = [];
      try {
        const { data, error } = await context.supabase
          .from("case_requests")
          .select("id, status, note, created_at, case:cases!case_requests_case_id_fkey(*)")
          .eq("lawyer_id", context.userId)
          .order("created_at", { ascending: false })
          .limit(50);
        if (!error && data) dbRequests = data;
      } catch {
        // ignore
      }

      const demoReqs: any[] = [];
      for (const item of demoCaseStore.values()) {
        for (const req of item.requests) {
          if (
            req.lawyer_id === context.userId ||
            req.lawyer_profile_id === "a1000000-0000-0000-0000-000000000001"
          ) {
            demoReqs.push({
              id: req.id,
              status: req.status,
              note: req.note,
              created_at: req.created_at,
              case: item.record,
            });
          }
        }
      }

      const seen = new Set(dbRequests.map((r) => r.id));
      const result = [...dbRequests];
      for (const r of demoReqs) {
        if (!seen.has(r.id)) {
          seen.add(r.id);
          result.push(r);
        }
      }
      return result;
    },
  );

/** Audit logging for judicial access and other sensitive actions. */
export const logAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        action: z.string().min(1).max(100),
        target: z.string().min(1).max(255),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    try {
      await context.supabase.from("access_log").insert({
        user_id: context.userId,
        action: data.action,
        target: data.target,
      });
    } catch {
      // Fire-and-forget, don't fail if log insert errors
    }
    return { ok: true };
  });

export const findSimilarPrecedents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ caseId: uuid }).parse(input),
  )
  .handler(async ({ data, context }) => {
    // 1. Fetch the case embedding
    const { data: embeddingData, error: embedError } = await context.supabase
      .from("case_embeddings")
      .select("embedding")
      .eq("case_id", data.caseId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (embedError || !embeddingData?.embedding) {
      return []; // Return empty if no embedding found
    }

    // 2. Call RPC to match precedents
    const { data: matches, error: matchError } = await context.supabase.rpc("match_precedents", {
      query_embedding: embeddingData.embedding,
      match_count: 8,
    });

    if (matchError) {
      console.error("Error finding similar precedents:", matchError);
      return [];
    }

    return matches || [];
  });
