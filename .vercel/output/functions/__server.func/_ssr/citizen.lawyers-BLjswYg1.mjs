import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { d as formatFee, f as initials, t as LEGAL_CATEGORIES } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { f as MessageSquare, i as Star, l as Search } from "../_libs/lucide-react.mjs";
import { i as SectionTitle, n as EmptyState } from "./brand-Csrv-w1h.mjs";
import { a as Input, n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as listLawyers, d as requestLawyer, l as listMyCases, n as AppShell } from "./app-shell-BuTUo8Nh.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-UmfwTxr_.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-5lcKljId.mjs";
import { t as CITIZEN_NAV } from "./nav-DY5hbdLc.mjs";
import { t as Skeleton } from "./skeleton-BDc7pdxk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.lawyers-BLjswYg1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FindLawyer() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const fetchLawyers = useServerFn(listLawyers);
	const fetchCases = useServerFn(listMyCases);
	const request = useServerFn(requestLawyer);
	const { data: lawyers = [], isLoading } = useQuery({
		queryKey: ["lawyers"],
		queryFn: () => fetchLawyers()
	});
	const { data: cases = [] } = useQuery({
		queryKey: ["my-cases"],
		queryFn: () => fetchCases()
	});
	const [search, setSearch] = (0, import_react.useState)("");
	const [specialisation, setSpecialisation] = (0, import_react.useState)("all");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [caseId, setCaseId] = (0, import_react.useState)("");
	const shareable = cases.filter((c) => !c.assigned_lawyer_id);
	const filtered = (0, import_react.useMemo)(() => {
		const term = search.trim().toLowerCase();
		return lawyers.filter((l) => {
			if (specialisation !== "all" && !l.specializations.includes(specialisation)) return false;
			if (!term) return true;
			return [
				l.full_name,
				l.city ?? "",
				l.court ?? "",
				l.specializations.join(" "),
				l.languages.join(" ")
			].join(" ").toLowerCase().includes(term);
		});
	}, [
		lawyers,
		search,
		specialisation
	]);
	const requestMutation = useMutation({
		mutationFn: (input) => request({ data: input }),
		onSuccess: (_result, input) => {
			toast.success("Your matter has been shared with the advocate.");
			queryClient.invalidateQueries({ queryKey: ["case", input.caseId] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			setSelected(null);
			navigate({
				to: "/citizen/case/$caseId",
				params: { caseId: input.caseId }
			});
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: CITIZEN_NAV,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Advocate discovery",
				title: "Find an advocate",
				description: "Verified advocates across practice areas, courts and languages. Share a matter to begin a secure conversation."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-64 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search by name, court, city or language",
						className: "pl-9",
						"aria-label": "Search advocates"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: specialisation,
					onValueChange: setSpecialisation,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-full sm:w-64",
						"aria-label": "Filter by practice area",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Practice area" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All practice areas"
					}), LEGAL_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: c,
						children: c
					}, c))] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: [
					isLoading && [
						0,
						1,
						2,
						3,
						4,
						5
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 rounded-lg" }, i)),
					!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2 xl:col-span-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "No advocates match these filters",
							description: "Try another practice area or clear the search."
						})
					}),
					filtered.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "elevate rise",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex h-full flex-col gap-3 pt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid size-11 shrink-0 place-items-center rounded-full bg-ink font-mono text-xs text-ink-foreground",
											children: initials(l.full_name)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-display text-lg",
												children: l.full_name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "truncate text-xs text-muted-foreground",
												children: [
													l.court ?? "Court not stated",
													" · ",
													l.city ?? "—"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-auto flex items-center gap-1 font-mono text-xs text-gold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-current" }),
												" ",
												l.rating.toFixed(1)
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: l.specializations.join(" · ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "line-clamp-3 text-sm text-muted-foreground",
									children: l.bio
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-auto flex flex-wrap gap-3 font-mono text-[11px] text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [l.experience_years, " yrs"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [l.cases_handled, " matters"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [l.success_rate, "% success"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatFee(l.consultation_fee) })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: l.is_available ? "font-mono text-[10px] tracking-[0.12em] text-success uppercase" : "font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase",
										children: l.is_available ? "Available" : "Unavailable"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => {
											setSelected(l);
											setCaseId(shareable[0]?.id ?? "");
										},
										children: "View profile"
									})]
								})
							]
						})
					}, l.id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selected,
				onOpenChange: (open) => !open && setSelected(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display text-2xl",
							children: selected?.full_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							selected?.court ?? "Court not stated",
							" · ",
							selected?.city ?? "—",
							" ·",
							" ",
							selected?.experience_years,
							" years at the bar"
						] })] }),
						selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed text-muted-foreground",
									children: selected.bio
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "grid grid-cols-2 gap-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
											children: "Practice areas"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: selected.specializations.join(", ") })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
											children: "Languages"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: selected.languages.join(", ") })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
											children: "Matters handled"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
											selected.cases_handled,
											" · ",
											selected.success_rate,
											"% success"
										] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
											children: "Consultation"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatFee(selected.consultation_fee) })] }),
										selected.bar_council_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
											children: "Bar council"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-mono text-xs",
											children: selected.bar_council_id
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-border bg-surface p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[10px] tracking-[0.14em] text-gold uppercase",
										children: "Share a matter"
									}), shareable.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: "You have no unassigned matters to share. File a matter first, then return here."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: caseId,
										onValueChange: setCaseId,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "mt-2",
											"aria-label": "Choose a matter",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a matter" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: shareable.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: c.id,
											children: [
												c.case_number,
												" — ",
												c.title
											]
										}, c.id)) })]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setSelected(null),
							children: "Close"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: !caseId || !selected || requestMutation.isPending || !selected.is_available,
							onClick: () => selected && requestMutation.mutate({
								caseId,
								lawyerProfileId: selected.id
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mr-2 size-4" }), requestMutation.isPending ? "Sending…" : "Share and start a conversation"]
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { FindLawyer as component };
