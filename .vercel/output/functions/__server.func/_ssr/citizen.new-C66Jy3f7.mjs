import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useMe, o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { c as formatBytes, n as PROCESSING_STEPS, t as LEGAL_CATEGORIES } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { t as supabase } from "./client-BAvp7AVS.mjs";
import { D as CircleCheck, g as LoaderCircle, r as Upload, t as X, x as FileText } from "../_libs/lucide-react.mjs";
import { a as SecureNotice, i as SectionTitle, t as AiNotice } from "./brand-Csrv-w1h.mjs";
import { n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AppShell, o as createCaseWithAnalysis } from "./app-shell-BuTUo8Nh.mjs";
import { t as Label } from "./label-DcwhgRIs.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-5lcKljId.mjs";
import { t as CITIZEN_NAV } from "./nav-DY5hbdLc.mjs";
import { t as Textarea } from "./textarea-D8koTDBh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.new-C66Jy3f7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_FILE = 8388608;
function readAsDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read the file."));
		reader.readAsDataURL(file);
	});
}
function NewCasePage() {
	const navigate = useNavigate();
	const { data: me } = useMe();
	const [description, setDescription] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [files, setFiles] = (0, import_react.useState)([]);
	const [step, setStep] = (0, import_react.useState)(-1);
	const create = useServerFn(createCaseWithAnalysis);
	const mutation = useMutation({
		mutationFn: async () => {
			const userId = me?.userId;
			const documents = [];
			setStep(0);
			for (const file of files) {
				const path = `${userId}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
				const { error } = await supabase.storage.from("case-documents").upload(path, file);
				if (error) {
					if (error.message.includes("Bucket not found") || error.message.includes("does not exist")) throw new Error("Document storage is not configured yet. Please contact the administrator.");
					throw new Error(`Upload failed for ${file.name}: ${error.message}`);
				}
				const dataUrl = await readAsDataUrl(file);
				documents.push({
					fileName: file.name,
					storagePath: path,
					mimeType: file.type || "application/octet-stream",
					sizeBytes: file.size,
					dataUrl
				});
			}
			setStep(2);
			const result = await create({ data: {
				description,
				...category ? { category } : {},
				documents
			} });
			setStep(PROCESSING_STEPS.length);
			return result;
		},
		onSuccess: (result) => {
			toast.success(`Matter registered as ${result.caseNumber}`);
			navigate({
				to: "/citizen/case/$caseId",
				params: { caseId: result.caseId }
			});
		},
		onError: (error) => {
			setStep(-1);
			toast.error(error.message);
		}
	});
	function addFiles(list) {
		if (!list) return;
		const next = [];
		for (const file of Array.from(list)) {
			if (file.size > MAX_FILE) {
				toast.error(`${file.name} is larger than 8 MB.`);
				continue;
			}
			if (!file.type.match(/^(image\/.*|application\/pdf)$/)) {
				toast.error(`${file.name} is not a supported format. Please upload PDF or image files only.`);
				continue;
			}
			next.push(file);
		}
		setFiles((prev) => [...prev, ...next].slice(0, 5));
	}
	const running = mutation.isPending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: CITIZEN_NAV,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "Case intake",
			title: "File a new matter",
			description: "Describe what happened in your own words and attach any papers — FIR copies, notices, agreements, receipts."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-5 pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "description",
								children: "What happened?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "description",
								rows: 9,
								maxLength: 6e3,
								disabled: running,
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Include dates, people involved, what you have already done, and what relief you are seeking."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-right font-mono text-[10px] text-muted-foreground",
								children: [description.length, "/6000"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category (optional — we will confirm it)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: category,
							onValueChange: setCategory,
							disabled: running,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Let ParthSarathi decide" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LEGAL_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c,
								children: c
							}, c)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "files",
								children: "Documents (PDF or images, up to 8 MB each)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: "files",
								className: "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 py-8 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
										className: "size-5 text-gold",
										strokeWidth: 1.6
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-foreground",
										children: "Click to attach documents"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Scanned pages are read with OCR before analysis"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "files",
										type: "file",
										multiple: true,
										accept: "application/pdf,image/*",
										className: "hidden",
										disabled: running,
										onChange: (e) => addFiles(e.target.files)
									})
								]
							}),
							files.map((file, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-md border border-border bg-card p-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-gold" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate text-sm",
										children: file.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: formatBytes(file.size)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										disabled: running,
										onClick: () => setFiles((prev) => prev.filter((_, idx) => idx !== i)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
									})
								]
							}, `${file.name}-${i}`))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Files are encrypted in an access-controlled vault visible only to you and an advocate you engage." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						disabled: running || description.trim().length < 30 && files.length === 0,
						onClick: () => mutation.mutate(),
						children: [running && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Submit for analysis"]
					}),
					description.trim().length < 30 && files.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted-foreground",
						children: "Add a case description or attach at least one document."
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4 pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: "Processing pipeline"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-3",
						children: PROCESSING_STEPS.map((s, i) => {
							const done = step >= i && step >= 0;
							const activeStep = running && step === i;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5",
									children: done && !activeStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-success" }) : activeStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-gold" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block size-4 rounded-full border border-border" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm text-foreground",
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted-foreground",
									children: s.detail
								})] })]
							}, s.key);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiNotice, { children: "Analysis is generated by AI to help you understand and organise your matter. It is not legal advice and does not bind any court." })
				]
			}) })]
		})]
	});
}
//#endregion
export { NewCasePage as component };
