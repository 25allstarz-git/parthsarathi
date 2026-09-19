import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useMe, o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { d as formatFee, l as formatDate } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { g as LoaderCircle } from "../_libs/lucide-react.mjs";
import { c as UrgencyBadge, i as SectionTitle, n as EmptyState, s as StatusBadge } from "./brand-Csrv-w1h.mjs";
import { n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as MessagesPanel, c as listLawyers, d as requestLawyer, i as DocumentsPanel, n as AppShell, r as AssistantPanel, s as getCaseBundle, t as AnalysisPanel } from "./app-shell-BuTUo8Nh.mjs";
import { t as CITIZEN_NAV } from "./nav-DY5hbdLc.mjs";
import { t as Route } from "./citizen.case._caseId-B8Z9jtoX.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCgrKFyr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.case._caseId-CSmSkYSz.js
var import_jsx_runtime = require_jsx_runtime();
function CitizenCasePage() {
	const { caseId } = Route.useParams();
	const { data: me } = useMe();
	const queryClient = useQueryClient();
	const fetchBundle = useServerFn(getCaseBundle);
	const fetchLawyers = useServerFn(listLawyers);
	const request = useServerFn(requestLawyer);
	const { data: bundle, isLoading } = useQuery({
		queryKey: ["case", caseId],
		queryFn: () => fetchBundle({ data: { caseId } })
	});
	const { data: lawyers = [] } = useQuery({
		queryKey: ["lawyers"],
		queryFn: () => fetchLawyers()
	});
	const requestMutation = useMutation({
		mutationFn: (lawyerProfileId) => request({ data: {
			caseId,
			lawyerProfileId
		} }),
		onSuccess: () => {
			toast.success("Request sent to the advocate.");
			queryClient.invalidateQueries({ queryKey: ["case", caseId] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => toast.error(error.message)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		nav: CITIZEN_NAV,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Loading the record…"]
		})
	});
	const record = bundle?.record;
	if (!record) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		nav: CITIZEN_NAV,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Record unavailable",
			description: "This matter is outside your access."
		})
	});
	const wanted = bundle?.analysis?.recommended_specializations ?? [];
	const recommended = [...lawyers].map((l) => ({
		lawyer: l,
		score: l.specializations.filter((s) => wanted.some((w) => s.toLowerCase().includes(w.toLowerCase()))).length
	})).sort((a, b) => b.score - a.score || b.lawyer.rating - a.lawyer.rating).slice(0, 6);
	const requestedIds = new Set((bundle?.requests ?? []).map((r) => r.lawyer_profile_id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: CITIZEN_NAV,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: record.case_number,
			title: record.title,
			description: `${record.category} · ${record.court ?? "Court to be assigned"} · filed ${formatDate(record.filed_on ?? record.created_at)}`,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { urgency: record.urgency }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: record.status })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "analysis",
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "analysis",
						children: "Analysis"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "documents",
						children: "Documents"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "advocates",
						children: "Advocates"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "messages",
						children: "Messages"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "analysis",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 xl:grid-cols-[1.6fr_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisPanel, { analysis: bundle?.analysis ?? null }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssistantPanel, {
							caseId,
							audience: "citizen",
							suggestions: [
								"What does this mean for me in simple terms?",
								"What are my next steps?",
								"What documents should I arrange?"
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "documents",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsPanel, { documents: bundle?.documents ?? [] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "advocates",
					className: "mt-6 space-y-4",
					children: [bundle?.assignedLawyer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "pt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] tracking-[0.16em] text-gold uppercase",
								children: "Assigned advocate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-xl",
								children: bundle.assignedLawyer.full_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: bundle.assignedLawyer.specializations.join(" · ")
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: recommended.map(({ lawyer }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "elevate",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2 pt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-lg",
											children: lawyer.full_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: lawyer.specializations.join(" · ")
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-xs text-gold",
											children: ["★ ", lawyer.rating.toFixed(1)]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: lawyer.bio
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-3 font-mono text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [lawyer.experience_years, " yrs"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [lawyer.cases_handled, " matters"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [lawyer.success_rate, "% success"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatFee(lawyer.consultation_fee), " consult"] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "w-full",
										variant: requestedIds.has(lawyer.id) ? "outline" : "default",
										disabled: requestedIds.has(lawyer.id) || requestMutation.isPending,
										onClick: () => requestMutation.mutate(lawyer.id),
										children: requestedIds.has(lawyer.id) ? "Request sent" : "Request this advocate"
									})
								]
							})
						}, lawyer.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "messages",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-3xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesPanel, {
							caseId,
							messages: bundle?.messages ?? [],
							currentUserId: me?.userId ?? "",
							disabled: !record.assigned_lawyer_id,
							...record.assigned_lawyer_id ? {} : { disabledReason: "Messaging opens once an advocate accepts your matter." }
						})
					})
				})
			]
		})]
	});
}
//#endregion
export { CitizenCasePage as component };
