import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-QAfXvnxM.mjs";
import { o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verification.functions-DQHlQS-F.js
/** Advocate: submit the Bar Council application for admin review. */
var submitLawyerApplication_createServerFn_handler = createServerRpc({
	id: "3b6fc805668090049eda8c0e8de23846e7fbadcece8abc650bf213941663557d",
	name: "submitLawyerApplication",
	filename: "src/lib/verification.functions.ts"
}, (opts) => submitLawyerApplication.__executeServer(opts));
var submitLawyerApplication = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	fullName: stringType().trim().min(2).max(120),
	barCouncilNumber: stringType().trim().min(4).max(60),
	documentPath: stringType().trim().min(3).max(300),
	documentName: stringType().trim().min(1).max(200),
	email: stringType().trim().email().max(255).optional()
}).parse(input)).handler(submitLawyerApplication_createServerFn_handler, async ({ data, context }) => {
	const { error: roleError } = await context.supabase.rpc("register_role", {
		_role: "lawyer",
		_credential_id: data.barCouncilNumber
	});
	if (roleError) throw new Error(roleError.message);
	const { error } = await context.supabase.from("lawyer_verification_requests").upsert({
		user_id: context.userId,
		full_name: data.fullName,
		applicant_email: data.email ?? null,
		bar_council_number: data.barCouncilNumber,
		document_path: data.documentPath,
		document_name: data.documentName,
		status: "pending"
	}, { onConflict: "user_id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var myLawyerApplication_createServerFn_handler = createServerRpc({
	id: "387201d70959e00278260dcb9465ae190f636093e22b0db41c32c957e5d97da3",
	name: "myLawyerApplication",
	filename: "src/lib/verification.functions.ts"
}, (opts) => myLawyerApplication.__executeServer(opts));
var myLawyerApplication = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(myLawyerApplication_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("lawyer_verification_requests").select("user_id, full_name, applicant_email, bar_council_number, document_path, document_name, status, review_note, created_at").eq("user_id", context.userId).maybeSingle();
	return data ?? null;
});
var listLawyerApplications_createServerFn_handler = createServerRpc({
	id: "e67c4a3e5ede18ba14bdee111d72d8faaf877d65360b39a9aa19cc7b3720fb5a",
	name: "listLawyerApplications",
	filename: "src/lib/verification.functions.ts"
}, (opts) => listLawyerApplications.__executeServer(opts));
var listLawyerApplications = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listLawyerApplications_createServerFn_handler, async ({ context }) => {
	const { data: isAdmin } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	if (!isAdmin) return {
		isAdmin: false,
		applications: []
	};
	const { data, error } = await context.supabase.from("lawyer_verification_requests").select("user_id, full_name, applicant_email, bar_council_number, document_path, document_name, status, review_note, created_at").order("created_at", { ascending: false }).limit(100);
	if (error) throw new Error(error.message);
	const { supabaseAdmin } = await import("./client.server-qi2orlhq.mjs");
	const rows = data ?? [];
	return {
		isAdmin: true,
		applications: await Promise.all(rows.map(async (row) => {
			let documentUrl = null;
			if (row.document_path) {
				const { data: signed } = await supabaseAdmin.storage.from("lawyer-credentials").createSignedUrl(row.document_path, 600);
				documentUrl = signed?.signedUrl ?? null;
			}
			return {
				...row,
				documentUrl
			};
		}))
	};
});
var reviewLawyerApplication_createServerFn_handler = createServerRpc({
	id: "cd41e839eca68866287c2bc1d642676b4b2767aae6798143d9639333ec020360",
	name: "reviewLawyerApplication",
	filename: "src/lib/verification.functions.ts"
}, (opts) => reviewLawyerApplication.__executeServer(opts));
var reviewLawyerApplication = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	userId: stringType().uuid(),
	decision: enumType(["verified", "rejected"]),
	note: stringType().trim().max(600).optional()
}).parse(input)).handler(reviewLawyerApplication_createServerFn_handler, async ({ data, context }) => {
	const { data: code, error } = await context.supabase.rpc("review_lawyer_application", {
		_user_id: data.userId,
		_decision: data.decision,
		...data.note ? { _note: data.note } : {}
	});
	if (error) throw new Error(error.message);
	if (data.decision === "verified" && typeof code === "string") {
		const { sendAdvocateCodeEmail } = await import("./email.server-BHrRhSBR.mjs");
		const { supabaseAdmin } = await import("./client.server-qi2orlhq.mjs");
		const { data: application } = await supabaseAdmin.from("lawyer_verification_requests").select("applicant_email, full_name").eq("user_id", data.userId).maybeSingle();
		if (application?.applicant_email) await sendAdvocateCodeEmail({
			to: application.applicant_email,
			name: application.full_name ?? "Advocate",
			code
		});
	}
	return { advocateCode: typeof code === "string" ? code : null };
});
var resolveAdvocateAccount_createServerFn_handler = createServerRpc({
	id: "e5e729229a972c36b75c8e12168ce9c692ec8b52dc2693c6a8fb41fe79bb0232",
	name: "resolveAdvocateAccount",
	filename: "src/lib/verification.functions.ts"
}, (opts) => resolveAdvocateAccount.__executeServer(opts));
var resolveAdvocateAccount = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ code: stringType().trim().min(6).max(20) }).parse(input)).handler(resolveAdvocateAccount_createServerFn_handler, async ({ data }) => {
	const code = data.code.toUpperCase();
	const { supabaseAdmin } = await import("./client.server-qi2orlhq.mjs");
	const { data: row } = await supabaseAdmin.from("user_roles").select("user_id, verification").eq("advocate_code", code).maybeSingle();
	if (!row || row.verification !== "verified") return { email: null };
	const { data: user } = await supabaseAdmin.auth.admin.getUserById(row.user_id);
	return { email: user?.user?.email ?? null };
});
//#endregion
export { listLawyerApplications_createServerFn_handler, myLawyerApplication_createServerFn_handler, resolveAdvocateAccount_createServerFn_handler, reviewLawyerApplication_createServerFn_handler, submitLawyerApplication_createServerFn_handler };
