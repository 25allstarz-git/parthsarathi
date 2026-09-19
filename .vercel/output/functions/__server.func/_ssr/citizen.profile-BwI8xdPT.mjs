import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useMe, i as updateProfile, o as useServerFn, t as checkPhoneUnique } from "./use-me-DsqR-uUx.mjs";
import { i as ROLE_LABEL } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { a as SecureNotice, i as SectionTitle } from "./brand-Csrv-w1h.mjs";
import { a as Input, n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AppShell } from "./app-shell-BuTUo8Nh.mjs";
import { t as Label } from "./label-DcwhgRIs.mjs";
import { t as CITIZEN_NAV } from "./nav-DY5hbdLc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.profile-BwI8xdPT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CitizenProfile() {
	const { data: me } = useMe();
	const queryClient = useQueryClient();
	const save = useServerFn(updateProfile);
	const checkUnique = useServerFn(checkPhoneUnique);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!me) return;
		setFullName(me.profile?.full_name ?? "");
		setPhone(me.profile?.phone ?? "");
		setCity(me.profile?.city ?? "");
	}, [me]);
	const mutation = useMutation({
		mutationFn: async () => {
			const formattedPhone = phone.trim();
			if (formattedPhone && formattedPhone !== me?.profile?.phone) {
				const { isAvailable } = await checkUnique({ data: formattedPhone });
				if (!isAvailable) throw new Error("This mobile number is already linked to another ParthSarathi account. Each number can only be used once — if you believe this is a mistake, contact support.");
			}
			return save({ data: {
				fullName: fullName.trim(),
				phone: formattedPhone,
				city: city.trim()
			} });
		},
		onSuccess: () => {
			toast.success("Your details have been updated.");
			queryClient.invalidateQueries({ queryKey: ["me"] });
		},
		onError: (e) => toast.error(e.message)
	});
	function submit(event) {
		event.preventDefault();
		if (fullName.trim().length < 2) {
			setError("Please enter your full name.");
			return;
		}
		if (phone && !/^[+\d][\d\s-]{6,19}$/.test(phone.trim())) {
			setError("Please enter a valid contact number.");
			return;
		}
		setError(null);
		mutation.mutate();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: CITIZEN_NAV,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "Account",
			title: "Profile and settings",
			description: "Your contact details are shared with an advocate only after they accept your matter."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid max-w-4xl gap-6 md:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "pt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "fullName",
							children: "Full name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "fullName",
							value: fullName,
							maxLength: 120,
							onChange: (e) => setFullName(e.target.value),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								value: me?.email ?? "",
								disabled: true,
								className: "mt-1.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Your sign-in address cannot be changed here."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "phone",
								children: "Contact number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "phone",
								value: phone,
								maxLength: 20,
								onChange: (e) => setPhone(e.target.value),
								placeholder: "+91 98xxx xxxxx",
								className: "mt-1.5"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "city",
								children: "City"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "city",
								value: city,
								maxLength: 80,
								onChange: (e) => setCity(e.target.value),
								placeholder: "New Delhi",
								className: "mt-1.5"
							})] })]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: mutation.isPending,
							children: mutation.isPending ? "Saving…" : "Save changes"
						})
					]
				})
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2 pt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] tracking-[0.14em] text-gold uppercase",
							children: "Role"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: me?.role ? ROLE_LABEL[me.role] : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Roles are verified server-side. A citizen account can never reach advocate, judicial or law-enforcement records."
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Documents and messages are stored in an access-controlled vault and every professional lookup is logged." })]
			})]
		})]
	});
}
//#endregion
export { CitizenProfile as component };
