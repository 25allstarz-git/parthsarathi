import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { l as formatDate, p as relativeTime } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { F as Bell, S as FilePlusCorner, d as Scale, l as Search } from "../_libs/lucide-react.mjs";
import { c as UrgencyBadge, i as SectionTitle, n as EmptyState, o as Stat, s as StatusBadge } from "./brand-Csrv-w1h.mjs";
import { a as Input } from "./input-ensUWkxa.mjs";
import { l as listMyCases, n as AppShell, u as listNotifications } from "./app-shell-BuTUo8Nh.mjs";
import { t as CITIZEN_NAV } from "./nav-DY5hbdLc.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCgrKFyr.mjs";
import { t as Skeleton } from "./skeleton-BDc7pdxk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.index-mAobvXIY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		value: "all",
		label: "All"
	},
	{
		value: "pending",
		label: "Pending"
	},
	{
		value: "assigned",
		label: "Assigned"
	},
	{
		value: "active",
		label: "Active"
	},
	{
		value: "closed",
		label: "Closed"
	}
];
function CitizenDashboard() {
	const fetchCases = useServerFn(listMyCases);
	const fetchNotifications = useServerFn(listNotifications);
	const { data: cases = [], isLoading } = useQuery({
		queryKey: ["my-cases"],
		queryFn: () => fetchCases()
	});
	const { data: notifications = [] } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => fetchNotifications()
	});
	const [tab, setTab] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const term = search.trim().toLowerCase();
		const result = cases.filter((c) => {
			if (tab !== "all" && c.status !== tab) return false;
			if (!term) return true;
			return [
				c.case_number,
				c.title,
				c.category,
				c.court ?? "",
				c.filing_number ?? ""
			].join(" ").join(" ").toLowerCase().includes(term);
		});
		const urgencyRank = {
			critical: 4,
			high: 3,
			medium: 2,
			low: 1
		};
		return result.sort((a, b) => {
			const rankA = urgencyRank[a.urgency || "medium"] || 0;
			const rankB = urgencyRank[b.urgency || "medium"] || 0;
			if (rankA !== rankB) return rankB - rankA;
			const dateA = new Date(a.created_at || 0).getTime();
			return new Date(b.created_at || 0).getTime() - dateA;
		});
	}, [
		cases,
		tab,
		search
	]);
	const open = cases.filter((c) => c.status !== "closed").length;
	const assigned = cases.filter((c) => c.assigned_lawyer_id).length;
	const critical = cases.filter((c) => c.urgency === "critical" || c.urgency === "high").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: CITIZEN_NAV,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Citizen workspace",
				title: "Your matters",
				description: "Every matter you have filed, its analysis, assigned advocate and next hearing.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/citizen/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlusCorner, { className: "mr-2 size-4" }), " File a matter"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rise mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Total matters",
						value: cases.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open",
						value: open,
						hint: "Pending, assigned or active"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "With an advocate",
						value: assigned
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Time-sensitive",
						value: critical,
						hint: "Critical or high urgency"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-8 lg:grid-cols-[1.7fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
						value: tab,
						onValueChange: setTab,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, { children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: t.value,
							children: t.label
						}, t.value)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:w-64",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search case number or title",
							className: "pl-9",
							"aria-label": "Search matters"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-3",
					children: [
						isLoading && [
							0,
							1,
							2
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full rounded-lg" }, i)),
						!isLoading && cases.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-6" }),
							title: "No matters filed yet",
							description: "Describe your situation and upload any papers you have. We will structure it and suggest advocates.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/citizen/new",
									children: "File your first matter"
								})
							})
						}),
						!isLoading && cases.length > 0 && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "No matters match this filter",
							description: "Try a different status tab or clear the search."
						}),
						filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/citizen/case/$caseId",
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
									className: "mt-2 font-display text-lg text-foreground",
									children: c.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
									children: c.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-4 font-mono text-[11px] text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.category }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.court ?? "Court to be assigned" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Filed ", formatDate(c.filed_on ?? c.created_at)] }),
										c.next_hearing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-gold",
											children: ["Next hearing ", formatDate(c.next_hearing)]
										})
									]
								})
							]
						}, c.id))
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 font-display text-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
						className: "size-4 text-gold",
						strokeWidth: 1.7
					}), " Recent activity"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 border-l border-border pl-4",
					children: [notifications.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-6 text-sm text-muted-foreground",
						children: "Activity on your matters — analysis, advocate responses and hearings — appears here."
					}), notifications.slice(0, 8).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative pb-6 last:pb-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-1.5 -left-[21px] size-2 rounded-full bg-gold",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-foreground",
								children: n.title
							}),
							n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted-foreground",
								children: n.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-[10px] text-muted-foreground",
								children: relativeTime(n.created_at)
							})
						]
					}, n.id))]
				})] })]
			})
		]
	});
}
//#endregion
export { CitizenDashboard as component };
