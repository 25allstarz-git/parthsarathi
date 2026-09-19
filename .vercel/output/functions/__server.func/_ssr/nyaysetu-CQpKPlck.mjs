import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nyaysetu-CQpKPlck.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var ROLE_LABEL = {
	citizen: "Citizen",
	lawyer: "Advocate",
	judge: "Judicial Officer",
	law_enforcement: "Law Enforcement"
};
var ROLE_HOME = {
	citizen: "/citizen",
	lawyer: "/lawyer",
	judge: "/judicial",
	law_enforcement: "/enforcement"
};
var URGENCY_LABEL = {
	critical: "Critical",
	high: "High",
	medium: "Medium",
	low: "Low"
};
var STATUS_LABEL = {
	pending: "Pending",
	active: "Active",
	assigned: "Assigned",
	closed: "Closed"
};
var LEGAL_CATEGORIES = [
	"Constitutional Law",
	"Criminal Law",
	"Family Law",
	"Property Law",
	"Consumer Protection",
	"Labour & Employment",
	"Motor Accident Claims",
	"Cyber Law",
	"Corporate Law",
	"Tax & Revenue"
];
var PROCESSING_STEPS = [
	{
		key: "upload",
		label: "Secure upload",
		detail: "Documents encrypted and stored"
	},
	{
		key: "ocr",
		label: "OCR & text recognition",
		detail: "Scanned pages converted to text"
	},
	{
		key: "facts",
		label: "Fact extraction",
		detail: "Parties, dates and events identified"
	},
	{
		key: "analysis",
		label: "AI analysis",
		detail: "Issues and legal context assessed"
	},
	{
		key: "category",
		label: "Categorisation",
		detail: "Matched to a legal category"
	},
	{
		key: "urgency",
		label: "Urgency classification",
		detail: "Time sensitivity assessed"
	},
	{
		key: "summary",
		label: "Case summary",
		detail: "Plain-language summary prepared"
	}
];
function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function formatDateTime(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleString("en-IN", {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function relativeTime(value) {
	if (!value) return "—";
	const then = new Date(value).getTime();
	if (Number.isNaN(then)) return "—";
	const diff = Date.now() - then;
	const mins = Math.round(diff / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins} min ago`;
	const hours = Math.round(mins / 60);
	if (hours < 24) return `${hours} hr ago`;
	const days = Math.round(hours / 24);
	if (days < 30) return `${days} d ago`;
	return formatDate(value);
}
function formatBytes(bytes) {
	if (!bytes) return "0 KB";
	if (bytes < 1048576) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}
function formatFee(rupees) {
	return `₹${rupees.toLocaleString("en-IN")}`;
}
function initials(name) {
	return name.replace(/^Adv\.?\s*/i, "").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}
//#endregion
export { STATUS_LABEL as a, formatBytes as c, formatFee as d, initials as f, ROLE_LABEL as i, formatDate as l, PROCESSING_STEPS as n, URGENCY_LABEL as o, relativeTime as p, ROLE_HOME as r, cn as s, LEGAL_CATEGORIES as t, formatDateTime as u };
