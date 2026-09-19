import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useMe, o as useServerFn, r as updateLawyerProfile } from "./use-me-DsqR-uUx.mjs";
import { d as formatFee, f as initials } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { i as SectionTitle, n as EmptyState, o as Stat } from "./brand-Csrv-w1h.mjs";
import { a as Input, n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AppShell } from "./app-shell-BuTUo8Nh.mjs";
import { t as Label } from "./label-DcwhgRIs.mjs";
import { n as LAWYER_NAV } from "./nav-DY5hbdLc.mjs";
import { t as Textarea } from "./textarea-D8koTDBh.mjs";
import { t as Switch } from "./switch-CNr38Xq2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lawyer.profile-Bb1EldZf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LawyerProfilePage() {
	const { data: me } = useMe();
	const queryClient = useQueryClient();
	const save = useServerFn(updateLawyerProfile);
	const profile = me?.lawyerProfile ?? null;
	const [bio, setBio] = (0, import_react.useState)("");
	const [fee, setFee] = (0, import_react.useState)("0");
	const [court, setCourt] = (0, import_react.useState)("");
	const [years, setYears] = (0, import_react.useState)("0");
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!profile) return;
		setBio(profile.bio ?? "");
		setFee(String(profile.consultation_fee));
		setCourt(profile.court ?? "");
		setYears(String(profile.experience_years));
	}, [profile]);
	const mutation = useMutation({
		mutationFn: (patch) => save({ data: patch }),
		onSuccess: () => {
			toast.success("Practice details updated.");
			queryClient.invalidateQueries({ queryKey: ["me"] });
			queryClient.invalidateQueries({ queryKey: ["lawyers"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		nav: LAWYER_NAV,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No practice profile yet",
			description: "Your advocate profile is created during registration. Please complete onboarding to appear in advocate discovery."
		})
	});
	function submit(event) {
		event.preventDefault();
		const feeValue = Number(fee);
		const yearsValue = Number(years);
		if (!Number.isFinite(feeValue) || feeValue < 0 || feeValue > 2e5) {
			setError("Consultation fee must be between ₹0 and ₹2,00,000.");
			return;
		}
		if (!Number.isFinite(yearsValue) || yearsValue < 0 || yearsValue > 60) {
			setError("Years at the bar must be between 0 and 60.");
			return;
		}
		setError(null);
		mutation.mutate({
			bio: bio.trim(),
			consultationFee: Math.round(feeValue),
			court: court.trim(),
			experienceYears: Math.round(yearsValue)
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: LAWYER_NAV,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Practice profile",
				title: profile.full_name,
				description: "What citizens see when your name appears in advocate discovery."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rise mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Matters handled",
						value: profile.cases_handled
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Success rate",
						value: `${profile.success_rate}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Years at the bar",
						value: profile.experience_years
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Consultation",
						value: formatFee(profile.consultation_fee)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid max-w-5xl gap-6 md:grid-cols-[1.5fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "pt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "bio",
									children: "Professional summary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "bio",
									value: bio,
									maxLength: 1e3,
									rows: 5,
									onChange: (e) => setBio(e.target.value),
									className: "mt-1.5",
									placeholder: "Practice focus, notable appearances, approach to client matters."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [bio.length, "/1000 characters"]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "court",
										children: "Principal court"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "court",
										value: court,
										maxLength: 120,
										onChange: (e) => setCourt(e.target.value),
										className: "mt-1.5"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "years",
										children: "Years at the bar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "years",
										type: "number",
										min: 0,
										max: 60,
										value: years,
										onChange: (e) => setYears(e.target.value),
										className: "mt-1.5"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "fee",
										children: "Consultation fee (₹)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "fee",
										type: "number",
										min: 0,
										max: 2e5,
										value: fee,
										onChange: (e) => setFee(e.target.value),
										className: "mt-1.5"
									})] })
								]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: mutation.isPending,
								children: mutation.isPending ? "Saving…" : "Save practice details"
							})
						]
					})
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3 pt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-11 place-items-center rounded-full bg-ink font-mono text-xs text-ink-foreground",
									children: initials(profile.full_name)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg",
									children: profile.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										profile.city ?? "—",
										" · ★ ",
										profile.rating.toFixed(1)
									]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
								children: "Practice areas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: profile.specializations.join(", ")
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
								children: "Languages"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: profile.languages.join(", ")
							})] }),
							profile.bar_council_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
								children: "Bar council"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-xs",
								children: profile.bar_council_id
							})] })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-center justify-between gap-4 pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-base",
							children: "Accepting new matters"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "When off, citizens cannot send you new engagement requests."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: profile.is_available,
							disabled: mutation.isPending,
							onCheckedChange: (v) => mutation.mutate({ isAvailable: v }),
							"aria-label": "Toggle availability"
						})]
					}) })]
				})]
			})
		]
	});
}
//#endregion
export { LawyerProfilePage as component };
