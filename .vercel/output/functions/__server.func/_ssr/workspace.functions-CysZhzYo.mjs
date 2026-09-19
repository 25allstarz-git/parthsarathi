import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-QAfXvnxM.mjs";
import { o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace.functions-CysZhzYo.js
var uuid = stringType().uuid();
/** Cases awaiting an advocate — the lawyer's intake queue. */
var lawyerQueue_createServerFn_handler = createServerRpc({
	id: "247fe52b7d96d84b1fa3b1a22324149543c827d2bdc1d4ee2af01c1cc19f0f8f",
	name: "lawyerQueue",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => lawyerQueue.__executeServer(opts));
var lawyerQueue = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(lawyerQueue_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("cases").select("*").eq("status", "pending").order("urgency", { ascending: true }).order("created_at", { ascending: false }).limit(60);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var lawyerCases_createServerFn_handler = createServerRpc({
	id: "419f6dd7d765b6354abeab2c227485cda53995dbf307bb2ea8ca6d9fd1c607b0",
	name: "lawyerCases",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => lawyerCases.__executeServer(opts));
var lawyerCases = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(lawyerCases_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("cases").select("*").eq("assigned_lawyer_id", context.userId).order("next_hearing", {
		ascending: true,
		nullsFirst: false
	});
	if (error) throw new Error(error.message);
	return data ?? [];
});
var respondToCase_createServerFn_handler = createServerRpc({
	id: "b90d0ff56e0327dc5f034fc1fef606aacb080a46343b9f0dd293c586d229ba23",
	name: "respondToCase",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => respondToCase.__executeServer(opts));
var respondToCase = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	caseId: uuid,
	decision: enumType(["accepted", "rejected"]),
	note: stringType().trim().max(600).optional()
}).parse(input)).handler(respondToCase_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.rpc("respond_to_case", {
		_case_id: data.caseId,
		_decision: data.decision,
		...data.note ? { _note: data.note } : {}
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var judicialDocket_createServerFn_handler = createServerRpc({
	id: "c1db106bb47696b1fd7789606640cfb375ea11535b4f42b5a04c75f360bd5782",
	name: "judicialDocket",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => judicialDocket.__executeServer(opts));
var judicialDocket = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(judicialDocket_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("cases").select("*").order("next_hearing", {
		ascending: true,
		nullsFirst: false
	}).limit(100);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var listHearings_createServerFn_handler = createServerRpc({
	id: "77c10e2819b95a23aa2d27be4481e12761d565513c155f99acdbd20a45f154bf",
	name: "listHearings",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => listHearings.__executeServer(opts));
var listHearings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	from: stringType().max(10).optional(),
	to: stringType().max(10).optional()
}).parse(input ?? {})).handler(listHearings_createServerFn_handler, async ({ data, context }) => {
	let query = context.supabase.from("hearings").select("*").order("hearing_date", { ascending: true });
	if (data.from) query = query.gte("hearing_date", data.from);
	if (data.to) query = query.lte("hearing_date", data.to);
	const { data: rows, error } = await query.limit(200);
	if (error) throw new Error(error.message);
	return rows ?? [];
});
var listPrecedents_createServerFn_handler = createServerRpc({
	id: "85985ee908c0b9f86c1ef201f086aab9ad88d6dab51534576621a32132812865",
	name: "listPrecedents",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => listPrecedents.__executeServer(opts));
var listPrecedents = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ search: stringType().trim().max(120).optional() }).parse(input ?? {})).handler(listPrecedents_createServerFn_handler, async ({ data, context }) => {
	let query = context.supabase.from("precedents").select("*").order("year", { ascending: false });
	if (data.search) {
		const term = `%${data.search.replace(/[%_]/g, "")}%`;
		query = query.or(`title.ilike.${term},citation.ilike.${term},category.ilike.${term}`);
	}
	const { data: rows, error } = await query.limit(60);
	if (error) throw new Error(error.message);
	return rows ?? [];
});
var enforcementSearch_createServerFn_handler = createServerRpc({
	id: "7df743e425ad86e34433c8bdf4666b915403c5a0aac0088504c036c19f580a67",
	name: "enforcementSearch",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => enforcementSearch.__executeServer(opts));
var enforcementSearch = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ query: stringType().trim().min(2).max(80) }).parse(input)).handler(enforcementSearch_createServerFn_handler, async ({ data, context }) => {
	const term = `%${data.query.replace(/[%_]/g, "")}%`;
	const [cases, hearings] = await Promise.all([context.supabase.from("cases").select("*").or(`case_number.ilike.${term},filing_number.ilike.${term},title.ilike.${term}`).limit(25), context.supabase.from("hearings").select("*").or(`case_number.ilike.${term},party_name.ilike.${term}`).order("hearing_date", { ascending: true }).limit(25)]);
	return {
		cases: cases.data ?? [],
		hearings: hearings.data ?? []
	};
});
var lawyerRequests_createServerFn_handler = createServerRpc({
	id: "b5715b845ae59e5c31cc4685b2258d930ee0f829bb439f92c24731b1ab543b06",
	name: "lawyerRequests",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => lawyerRequests.__executeServer(opts));
var lawyerRequests = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(lawyerRequests_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("case_requests").select("id, status, note, created_at, case:cases!case_requests_case_id_fkey(*)").eq("lawyer_id", context.userId).order("created_at", { ascending: false }).limit(50);
	if (error) throw new Error(error.message);
	return data ?? [];
});
//#endregion
export { enforcementSearch_createServerFn_handler, judicialDocket_createServerFn_handler, lawyerCases_createServerFn_handler, lawyerQueue_createServerFn_handler, lawyerRequests_createServerFn_handler, listHearings_createServerFn_handler, listPrecedents_createServerFn_handler, respondToCase_createServerFn_handler };
