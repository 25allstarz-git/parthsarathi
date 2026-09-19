import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-QAfXvnxM.mjs";
import { o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BjvQmmtg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verification.functions-CPQ9LYIW.js
/** Advocate: submit the Bar Council application for admin review. */
var submitLawyerApplication = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	fullName: stringType().trim().min(2).max(120),
	barCouncilNumber: stringType().trim().min(4).max(60),
	documentPath: stringType().trim().min(3).max(300),
	documentName: stringType().trim().min(1).max(200),
	email: stringType().trim().email().max(255).optional()
}).parse(input)).handler(createSsrRpc("3b6fc805668090049eda8c0e8de23846e7fbadcece8abc650bf213941663557d"));
/** Advocate: the status of my own application. */
var myLawyerApplication = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("387201d70959e00278260dcb9465ae190f636093e22b0db41c32c957e5d97da3"));
/** Admin: list applications with a short-lived link to the uploaded certificate. */
var listLawyerApplications = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e67c4a3e5ede18ba14bdee111d72d8faaf877d65360b39a9aa19cc7b3720fb5a"));
/** Admin: approve (issuing an advocate code) or reject an application. */
var reviewLawyerApplication = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	userId: stringType().uuid(),
	decision: enumType(["verified", "rejected"]),
	note: stringType().trim().max(600).optional()
}).parse(input)).handler(createSsrRpc("cd41e839eca68866287c2bc1d642676b4b2767aae6798143d9639333ec020360"));
/**
* Advocate sign-in: resolve an Advocate Code to the account email so the
* password sign-in can proceed. Only ever returns an email for an approved advocate.
*/
var resolveAdvocateAccount = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ code: stringType().trim().min(6).max(20) }).parse(input)).handler(createSsrRpc("e5e729229a972c36b75c8e12168ce9c692ec8b52dc2693c6a8fb41fe79bb0232"));
//#endregion
export { submitLawyerApplication as a, reviewLawyerApplication as i, myLawyerApplication as n, resolveAdvocateAccount as r, listLawyerApplications as t };
