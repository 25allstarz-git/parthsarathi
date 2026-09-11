import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { AppRole, VerificationStatus } from "./nyaysetu";
import type { LawyerProfile, Me } from "./types";
import { maskPhoneNumber } from "./phone";

const roleEnum = z.enum(["citizen", "lawyer", "judge", "law_enforcement"]);

export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Me> => {
    const { supabase, userId } = context;

    const [{ data: profile }, { data: roleRow }, { data: isAdmin }] =
      await Promise.all([
        supabase.from("profiles").select("full_name, email, phone, city").eq("id", userId).maybeSingle(),
        supabase
          .from("user_roles")
          .select("role, verification, credential_id, advocate_code")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
      ]);

    let lawyerProfile: LawyerProfile | null = null;
    if (roleRow?.role === "lawyer") {
      const { data } = await supabase.from("lawyer_profiles").select("*").eq("user_id", userId).maybeSingle();
      lawyerProfile = (data as LawyerProfile | null) ?? null;
    }

    const claims = context.claims as {
      email?: string;
      phone?: string;
      phone_confirmed_at?: string;
      user_metadata?: { full_name?: string; phone?: string };
    } | null;

    const phone = claims?.phone ?? profile?.phone ?? null;
    // A profile value is user-editable and a phone can exist before confirmation.
    // Only Supabase Auth's confirmation timestamp proves ownership.
    const phoneVerified = Boolean(claims?.phone_confirmed_at);

    return {
      userId,
      email: claims?.email ?? profile?.email ?? null,
      phone,
      profile: profile ?? null,
      role: (roleRow?.role as AppRole | undefined) ?? null,
      verification: (roleRow?.verification as VerificationStatus | undefined) ?? null,
      credentialId: roleRow?.credential_id ?? null,
      advocateCode: (roleRow as { advocate_code?: string | null } | null)?.advocate_code ?? null,
      isAdmin: isAdmin === true,
      phoneVerified,
      lawyerProfile,
    };
  });

export const checkPhoneUnique = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.string().trim().max(20).parse(input))
  .handler(async ({ data: phone, context }) => {
    if (!phone) return { isAvailable: true };
    const { data: existing } = await context.supabase
      .from("profiles")
      .select("id")
      .eq("phone", phone)
      .neq("id", context.userId)
      .maybeSingle();
    return { isAvailable: !existing };
  });


export const completeRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        fullName: z.string().trim().min(2).max(120),
        email: z.string().trim().email().max(255).optional(),
        phone: z.string().trim().max(20).optional(),
        city: z.string().trim().max(80).optional(),
        role: roleEnum,
        credentialId: z.string().trim().max(60).optional(),
        specializations: z.array(z.string().max(60)).max(6).optional(),
        experienceYears: z.number().int().min(0).max(60).optional(),
        court: z.string().trim().max(120).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: data.fullName,
      email: data.email ?? null,
      phone: data.phone ?? null,
      city: data.city ?? null,
    });

    if (profileError) {
      if (profileError.code === "23505" && profileError.message.includes("profiles_phone_key")) {
        throw new Error("This mobile number is already linked to another ParthSarathi account. Each number can only be used once — if you believe this is a mistake, contact support.");
      }
      throw new Error(profileError.message);
    }

    const { data: roleRow, error } = await supabase.rpc("register_role", {
      _role: data.role,
      ...(data.credentialId ? { _credential_id: data.credentialId } : {}),
    });
    if (error) throw new Error(error.message);

    const role = (roleRow as { role: AppRole; verification: VerificationStatus } | null) ?? null;

    if (data.role === "lawyer") {
      const { data: existing } = await supabase
        .from("lawyer_profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (!existing) {
        await supabase.from("lawyer_profiles").insert({
          user_id: userId,
          full_name: data.fullName.startsWith("Adv.") ? data.fullName : `Adv. ${data.fullName}`,
          specializations: data.specializations ?? ["Criminal Law"],
          experience_years: data.experienceYears ?? 1,
          cases_handled: 0,
          success_rate: 0,
          bar_council_id: data.credentialId ?? null,
          court: data.court ?? null,
          city: data.city ?? null,
          languages: ["English", "Hindi"],
          bio: "Newly registered on ParthSarathi.",
          consultation_fee: 1500,
          is_available: true,
        });
      }
    }

    return { role: role?.role ?? data.role, verification: role?.verification ?? "pending" };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        fullName: z.string().trim().min(2).max(120),
        phone: z.string().trim().max(20).optional().or(z.literal("")),
        city: z.string().trim().max(80).optional().or(z.literal("")),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ full_name: data.fullName, phone: data.phone || null, city: data.city || null })
      .eq("id", context.userId);
      
    if (error) {
      if (error.code === "23505" && error.message.includes("profiles_phone_key")) {
        throw new Error("This mobile number is already linked to another ParthSarathi account. Each number can only be used once — if you believe this is a mistake, contact support.");
      }
      throw new Error(error.message);
    }
    return { ok: true };
  });

export const updateLawyerProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        isAvailable: z.boolean().optional(),
        bio: z.string().trim().max(1000).optional(),
        consultationFee: z.number().int().min(0).max(200000).optional(),
        specializations: z.array(z.string().max(60)).max(6).optional(),
        court: z.string().trim().max(120).optional(),
        experienceYears: z.number().int().min(0).max(60).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const patch: {
      is_available?: boolean;
      bio?: string;
      consultation_fee?: number;
      specializations?: string[];
      court?: string;
      experience_years?: number;
    } = {};
    if (data.isAvailable !== undefined) patch.is_available = data.isAvailable;
    if (data.bio !== undefined) patch.bio = data.bio;
    if (data.consultationFee !== undefined) patch.consultation_fee = data.consultationFee;
    if (data.specializations !== undefined) patch.specializations = data.specializations;
    if (data.court !== undefined) patch.court = data.court;
    if (data.experienceYears !== undefined) patch.experience_years = data.experienceYears;

    const { error } = await context.supabase
      .from("lawyer_profiles")
      .update(patch)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
