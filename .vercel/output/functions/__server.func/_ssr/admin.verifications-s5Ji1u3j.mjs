import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { s as cn } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { C as ExternalLink, g as LoaderCircle, s as ShieldCheck } from "../_libs/lucide-react.mjs";
import { a as Input, n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AppShell } from "./app-shell-BuTUo8Nh.mjs";
import { t as Label } from "./label-DcwhgRIs.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-UmfwTxr_.mjs";
import { i as reviewLawyerApplication, t as listLawyerApplications } from "./verification.functions-CPQ9LYIW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.verifications-s5Ji1u3j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function AdminVerifications() {
	const queryClient = useQueryClient();
	const list = useServerFn(listLawyerApplications);
	const review = useServerFn(reviewLawyerApplication);
	const { data, isLoading } = useQuery({
		queryKey: ["lawyer-applications"],
		queryFn: () => list({})
	});
	const [pending, setPending] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const decide = useMutation({
		mutationFn: () => review({ data: {
			userId: pending?.userId ?? "",
			decision: pending?.decision ?? "rejected",
			...note.trim() ? { note: note.trim() } : {}
		} }),
		onSuccess: async (result) => {
			await queryClient.invalidateQueries({ queryKey: ["lawyer-applications"] });
			toast.success(result.advocateCode ? `Approved. Advocate Code ${result.advocateCode} issued and sent to the applicant.` : "Application rejected. The applicant has been notified.");
			setPending(null);
			setNote("");
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		nav: [{
			label: "Advocate verifications",
			to: "/admin/verifications"
		}],
		children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Loading applications…"]
		}) : !data?.isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "This area is restricted to ParthSarathi administrators."
		}) }) : data.applications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "No advocate applications yet."
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: data.applications.map((application) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-4 pt-6 md:flex-row md:items-start md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
									className: "size-4 text-gold",
									strokeWidth: 1.6
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg",
									children: application.full_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: application.status === "verified" ? "default" : application.status === "rejected" ? "destructive" : "secondary",
									children: application.status
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs text-muted-foreground",
							children: ["Enrolment ", application.bar_council_number]
						}),
						application.applicant_email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: application.applicant_email
						}),
						application.documentUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: application.documentUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), application.document_name ?? "View certificate"]
						}),
						application.review_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Note: ", application.review_note]
						})
					]
				}), application.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setPending({
							userId: application.user_id,
							decision: "verified"
						}),
						children: "Approve"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setPending({
							userId: application.user_id,
							decision: "rejected"
						}),
						children: "Reject"
					})]
				})]
			}) }, application.user_id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: pending !== null,
			onOpenChange: (open) => !open && setPending(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: pending?.decision === "verified" ? "Approve this advocate?" : "Reject this application?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: pending?.decision === "verified" ? "An Advocate Code will be generated and sent to the applicant, and their advocate workspace will be unlocked." : "The applicant will be notified and can correct their details and apply again." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "review-note",
						children: "Note to the applicant (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "review-note",
						maxLength: 600,
						value: note,
						onChange: (e) => setNote(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setPending(null),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					disabled: decide.isPending,
					onClick: () => decide.mutate(),
					children: [decide.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), " Confirm"]
				})] })
			] })
		})]
	});
}
//#endregion
export { AdminVerifications as component };
