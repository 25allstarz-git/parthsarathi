import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as STATUS_LABEL, o as URGENCY_LABEL, s as cn } from "./nyaysetu-CQpKPlck.mjs";
import { a as Sparkles, d as Scale, s as ShieldCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-Csrv-w1h.js
var import_jsx_runtime = require_jsx_runtime();
function Logo({ className, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-9 place-items-center rounded-sm bg-primary text-gold",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, {
				className: "size-5",
				strokeWidth: 1.5
			})
		}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-display text-[1.35rem] font-semibold tracking-tight text-primary",
				children: "ParthSarathi"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-[11px] leading-none text-muted-foreground",
				children: "पार्थसारथी"
			})]
		})]
	});
}
var urgencyStyles = {
	critical: "border-critical/40 bg-critical/10 text-critical",
	high: "border-high/40 bg-high/10 text-high",
	medium: "border-medium/50 bg-medium/15 text-medium-foreground",
	low: "border-low/40 bg-low/10 text-low"
};
function UrgencyBadge({ urgency, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase", urgencyStyles[urgency], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "size-1.5 rounded-full bg-current",
			"aria-hidden": true
		}), URGENCY_LABEL[urgency]]
	});
}
var statusStyles = {
	pending: "border-border bg-secondary text-secondary-foreground",
	assigned: "border-gold/40 bg-gold/10 text-gold",
	active: "border-success/40 bg-success/10 text-success",
	closed: "border-border bg-muted text-muted-foreground"
};
function StatusBadge({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase", statusStyles[status], className),
		children: STATUS_LABEL[status]
	});
}
function AiNotice({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cn("flex items-start gap-2 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
			className: "mt-0.5 size-3.5 shrink-0 text-gold",
			strokeWidth: 1.8
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: children ?? "AI-assisted analysis. This is not legal advice or a judicial finding — please verify with a qualified advocate." })]
	});
}
function SecureNotice({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "flex items-center gap-2 text-xs text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
			className: "size-3.5 text-success",
			strokeWidth: 1.8
		}), children]
	});
}
function SectionTitle({ eyebrow, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] tracking-[0.2em] text-gold uppercase",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1.5 font-display text-2xl text-foreground",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted-foreground",
				children: description
			})
		] }), action]
	});
}
function EmptyState({ icon, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-6 py-14 text-center",
		children: [
			icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-muted-foreground",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg text-foreground",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 max-w-md text-sm text-muted-foreground",
				children: description
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: action
			})
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-3xl leading-none text-foreground",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { SecureNotice as a, UrgencyBadge as c, SectionTitle as i, EmptyState as n, Stat as o, Logo as r, StatusBadge as s, AiNotice as t };
