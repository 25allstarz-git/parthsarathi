import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-QAfXvnxM.mjs";
import { a as numberType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases.functions-odWdEQH6.js
var uuid = stringType().uuid();
function caseNumberFor(category) {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const serial = Math.floor(100 + Math.random() * 8900);
	return `${{
		"Constitutional Law": "W.P.(C)",
		"Criminal Law": "CRL.M.C.",
		"Family Law": "HMA",
		"Property Law": "O.S.",
		"Consumer Protection": "CC",
		"Labour & Employment": "ID",
		"Motor Accident Claims": "MACP",
		"Cyber Law": "CRL.M.C.",
		"Corporate Law": "ARB.P.",
		"Tax & Revenue": "T.A."
	}[category] ?? "C.S."} ${serial}/${year}`;
}
var listMyCases_createServerFn_handler = createServerRpc({
	id: "d7a7fe56c1a96fe119ec8bf51da378f6cc60f447942a81b7223e4a794e3990ad",
	name: "listMyCases",
	filename: "src/lib/cases.functions.ts"
}, (opts) => listMyCases.__executeServer(opts));
var listMyCases = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMyCases_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("cases").select("*").eq("citizen_id", context.userId).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var getCaseBundle_createServerFn_handler = createServerRpc({
	id: "2cead0da33f4120408f6996163fd3e23065150ae34b9060ad2d440ce4d25729b",
	name: "getCaseBundle",
	filename: "src/lib/cases.functions.ts"
}, (opts) => getCaseBundle.__executeServer(opts));
var getCaseBundle = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ caseId: uuid }).parse(input)).handler(getCaseBundle_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: record } = await supabase.from("cases").select("*").eq("id", data.caseId).maybeSingle();
	if (!record) return {
		record: null,
		documents: [],
		analysis: null,
		requests: [],
		messages: [],
		assignedLawyer: null
	};
	const [documents, analysis, requests, messages] = await Promise.all([
		supabase.from("case_documents").select("*").eq("case_id", data.caseId).order("created_at", { ascending: true }),
		supabase.from("case_analyses").select("*").eq("case_id", data.caseId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
		supabase.from("case_requests").select("*, lawyer:lawyer_profiles!case_requests_lawyer_profile_id_fkey(*)").eq("case_id", data.caseId).order("created_at", { ascending: false }),
		supabase.from("case_messages").select("*").eq("case_id", data.caseId).order("created_at", { ascending: true })
	]);
	let assignedLawyer = null;
	const profileId = record.assigned_lawyer_profile_id;
	if (profileId) {
		const { data: lp } = await supabase.from("lawyer_profiles").select("*").eq("id", profileId).maybeSingle();
		assignedLawyer = lp ?? null;
	}
	return {
		record,
		documents: documents.data ?? [],
		analysis: analysis.data ?? null,
		requests: requests.data ?? [],
		messages: messages.data ?? [],
		assignedLawyer
	};
});
var createCaseWithAnalysis_createServerFn_handler = createServerRpc({
	id: "d617067d6a67b94cdc9670837368c81bb43b723ad1f7453458a72826b9db0c55",
	name: "createCaseWithAnalysis",
	filename: "src/lib/cases.functions.ts"
}, (opts) => createCaseWithAnalysis.__executeServer(opts));
var createCaseWithAnalysis = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	description: stringType().trim().max(6e3).optional().default(""),
	category: stringType().trim().max(60).optional(),
	court: stringType().trim().max(120).optional(),
	documents: arrayType(objectType({
		fileName: stringType().max(200),
		storagePath: stringType().max(400).optional(),
		mimeType: stringType().max(120).optional(),
		sizeBytes: numberType().int().min(0).max(3e7),
		dataUrl: stringType().max(12e6).optional(),
		text: stringType().max(2e5).optional()
	})).max(10)
}).parse(input)).handler(createCaseWithAnalysis_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { analyseCase, AiUnavailableError } = await import("./ai.server-D_MwhMAm.mjs");
	let analysis;
	let usedFallback = false;
	try {
		analysis = await analyseCase({
			description: data.description,
			category: data.category ?? "",
			documents: data.documents.map((d) => ({
				file_name: d.fileName,
				mime_type: d.mimeType ?? "application/octet-stream",
				...d.dataUrl ? { data_url: d.dataUrl } : {},
				...d.text ? { text: d.text } : {}
			}))
		});
	} catch (error) {
		if (error instanceof AiUnavailableError) throw new Error(error.message);
		console.error("analysis failed", error);
		const { demoAnalysis } = await import("./demo-analysis.server-CYCnW5Re.mjs");
		analysis = demoAnalysis({
			description: data.description,
			...data.category ? { category: data.category } : {},
			documents: data.documents.map((d) => ({
				file_name: d.fileName,
				mime_type: d.mimeType ?? "application/octet-stream"
			}))
		});
		usedFallback = true;
	}
	const category = data.category || analysis.category;
	const { data: inserted, error } = await supabase.from("cases").insert({
		case_number: caseNumberFor(category),
		filing_number: `PS/${(/* @__PURE__ */ new Date()).getFullYear()}/${Math.floor(1e5 + Math.random() * 899999)}`,
		title: analysis.suggested_title,
		description: data.description,
		category,
		urgency: analysis.urgency,
		status: "pending",
		court: data.court || analysis.suggested_court,
		parties: analysis.parties,
		citizen_id: userId
	}).select("*").single();
	if (error) throw new Error(error.message);
	const caseId = inserted.id;
	if (data.documents.length) await supabase.from("case_documents").insert(data.documents.map((d) => ({
		case_id: caseId,
		file_name: d.fileName,
		storage_path: d.storagePath ?? null,
		mime_type: d.mimeType ?? null,
		size_bytes: d.sizeBytes,
		ocr_text: d.text ?? null,
		uploaded_by: userId
	})));
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
		model: usedFallback ? "nyaysetu/deterministic-analysis-v1" : "google/gemini-3.7-flash"
	});
	await supabase.from("notifications").insert({
		user_id: userId,
		title: "Case analysis ready",
		body: `${inserted.case_number} has been analysed and categorised as ${analysis.category}.`,
		kind: "success",
		case_id: caseId
	});
	return {
		caseId,
		caseNumber: inserted.case_number
	};
});
var listLawyers_createServerFn_handler = createServerRpc({
	id: "5215686957900be9729c1d3c2b3d93141515b5da355ade76d08743678d440e71",
	name: "listLawyers",
	filename: "src/lib/cases.functions.ts"
}, (opts) => listLawyers.__executeServer(opts));
var listLawyers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listLawyers_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("lawyer_profiles").select("*").eq("is_available", true).order("rating", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var requestLawyer_createServerFn_handler = createServerRpc({
	id: "49973ae7709102e7f2ba6005a0b6363f915cd851e990828a9002d54b00dbd248",
	name: "requestLawyer",
	filename: "src/lib/cases.functions.ts"
}, (opts) => requestLawyer.__executeServer(opts));
var requestLawyer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	caseId: uuid,
	lawyerProfileId: uuid,
	note: stringType().trim().max(600).optional()
}).parse(input)).handler(requestLawyer_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: lawyer } = await supabase.from("lawyer_profiles").select("id, user_id, full_name, is_available").eq("id", data.lawyerProfileId).maybeSingle();
	if (!lawyer) throw new Error("Advocate not found.");
	if (!lawyer.is_available) throw new Error("This advocate is currently unavailable.");
	const { error } = await supabase.from("case_requests").insert({
		case_id: data.caseId,
		citizen_id: userId,
		lawyer_id: lawyer.user_id,
		lawyer_profile_id: data.lawyerProfileId,
		status: "pending",
		note: data.note ?? null
	});
	if (error) throw new Error(error.message);
	await supabase.from("notifications").insert({
		user_id: userId,
		title: "Request sent",
		body: `Your case was shared with ${lawyer.full_name}. You can message them once they respond.`,
		kind: "info",
		case_id: data.caseId
	});
	return { ok: true };
});
var withdrawRequest_createServerFn_handler = createServerRpc({
	id: "5d366bc65f8e22df6b04952fd5f50ca22354b5d5ed3592c8439df1936e266588",
	name: "withdrawRequest",
	filename: "src/lib/cases.functions.ts"
}, (opts) => withdrawRequest.__executeServer(opts));
var withdrawRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ requestId: uuid }).parse(input)).handler(withdrawRequest_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("case_requests").update({
		status: "rejected",
		note: "Withdrawn by the citizen"
	}).eq("id", data.requestId).eq("citizen_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var sendCaseMessage_createServerFn_handler = createServerRpc({
	id: "f98a0443e6127b3511f0e02d4cc3eb3481148ab79245011413951b9a951db737",
	name: "sendCaseMessage",
	filename: "src/lib/cases.functions.ts"
}, (opts) => sendCaseMessage.__executeServer(opts));
var sendCaseMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	caseId: uuid,
	body: stringType().trim().min(1).max(4e3),
	attachmentName: stringType().max(200).optional(),
	attachmentPath: stringType().max(400).optional()
}).parse(input)).handler(sendCaseMessage_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const [{ data: profile }, { data: roleRow }] = await Promise.all([supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle()]);
	const { error } = await supabase.from("case_messages").insert({
		case_id: data.caseId,
		sender_id: userId,
		sender_name: profile?.full_name || "Member",
		sender_role: roleRow?.role ?? "citizen",
		body: data.body,
		attachment_name: data.attachmentName ?? null,
		attachment_path: data.attachmentPath ?? null
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listNotifications_createServerFn_handler = createServerRpc({
	id: "00238cf54ee7b71f3c1b2396acc89e63fd8d498caff7747b0edece3fe5f204bb",
	name: "listNotifications",
	filename: "src/lib/cases.functions.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("notifications").select("*").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(50);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "ac49832ff95396b5ffc1392ef142e6d6377e210b97b758b58fb6279e4d574a15",
	name: "markNotificationsRead",
	filename: "src/lib/cases.functions.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await context.supabase.from("notifications").update({ is_read: true }).eq("user_id", context.userId).eq("is_read", false);
	return { ok: true };
});
var askCaseAssistant_createServerFn_handler = createServerRpc({
	id: "93060a0b0d466d0939d28491d65441b1f3abb91c97cd4b441a5584eab39c00a8",
	name: "askCaseAssistant",
	filename: "src/lib/cases.functions.ts"
}, (opts) => askCaseAssistant.__executeServer(opts));
var askCaseAssistant = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	caseId: uuid.optional(),
	question: stringType().trim().min(3).max(2e3),
	audience: enumType([
		"citizen",
		"lawyer",
		"judge"
	]),
	history: arrayType(objectType({
		role: enumType(["user", "assistant"]),
		content: stringType().max(4e3)
	})).max(10).optional()
}).parse(input)).handler(askCaseAssistant_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	let contextText = "";
	if (data.caseId) {
		const { data: record } = await supabase.from("cases").select("*").eq("id", data.caseId).maybeSingle();
		const { data: analysis } = await supabase.from("case_analyses").select("*").eq("case_id", data.caseId).order("created_at", { ascending: false }).limit(1).maybeSingle();
		const { data: docs } = await supabase.from("case_documents").select("file_name, ocr_text").eq("case_id", data.caseId);
		contextText = JSON.stringify({
			case: record,
			analysis,
			documents: docs
		}).slice(0, 24e3);
	}
	const { askAssistant, AiUnavailableError } = await import("./ai.server-D_MwhMAm.mjs");
	try {
		return { answer: await askAssistant({
			question: data.question,
			audience: data.audience,
			context: contextText,
			history: (data.history ?? []).map((m) => ({
				role: m.role,
				content: m.content
			}))
		}) };
	} catch (error) {
		if (error instanceof AiUnavailableError) throw new Error(error.message);
		console.error("assistant failed", error);
		throw new Error("AI assistant is temporarily unavailable, please try again shortly.");
	}
});
var getDocumentDownloadUrl_createServerFn_handler = createServerRpc({
	id: "2e8ecd6ea18551b13571e76f1cc4a88d92d598a83e0f831463423af4b3a01711",
	name: "getDocumentDownloadUrl",
	filename: "src/lib/cases.functions.ts"
}, (opts) => getDocumentDownloadUrl.__executeServer(opts));
var getDocumentDownloadUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ documentId: uuid }).parse(input)).handler(getDocumentDownloadUrl_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: doc, error } = await supabase.from("case_documents").select("storage_path").eq("id", data.documentId).single();
	if (error || !doc?.storage_path) throw new Error("Document not found or access denied.");
	const { data: signed, error: signError } = await createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY).storage.from("case-documents").createSignedUrl(doc.storage_path, 600);
	if (signError || !signed) throw new Error("Failed to generate secure download link.");
	return { url: signed.signedUrl };
});
//#endregion
export { askCaseAssistant_createServerFn_handler, createCaseWithAnalysis_createServerFn_handler, getCaseBundle_createServerFn_handler, getDocumentDownloadUrl_createServerFn_handler, listLawyers_createServerFn_handler, listMyCases_createServerFn_handler, listNotifications_createServerFn_handler, markNotificationsRead_createServerFn_handler, requestLawyer_createServerFn_handler, sendCaseMessage_createServerFn_handler, withdrawRequest_createServerFn_handler };
