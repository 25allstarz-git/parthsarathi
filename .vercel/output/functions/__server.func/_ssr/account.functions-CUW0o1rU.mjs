import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-QAfXvnxM.mjs";
import { a as numberType, i as literalType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.functions-CUW0o1rU.js
var roleEnum = enumType([
	"citizen",
	"lawyer",
	"judge",
	"law_enforcement"
]);
var getMe_createServerFn_handler = createServerRpc({
	id: "5e81144bfa029d96799874f7342d736092dbc1a9f0223f3904e388644e645291",
	name: "getMe",
	filename: "src/lib/account.functions.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMe_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const [{ data: profile }, { data: roleRow }, { data: isAdmin }] = await Promise.all([
		supabase.from("profiles").select("full_name, email, phone, city").eq("id", userId).maybeSingle(),
		supabase.from("user_roles").select("role, verification, credential_id, advocate_code").eq("user_id", userId).maybeSingle(),
		supabase.rpc("has_role", {
			_user_id: userId,
			_role: "admin"
		})
	]);
	let lawyerProfile = null;
	if (roleRow?.role === "lawyer") {
		const { data } = await supabase.from("lawyer_profiles").select("*").eq("user_id", userId).maybeSingle();
		lawyerProfile = data ?? null;
	}
	const claims = context.claims;
	const phone = claims?.phone ?? profile?.phone ?? null;
	const phoneVerified = Boolean(claims?.phone_confirmed_at);
	return {
		userId,
		email: claims?.email ?? profile?.email ?? null,
		phone,
		profile: profile ?? null,
		role: roleRow?.role ?? null,
		verification: roleRow?.verification ?? null,
		credentialId: roleRow?.credential_id ?? null,
		advocateCode: roleRow?.advocate_code ?? null,
		isAdmin: isAdmin === true,
		phoneVerified,
		lawyerProfile
	};
});
var checkPhoneUnique_createServerFn_handler = createServerRpc({
	id: "1d786416a02ef39f93bb63acbe48774a6f984b7c13242b33081aa16e0053c5bc",
	name: "checkPhoneUnique",
	filename: "src/lib/account.functions.ts"
}, (opts) => checkPhoneUnique.__executeServer(opts));
var checkPhoneUnique = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => stringType().trim().max(20).parse(input)).handler(checkPhoneUnique_createServerFn_handler, async ({ data: phone, context }) => {
	if (!phone) return { isAvailable: true };
	const { data: existing } = await context.supabase.from("profiles").select("id").eq("phone", phone).neq("id", context.userId).maybeSingle();
	return { isAvailable: !existing };
});
var completeRegistration_createServerFn_handler = createServerRpc({
	id: "9d6064bae8f2433022a15a196f9bf1641381c2bb3df8e1841f81eaecae78408e",
	name: "completeRegistration",
	filename: "src/lib/account.functions.ts"
}, (opts) => completeRegistration.__executeServer(opts));
var completeRegistration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	fullName: stringType().trim().min(2).max(120),
	email: stringType().trim().email().max(255).optional(),
	phone: stringType().trim().max(20).optional(),
	city: stringType().trim().max(80).optional(),
	role: roleEnum,
	credentialId: stringType().trim().max(60).optional(),
	specializations: arrayType(stringType().max(60)).max(6).optional(),
	experienceYears: numberType().int().min(0).max(60).optional(),
	court: stringType().trim().max(120).optional()
}).parse(input)).handler(completeRegistration_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { error: profileError } = await supabase.from("profiles").upsert({
		id: userId,
		full_name: data.fullName,
		email: data.email ?? null,
		phone: data.phone ?? null,
		city: data.city ?? null
	});
	if (profileError) {
		if (profileError.code === "23505" && profileError.message.includes("profiles_phone_key")) throw new Error("This mobile number is already linked to another ParthSarathi account. Each number can only be used once — if you believe this is a mistake, contact support.");
		throw new Error(profileError.message);
	}
	const { data: roleRow, error } = await supabase.rpc("register_role", {
		_role: data.role,
		...data.credentialId ? { _credential_id: data.credentialId } : {}
	});
	if (error) throw new Error(error.message);
	const role = roleRow ?? null;
	if (data.role === "lawyer") {
		const { data: existing } = await supabase.from("lawyer_profiles").select("id").eq("user_id", userId).maybeSingle();
		if (!existing) await supabase.from("lawyer_profiles").insert({
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
			is_available: true
		});
	}
	return {
		role: role?.role ?? data.role,
		verification: role?.verification ?? "pending"
	};
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "6010c91ceab54cf72681791fd6703c7b0848a1a9f6d08afc04090bf7e1cd43b7",
	name: "updateProfile",
	filename: "src/lib/account.functions.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	fullName: stringType().trim().min(2).max(120),
	phone: stringType().trim().max(20).optional().or(literalType("")),
	city: stringType().trim().max(80).optional().or(literalType(""))
}).parse(input)).handler(updateProfile_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("profiles").update({
		full_name: data.fullName,
		phone: data.phone || null,
		city: data.city || null
	}).eq("id", context.userId);
	if (error) {
		if (error.code === "23505" && error.message.includes("profiles_phone_key")) throw new Error("This mobile number is already linked to another ParthSarathi account. Each number can only be used once — if you believe this is a mistake, contact support.");
		throw new Error(error.message);
	}
	return { ok: true };
});
var updateLawyerProfile_createServerFn_handler = createServerRpc({
	id: "2711e0fa65a0c4d04e30d2e434f8829379ddd4d5350306794f27f7dd049115b1",
	name: "updateLawyerProfile",
	filename: "src/lib/account.functions.ts"
}, (opts) => updateLawyerProfile.__executeServer(opts));
var updateLawyerProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	isAvailable: booleanType().optional(),
	bio: stringType().trim().max(1e3).optional(),
	consultationFee: numberType().int().min(0).max(2e5).optional(),
	specializations: arrayType(stringType().max(60)).max(6).optional(),
	court: stringType().trim().max(120).optional(),
	experienceYears: numberType().int().min(0).max(60).optional()
}).parse(input)).handler(updateLawyerProfile_createServerFn_handler, async ({ data, context }) => {
	const patch = {};
	if (data.isAvailable !== void 0) patch.is_available = data.isAvailable;
	if (data.bio !== void 0) patch.bio = data.bio;
	if (data.consultationFee !== void 0) patch.consultation_fee = data.consultationFee;
	if (data.specializations !== void 0) patch.specializations = data.specializations;
	if (data.court !== void 0) patch.court = data.court;
	if (data.experienceYears !== void 0) patch.experience_years = data.experienceYears;
	const { error } = await context.supabase.from("lawyer_profiles").update(patch).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { checkPhoneUnique_createServerFn_handler, completeRegistration_createServerFn_handler, getMe_createServerFn_handler, updateLawyerProfile_createServerFn_handler, updateProfile_createServerFn_handler };
