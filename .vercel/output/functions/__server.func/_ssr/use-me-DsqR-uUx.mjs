import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { k as isRedirect, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-QAfXvnxM.mjs";
import { a as numberType, i as literalType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BjvQmmtg.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-me-DsqR-uUx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var roleEnum = enumType([
	"citizen",
	"lawyer",
	"judge",
	"law_enforcement"
]);
var getMe = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5e81144bfa029d96799874f7342d736092dbc1a9f0223f3904e388644e645291"));
var checkPhoneUnique = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => stringType().trim().max(20).parse(input)).handler(createSsrRpc("1d786416a02ef39f93bb63acbe48774a6f984b7c13242b33081aa16e0053c5bc"));
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
}).parse(input)).handler(createSsrRpc("9d6064bae8f2433022a15a196f9bf1641381c2bb3df8e1841f81eaecae78408e"));
var updateProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	fullName: stringType().trim().min(2).max(120),
	phone: stringType().trim().max(20).optional().or(literalType("")),
	city: stringType().trim().max(80).optional().or(literalType(""))
}).parse(input)).handler(createSsrRpc("6010c91ceab54cf72681791fd6703c7b0848a1a9f6d08afc04090bf7e1cd43b7"));
var updateLawyerProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	isAvailable: booleanType().optional(),
	bio: stringType().trim().max(1e3).optional(),
	consultationFee: numberType().int().min(0).max(2e5).optional(),
	specializations: arrayType(stringType().max(60)).max(6).optional(),
	court: stringType().trim().max(120).optional(),
	experienceYears: numberType().int().min(0).max(60).optional()
}).parse(input)).handler(createSsrRpc("2711e0fa65a0c4d04e30d2e434f8829379ddd4d5350306794f27f7dd049115b1"));
function useMe(options) {
	const fetchMe = useServerFn(getMe);
	return useQuery({
		queryKey: ["me"],
		queryFn: () => fetchMe(),
		staleTime: 6e4,
		enabled: options?.enabled
	});
}
//#endregion
export { useMe as a, updateProfile as i, completeRegistration as n, useServerFn as o, updateLawyerProfile as r, checkPhoneUnique as t };
