import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { l as formatDate } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { g as LoaderCircle, l as Search } from "../_libs/lucide-react.mjs";
import { a as SecureNotice, c as UrgencyBadge, i as SectionTitle, n as EmptyState, s as StatusBadge } from "./brand-Csrv-w1h.mjs";
import { a as Input, n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AppShell } from "./app-shell-BuTUo8Nh.mjs";
import { t as enforcementSearch } from "./workspace.functions-0YVPNup-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/enforcement.index-C8CnxEJi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [{
	label: "Case lookup",
	to: "/enforcement"
}];
function EnforcementWorkspace() {
	const [query, setQuery] = (0, import_react.useState)("");
	const search = useServerFn(enforcementSearch);
	const mutation = useMutation({
		mutationFn: (q) => search({ data: { query: q } }),
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: NAV,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Law enforcement",
				title: "Case status and hearing lookup",
				description: "Search by case number, filing number, party name or title. Access is logged."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 flex max-w-xl gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					if (query.trim().length >= 2) mutation.mutate(query.trim());
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					maxLength: 80,
					placeholder: "e.g. W.P.(C) 1189/2026 or party name",
					onChange: (e) => setQuery(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: mutation.isPending || query.trim().length < 2,
					children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Only status and hearing information is released. Filings stay sealed." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-6",
				children: [
					mutation.data && mutation.data.cases.length === 0 && mutation.data.hearings.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No records matched",
						description: "Check the case number and try again."
					}),
					mutation.data?.cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
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
									" · filed ",
									formatDate(c.filed_on ?? c.created_at),
									c.next_hearing ? ` · next hearing ${formatDate(c.next_hearing)}` : ""
								]
							})
						]
					}) }, c.id)),
					mutation.data?.hearings.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-wrap items-center justify-between gap-4 pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-gold",
								children: h.case_number
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: h.purpose ?? "Hearing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [h.court, h.court_room ? ` · ${h.court_room}` : ""]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-sm",
							children: [
								formatDate(h.hearing_date),
								" ",
								h.hearing_time ?? ""
							]
						})]
					}) }, h.id))
				]
			})
		]
	});
}
//#endregion
export { EnforcementWorkspace as component };
