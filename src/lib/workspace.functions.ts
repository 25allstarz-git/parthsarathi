import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { CaseRecord, Hearing, Precedent } from "./types";

const uuid = z.string().uuid();

/** Cases awaiting an advocate — the lawyer's intake queue. */
export const lawyerQueue = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CaseRecord[]> => {
    const { data, error } = await context.supabase
      .from("cases")
      .select("*")
      .eq("status", "pending")
      .order("urgency", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as CaseRecord[];
  });

/** Cases the signed-in advocate is acting in. */
export const lawyerCases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CaseRecord[]> => {
    const { data, error } = await context.supabase
      .from("cases")
      .select("*")
      .eq("assigned_lawyer_id", context.userId)
      .order("next_hearing", { ascending: true, nullsFirst: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as CaseRecord[];
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
    const { error } = await context.supabase.rpc("respond_to_case", {
      _case_id: data.caseId,
      _decision: data.decision,
      ...(data.note ? { _note: data.note } : {}),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Judicial docket — all listed cases visible to judicial officers. */
export const judicialDocket = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CaseRecord[]> => {
    const { data, error } = await context.supabase
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
    let query = context.supabase.from("hearings").select("*").order("hearing_date", { ascending: true });
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
    let query = context.supabase.from("precedents").select("*").order("year", { ascending: false });
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
      const { data, error } = await context.supabase
        .from("case_requests")
        .select("id, status, note, created_at, case:cases!case_requests_case_id_fkey(*)")
        .eq("lawyer_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Array<{
        id: string;
        status: string;
        note: string | null;
        created_at: string;
        case: CaseRecord | null;
      }>;
    },
  );
