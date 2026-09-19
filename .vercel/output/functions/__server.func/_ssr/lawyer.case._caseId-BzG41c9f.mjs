import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useMe, o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { l as formatDate } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { c as UrgencyBadge, i as SectionTitle, n as EmptyState, s as StatusBadge } from "./brand-Csrv-w1h.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as MessagesPanel, i as DocumentsPanel, n as AppShell, r as AssistantPanel, s as getCaseBundle, t as AnalysisPanel } from "./app-shell-BuTUo8Nh.mjs";
import { n as LAWYER_NAV } from "./nav-DY5hbdLc.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCgrKFyr.mjs";
import { t as Skeleton } from "./skeleton-BDc7pdxk.mjs";
import { c as respondToCase } from "./workspace.functions-0YVPNup-.mjs";
import { t as Route } from "./lawyer.case._caseId-BRbBVkla.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-Cl26URqK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lawyer.case._caseId-BzG41c9f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LawyerCasePage() {
	const { caseId } = Route.useParams();
	const { data: me } = useMe();
	const queryClient = useQueryClient();
	const fetchBundle = useServerFn(getCaseBundle);
	const respond = useServerFn(respondToCase);
	const { data: bundle, isLoading } = useQuery({
		queryKey: ["case", caseId],
		queryFn: () => fetchBundle({ data: { caseId } })
	});
	const [decision, setDecision] = (0, import_react.useState)(null);
	const decide = useMutation({
		mutationFn: (value) => respond({ data: {
			caseId,
			decision: value
		} }),
		onSuccess: (_r, value) => {
			toast.success(value === "accepted" ? "Matter accepted." : "Matter declined.");
			queryClient.invalidateQueries({ queryKey: ["case", caseId] });
			queryClient.invalidateQueries({ queryKey: ["lawyer-queue"] });
			queryClient.invalidateQueries({ queryKey: ["lawyer-cases"] });
			queryClient.invalidateQueries({ queryKey: ["lawyer-requests"] });
			setDecision(null);
		},
		onError: (e) => {
			toast.error(e.message);
			setDecision(null);
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: LAWYER_NAV,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-6 h-96 w-full rounded-lg" })]
	});
	const record = bundle?.record;
	if (!record) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		nav: LAWYER_NAV,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Brief unavailable",
			description: "This matter is outside your access."
		})
	});
	const isMine = record.assigned_lawyer_id === me?.userId;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: LAWYER_NAV,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: record.case_number,
				title: record.title,
				description: `${record.category} · ${record.court ?? "Court to be assigned"} · filed ${formatDate(record.filed_on ?? record.created_at)}${record.filing_number ? ` · filing ${record.filing_number}` : ""}`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { urgency: record.urgency }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: record.status }),
						!isMine && record.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => setDecision("accepted"),
							children: "Accept"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setDecision("rejected"),
							children: "Decline"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "brief",
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "brief",
							children: "Brief"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "documents",
							children: "Documents"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "client",
							children: "Client chat"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "brief",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 xl:grid-cols-[1.6fr_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[10px] tracking-[0.16em] text-gold uppercase",
										children: "Citizen's statement of facts"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground",
										children: record.description
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisPanel, { analysis: bundle?.analysis ?? null })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssistantPanel, {
								caseId,
								audience: "lawyer",
								suggestions: [
									"Draft the issues arising from this brief.",
									"What limitation period applies here?",
									"Which precedents on record are strongest, and why?"
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "documents",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsPanel, { documents: bundle?.documents ?? [] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "client",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-3xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesPanel, {
								caseId,
								messages: bundle?.messages ?? [],
								currentUserId: me?.userId ?? "",
								disabled: !isMine,
								...isMine ? {} : { disabledReason: "Accept this matter to message the client." }
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!decision,
				onOpenChange: (open) => !open && setDecision(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
					className: "font-display",
					children: decision === "accepted" ? "Accept this matter?" : "Decline this matter?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: decision === "accepted" ? `You will be recorded as the advocate on ${record.case_number} and secure messaging with the client opens immediately.` : `${record.case_number} returns to the intake queue and the client is shown other advocates.` })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => decision && decide.mutate(decision),
					children: decision === "accepted" ? "Accept matter" : "Decline matter"
				})] })] })
			})
		]
	});
}
//#endregion
export { LawyerCasePage as component };
