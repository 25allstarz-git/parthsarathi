import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { i as SectionTitle, t as AiNotice } from "./brand-Csrv-w1h.mjs";
import { l as listMyCases, n as AppShell, r as AssistantPanel } from "./app-shell-BuTUo8Nh.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-5lcKljId.mjs";
import { t as CITIZEN_NAV } from "./nav-DY5hbdLc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.assistant-ByjFsTQT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CitizenAssistant() {
	const fetchCases = useServerFn(listMyCases);
	const { data: cases = [] } = useQuery({
		queryKey: ["my-cases"],
		queryFn: () => fetchCases()
	});
	const [caseId, setCaseId] = (0, import_react.useState)("none");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: CITIZEN_NAV,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "AI case assistant",
			title: "Ask about your matter",
			description: "Plain-language answers grounded in the documents and analysis already on your file."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 max-w-3xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiNotice, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
					children: "Ground the answer in a matter"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: caseId,
					onValueChange: setCaseId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "mt-2",
						"aria-label": "Choose a matter",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "General questions" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "none",
						children: "General questions about court procedure"
					}), cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: c.id,
						children: [
							c.case_number,
							" — ",
							c.title
						]
					}, c.id))] })]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssistantPanel, {
					...caseId !== "none" ? { caseId } : {},
					audience: "citizen",
					suggestions: [
						"What does my case mean in simple terms?",
						"What documents should I arrange before the first hearing?",
						"How long does a matter like this usually take?",
						"What should I ask an advocate at the first consultation?"
					]
				}, caseId)
			]
		})]
	});
}
//#endregion
export { CitizenAssistant as component };
