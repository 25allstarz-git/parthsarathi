import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useMe, o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { l as formatDate, s as cn } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { p as MessagesSquare } from "../_libs/lucide-react.mjs";
import { i as SectionTitle, n as EmptyState, s as StatusBadge } from "./brand-Csrv-w1h.mjs";
import { a as MessagesPanel, l as listMyCases, n as AppShell, s as getCaseBundle } from "./app-shell-BuTUo8Nh.mjs";
import { t as CITIZEN_NAV } from "./nav-DY5hbdLc.mjs";
import { t as Skeleton } from "./skeleton-BDc7pdxk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.messages-DY__dDkC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CitizenMessages() {
	const { data: me } = useMe();
	const fetchCases = useServerFn(listMyCases);
	const fetchBundle = useServerFn(getCaseBundle);
	const { data: cases = [], isLoading } = useQuery({
		queryKey: ["my-cases"],
		queryFn: () => fetchCases()
	});
	const conversations = cases.filter((c) => c.assigned_lawyer_id);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!activeId && conversations[0]) setActiveId(conversations[0].id);
	}, [activeId, conversations]);
	const { data: bundle } = useQuery({
		queryKey: ["case", activeId],
		queryFn: () => fetchBundle({ data: { caseId: activeId } }),
		enabled: !!activeId
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: CITIZEN_NAV,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Secure messaging",
				title: "Messages",
				description: "Case-specific conversations with the advocate acting in each matter. Messages are visible only to you and them."
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-6 h-96 w-full rounded-lg" }),
			!isLoading && conversations.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesSquare, { className: "size-6" }),
					title: "No conversations yet",
					description: "Messaging opens as soon as an advocate accepts one of your matters.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/citizen/lawyers",
							children: "Find an advocate"
						})
					})
				})
			}),
			conversations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-[300px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: conversations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveId(c.id),
						className: cn("w-full rounded-lg border p-3 text-left transition-colors", activeId === c.id ? "border-gold/50 bg-secondary" : "border-border bg-card hover:bg-secondary/50"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-gold",
									children: c.case_number
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 line-clamp-2 text-sm font-medium",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-[10px] text-muted-foreground",
								children: ["Filed ", formatDate(c.filed_on ?? c.created_at)]
							})
						]
					}, c.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: activeId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesPanel, {
					caseId: activeId,
					messages: bundle?.messages ?? [],
					currentUserId: me?.userId ?? ""
				}) })]
			})
		]
	});
}
//#endregion
export { CitizenMessages as component };
