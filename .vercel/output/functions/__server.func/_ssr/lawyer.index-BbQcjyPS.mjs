import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useMe, o as useServerFn, r as updateLawyerProfile } from "./use-me-DsqR-uUx.mjs";
import { l as formatDate } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { N as Briefcase, _ as Inbox } from "../_libs/lucide-react.mjs";
import { c as UrgencyBadge, i as SectionTitle, n as EmptyState, o as Stat, s as StatusBadge } from "./brand-Csrv-w1h.mjs";
import { n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AppShell, r as AssistantPanel } from "./app-shell-BuTUo8Nh.mjs";
import { n as LAWYER_NAV } from "./nav-DY5hbdLc.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCgrKFyr.mjs";
import { t as Skeleton } from "./skeleton-BDc7pdxk.mjs";
import { a as lawyerRequests, c as respondToCase, i as lawyerQueue, r as lawyerCases } from "./workspace.functions-0YVPNup-.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-Cl26URqK.mjs";
import { t as Switch } from "./switch-CNr38Xq2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lawyer.index-BbQcjyPS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LawyerWorkspace() {
	const queryClient = useQueryClient();
	const { data: me } = useMe();
	const fetchQueue = useServerFn(lawyerQueue);
	const fetchMine = useServerFn(lawyerCases);
	const fetchRequests = useServerFn(lawyerRequests);
	const respond = useServerFn(respondToCase);
	const saveProfile = useServerFn(updateLawyerProfile);
	const { data: queue = [], isLoading } = useQuery({
		queryKey: ["lawyer-queue"],
		queryFn: () => fetchQueue()
	});
	const { data: mine = [] } = useQuery({
		queryKey: ["lawyer-cases"],
		queryFn: () => fetchMine()
	});
	const { data: requests = [] } = useQuery({
		queryKey: ["lawyer-requests"],
		queryFn: () => fetchRequests()
	});
	const [pendingDecision, setPendingDecision] = (0, import_react.useState)(null);
	const decide = useMutation({
		mutationFn: (input) => respond({ data: input }),
		onSuccess: (_r, input) => {
			toast.success(input.decision === "accepted" ? "Matter accepted. The citizen has been notified and messaging is now open." : "Matter declined. The citizen has been returned to the recommendations.");
			queryClient.invalidateQueries({ queryKey: ["lawyer-queue"] });
			queryClient.invalidateQueries({ queryKey: ["lawyer-cases"] });
			queryClient.invalidateQueries({ queryKey: ["lawyer-requests"] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			setPendingDecision(null);
		},
		onError: (error) => {
			toast.error(error.message);
			setPendingDecision(null);
		}
	});
	const availability = useMutation({
		mutationFn: (isAvailable) => saveProfile({ data: { isAvailable } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["me"] });
			queryClient.invalidateQueries({ queryKey: ["lawyers"] });
			toast.success("Availability updated.");
		},
		onError: (e) => toast.error(e.message)
	});
	const isAvailable = me?.lawyerProfile?.is_available ?? false;
	const directRequests = requests.filter((r) => r.status === "pending");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: LAWYER_NAV,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Advocate workspace",
				title: "Case queue and practice",
				description: "New matters awaiting an advocate, direct requests from citizens, and the matters you are acting in.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-md border border-border bg-card px-4 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
						children: isAvailable ? "ACCEPTING NEW MATTERS" : "NOT ACCEPTING"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: isAvailable,
						disabled: !me?.lawyerProfile || availability.isPending,
						onCheckedChange: (v) => availability.mutate(v),
						"aria-label": "Toggle availability"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rise mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Awaiting an advocate",
						value: queue.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Direct requests",
						value: directRequests.length,
						hint: "Citizens who named you"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "My matters",
						value: mine.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Critical in queue",
						value: queue.filter((c) => c.urgency === "critical").length,
						hint: "Time-sensitive filings"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "queue",
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "queue",
							children: "Intake queue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "requests",
							children: "Direct requests"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "mine",
							children: "My matters"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "research",
							children: "Research"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "queue",
						className: "mt-6 space-y-3",
						children: [
							isLoading && [
								0,
								1,
								2
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-lg" }, i)),
							!isLoading && queue.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-6" }),
								title: "No matters awaiting an advocate"
							}),
							queue.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "elevate rise",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "pt-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs text-gold",
													children: c.case_number
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { urgency: c.urgency }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 font-display text-lg",
											children: c.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 line-clamp-3 text-sm text-muted-foreground",
											children: c.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex flex-wrap gap-4 font-mono text-[11px] text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.category }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.court ?? "Court to be assigned" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Filed ", formatDate(c.filed_on ?? c.created_at)] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 flex flex-wrap gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													asChild: true,
													size: "sm",
													variant: "secondary",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/lawyer/case/$caseId",
														params: { caseId: c.id },
														children: "Open brief"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													disabled: decide.isPending,
													onClick: () => setPendingDecision({
														caseId: c.id,
														caseNumber: c.case_number,
														decision: "accepted"
													}),
													children: "Accept matter"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													disabled: decide.isPending,
													onClick: () => setPendingDecision({
														caseId: c.id,
														caseNumber: c.case_number,
														decision: "rejected"
													}),
													children: "Decline"
												})
											]
										})
									]
								})
							}, c.id))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "requests",
						className: "mt-6 space-y-3",
						children: [requests.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-6" }),
							title: "No direct requests",
							description: "Citizens who choose you from advocate discovery appear here."
						}), requests.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "rise",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "pt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs text-gold",
												children: r.case?.case_number ?? "—"
											}),
											r.case && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { urgency: r.case.urgency }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase",
												children: ["Request ", r.status]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-display text-lg",
										children: r.case?.title ?? "Matter unavailable"
									}),
									r.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: [
											"“",
											r.note,
											"”"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 font-mono text-[11px] text-muted-foreground",
										children: ["Received ", formatDate(r.created_at)]
									}),
									r.case && r.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "sm",
												variant: "secondary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/lawyer/case/$caseId",
													params: { caseId: r.case.id },
													children: "Open brief"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												onClick: () => setPendingDecision({
													caseId: r.case.id,
													caseNumber: r.case.case_number,
													decision: "accepted"
												}),
												children: "Accept"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => setPendingDecision({
													caseId: r.case.id,
													caseNumber: r.case.case_number,
													decision: "rejected"
												}),
												children: "Decline"
											})
										]
									})
								]
							})
						}, r.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "mine",
						className: "mt-6 space-y-3",
						children: [mine.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "No matters yet",
							description: "Accept a matter from the intake queue."
						}), mine.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/lawyer/case/$caseId",
							params: { caseId: c.id },
							className: "elevate rise block rounded-lg border border-border bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs text-gold",
											children: c.case_number
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { urgency: c.urgency }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-lg",
									children: c.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap gap-4 font-mono text-[11px] text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.category }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.court ?? "—" }),
										c.next_hearing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-gold",
											children: ["Next hearing ", formatDate(c.next_hearing)]
										})
									]
								})
							]
						}, c.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "research",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-3xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssistantPanel, {
								audience: "lawyer",
								suggestions: [
									"Summarise the limitation position for a cheque bounce complaint.",
									"Which precedents support anticipatory bail in a 498A matter?",
									"Draft the issues for a consumer complaint on delayed possession."
								]
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!pendingDecision,
				onOpenChange: (open) => !open && setPendingDecision(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
					className: "font-display",
					children: pendingDecision?.decision === "accepted" ? "Accept this matter?" : "Decline this matter?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: pendingDecision?.decision === "accepted" ? `You will be recorded as the advocate on ${pendingDecision?.caseNumber}. The citizen is notified and secure messaging opens immediately.` : `${pendingDecision?.caseNumber} returns to the intake queue and the citizen is shown other advocates.` })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => pendingDecision && decide.mutate({
						caseId: pendingDecision.caseId,
						decision: pendingDecision.decision
					}),
					children: pendingDecision?.decision === "accepted" ? "Accept matter" : "Decline matter"
				})] })] })
			})
		]
	});
}
//#endregion
export { LawyerWorkspace as component };
