import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { l as formatDate } from "./nyaysetu-CQpKPlck.mjs";
import { c as UrgencyBadge, i as SectionTitle, n as EmptyState, o as Stat, s as StatusBadge } from "./brand-Csrv-w1h.mjs";
import { n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as AppShell, r as AssistantPanel } from "./app-shell-BuTUo8Nh.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCgrKFyr.mjs";
import { n as judicialDocket, o as listHearings, s as listPrecedents } from "./workspace.functions-0YVPNup-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/judicial.index-r--UfqtF.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [{
	label: "Bench workspace",
	to: "/judicial"
}];
function JudicialWorkspace() {
	const fetchDocket = useServerFn(judicialDocket);
	const fetchHearings = useServerFn(listHearings);
	const fetchPrecedents = useServerFn(listPrecedents);
	const { data: docket = [] } = useQuery({
		queryKey: ["docket"],
		queryFn: () => fetchDocket()
	});
	const { data: hearings = [] } = useQuery({
		queryKey: ["hearings"],
		queryFn: () => fetchHearings({ data: {} })
	});
	const { data: precedents = [] } = useQuery({
		queryKey: ["precedents"],
		queryFn: () => fetchPrecedents({ data: {} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: NAV,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Judicial workspace",
				title: "Docket and cause list",
				description: "Listed matters, scheduled hearings and research support for the bench."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Matters on record",
						value: docket.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Listed hearings",
						value: hearings.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Critical matters",
						value: docket.filter((c) => c.urgency === "critical").length
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "causelist",
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "causelist",
							children: "Cause list"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "docket",
							children: "Docket"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "precedents",
							children: "Precedents"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "assistant",
							children: "Assistant"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "causelist",
						className: "mt-6 space-y-3",
						children: [hearings.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "No hearings listed" }), hearings.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex flex-wrap items-center justify-between gap-4 pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs text-gold",
									children: [h.item_no ? `Item ${h.item_no} · ` : "", h.case_number]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-foreground",
									children: h.purpose ?? "Hearing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										h.court,
										h.court_room ? ` · ${h.court_room}` : "",
										h.judge_name ? ` · ${h.judge_name}` : ""
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-sm text-foreground",
									children: formatDate(h.hearing_date)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-muted-foreground",
									children: h.hearing_time ?? ""
								})]
							})]
						}) }, h.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "docket",
						className: "mt-6 space-y-3",
						children: docket.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-[11px] text-muted-foreground",
									children: [
										c.category,
										" · ",
										c.court ?? "—",
										c.next_hearing ? ` · next hearing ${formatDate(c.next_hearing)}` : ""
									]
								})
							]
						}) }, c.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "precedents",
						className: "mt-6 space-y-3",
						children: precedents.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "pt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-gold",
									children: p.citation
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-display text-lg",
									children: p.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										p.court,
										" · ",
										p.year,
										" · ",
										p.category
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-foreground",
									children: p.holding
								})
							]
						}) }, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "assistant",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-3xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssistantPanel, {
								audience: "judge",
								suggestions: ["Frame the issues arising in a delayed possession dispute.", "What is the settled position on bail in economic offences?"]
							})
						})
					})
				]
			})
		]
	});
}
//#endregion
export { JudicialWorkspace as component };
