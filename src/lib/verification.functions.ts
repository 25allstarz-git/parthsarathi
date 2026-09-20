import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";


/** Advocate: submit the Bar Council application for admin review. */
export const submitLawyerApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        fullName: z.string().trim().min(2).max(120),
        barCouncilNumber: z.string().trim().min(4).max(60),
        documentPath: z.string().trim().min(3).max(300),
        documentName: z.string().trim().min(1).max(200),
        email: z.string().trim().email().max(255).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error: roleError } = await context.supabase.rpc("register_role", {
      _role: "lawyer",
      _credential_id: data.barCouncilNumber,
    });
    if (roleError) throw new Error(roleError.message);

    const { error } = await context.supabase.from("lawyer_verification_requests").upsert(
      {
        user_id: context.userId,
        full_name: data.fullName,
        applicant_email: data.email ?? null,
        bar_council_number: data.barCouncilNumber,
        document_path: data.documentPath,
        document_name: data.documentName,
        status: "pending",
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export interface LawyerApplication {
  user_id: string;
  full_name: string;
  applicant_email: string | null;
  bar_council_number: string;
  document_path: string | null;
  document_name: string | null;
  status: "pending" | "verified" | "rejected";
  review_note: string | null;
  created_at: string;
}

/** Advocate: the status of my own application. */
export const myLawyerApplication = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LawyerApplication | null> => {
    const { data } = await context.supabase
      .from("lawyer_verification_requests")
      .select("user_id, full_name, applicant_email, bar_council_number, document_path, document_name, status, review_note, created_at")
      .eq("user_id", context.userId)
      .maybeSingle();
    return (data as LawyerApplication | null) ?? null;
  });

/** Admin: list applications with a short-lived link to the uploaded certificate. */
export const listLawyerApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(
    async ({
      context,
    }): Promise<{ isAdmin: boolean; applications: Array<LawyerApplication & { documentUrl: string | null }> }> => {
      const { data: isAdmin } = await context.supabase.rpc("has_role", {
        _user_id: context.userId,
        _role: "admin",
      });
      if (!isAdmin) return { isAdmin: false, applications: [] };

      const { data, error } = await context.supabase
        .from("lawyer_verification_requests")
        .select("user_id, full_name, applicant_email, bar_council_number, document_path, document_name, status, review_note, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw new Error(error.message);

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const rows = (data ?? []) as LawyerApplication[];
      const applications = await Promise.all(
        rows.map(async (row) => {
          let documentUrl: string | null = null;
          if (row.document_path) {
            const { data: signed } = await supabaseAdmin.storage
              .from("lawyer-credentials")
              .createSignedUrl(row.document_path, 600);
            documentUrl = signed?.signedUrl ?? null;
          }
          return { ...row, documentUrl };
        }),
      );
      return { isAdmin: true, applications };
    },
  );

/** Admin: approve (issuing an advocate code) or reject an application. */
export const reviewLawyerApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        decision: z.enum(["verified", "rejected"]),
        note: z.string().trim().max(600).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: code, error } = await context.supabase.rpc("review_lawyer_application", {
      _user_id: data.userId,
      _decision: data.decision,
      ...(data.note ? { _note: data.note } : {}),
    });
    if (error) throw new Error(error.message);

    if (data.decision === "verified" && typeof code === "string") {
      const { sendAdvocateCodeEmail } = await import("./email.server");
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: application } = await supabaseAdmin
        .from("lawyer_verification_requests")
        .select("applicant_email, full_name")
        .eq("user_id", data.userId)
        .maybeSingle();
      if (application?.applicant_email) {
        await sendAdvocateCodeEmail({
          to: application.applicant_email,
          name: application.full_name ?? "Advocate",
          code,
        });
      }
    }

    return { advocateCode: typeof code === "string" ? code : null };
  });

/**
 * Advocate sign-in: resolve an Advocate Code to the account email so the
 * password sign-in can proceed. Only ever returns an email for an approved advocate.
 */
export const resolveAdvocateAccount = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({ code: z.string().trim().min(6).max(20) })
      .parse(input),
  )
  .handler(async ({ data }): Promise<{ email: string | null }> => {
    const code = data.code.toUpperCase();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, verification")
      .eq("advocate_code", code)
      .maybeSingle();
    if (!row || row.verification !== "verified") return { email: null };

    const { data: user } = await supabaseAdmin.auth.admin.getUserById(row.user_id);
    return { email: user?.user?.email ?? null };
  });
