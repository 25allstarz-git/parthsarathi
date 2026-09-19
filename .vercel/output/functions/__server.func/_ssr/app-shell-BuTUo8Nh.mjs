import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime, d as DialogContent, f as DialogDescription, g as DialogTrigger, h as DialogTitle, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate, g as Link, l as useRouterState, v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-QAfXvnxM.mjs";
import { a as numberType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BjvQmmtg.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useMe, o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { c as formatBytes, f as initials, i as ROLE_LABEL, l as formatDate, p as relativeTime, s as cn, u as formatDateTime } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { t as supabase } from "./client-BAvp7AVS.mjs";
import { A as ChevronRight, F as Bell, M as Check, T as Circle, a as Sparkles, c as Send, f as MessageSquare, g as LoaderCircle, h as LogOut, m as Menu, t as X, x as FileText } from "../_libs/lucide-react.mjs";
import { a as SecureNotice, n as EmptyState, r as Logo, t as AiNotice } from "./brand-Csrv-w1h.mjs";
import { a as Input, i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { i as Trigger$1, n as Portal, r as Root2$1, t as Content2$1 } from "../_libs/radix-ui__react-popover.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { t as Root$1 } from "../_libs/radix-ui__react-separator.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-BuTUo8Nh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var Popover = Root2$1;
var PopoverTrigger = Trigger$1;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2$1.displayName;
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var uuid = stringType().uuid();
var listMyCases = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d7a7fe56c1a96fe119ec8bf51da378f6cc60f447942a81b7223e4a794e3990ad"));
var getCaseBundle = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ caseId: uuid }).parse(input)).handler(createSsrRpc("2cead0da33f4120408f6996163fd3e23065150ae34b9060ad2d440ce4d25729b"));
var createCaseWithAnalysis = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	description: stringType().trim().max(6e3).optional().default(""),
	category: stringType().trim().max(60).optional(),
	court: stringType().trim().max(120).optional(),
	documents: arrayType(objectType({
		fileName: stringType().max(200),
		storagePath: stringType().max(400).optional(),
		mimeType: stringType().max(120).optional(),
		sizeBytes: numberType().int().min(0).max(3e7),
		dataUrl: stringType().max(12e6).optional(),
		text: stringType().max(2e5).optional()
	})).max(10)
}).parse(input)).handler(createSsrRpc("d617067d6a67b94cdc9670837368c81bb43b723ad1f7453458a72826b9db0c55"));
var listLawyers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5215686957900be9729c1d3c2b3d93141515b5da355ade76d08743678d440e71"));
var requestLawyer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	caseId: uuid,
	lawyerProfileId: uuid,
	note: stringType().trim().max(600).optional()
}).parse(input)).handler(createSsrRpc("49973ae7709102e7f2ba6005a0b6363f915cd851e990828a9002d54b00dbd248"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ requestId: uuid }).parse(input)).handler(createSsrRpc("5d366bc65f8e22df6b04952fd5f50ca22354b5d5ed3592c8439df1936e266588"));
var sendCaseMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	caseId: uuid,
	body: stringType().trim().min(1).max(4e3),
	attachmentName: stringType().max(200).optional(),
	attachmentPath: stringType().max(400).optional()
}).parse(input)).handler(createSsrRpc("f98a0443e6127b3511f0e02d4cc3eb3481148ab79245011413951b9a951db737"));
var listNotifications = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("00238cf54ee7b71f3c1b2396acc89e63fd8d498caff7747b0edece3fe5f204bb"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ac49832ff95396b5ffc1392ef142e6d6377e210b97b758b58fb6279e4d574a15"));
var askCaseAssistant = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	caseId: uuid.optional(),
	question: stringType().trim().min(3).max(2e3),
	audience: enumType([
		"citizen",
		"lawyer",
		"judge"
	]),
	history: arrayType(objectType({
		role: enumType(["user", "assistant"]),
		content: stringType().max(4e3)
	})).max(10).optional()
}).parse(input)).handler(createSsrRpc("93060a0b0d466d0939d28491d65441b1f3abb91c97cd4b441a5584eab39c00a8"));
var getDocumentDownloadUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ documentId: uuid }).parse(input)).handler(createSsrRpc("2e8ecd6ea18551b13571e76f1cc4a88d92d598a83e0f831463423af4b3a01711"));
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root$1.displayName;
function AnalysisPanel({ analysis }) {
	if (!analysis) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-6" }),
		title: "No analysis on record",
		description: "This matter was filed without an AI analysis."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "font-display text-lg",
				children: "Plain-language summary"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-foreground",
						children: analysis.summary
					}),
					analysis.urgency_reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase",
							children: "Why this urgency"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-foreground",
							children: analysis.urgency_reason
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiNotice, {})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "font-display text-lg",
					children: "Extracted facts"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [analysis.extracted_facts.map((fact, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
									children: fact.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] text-gold",
									children: [Math.round((fact.confidence ?? 0) * 100), "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-foreground",
								children: fact.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-xs text-muted-foreground italic",
								children: ["Source: ", fact.source]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: (fact.confidence ?? 0) * 100,
								className: "mt-2 h-1"
							})
						]
					}, i)), analysis.extracted_facts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No facts were extracted."
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "font-display text-lg",
						children: "Key dates"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [analysis.key_dates.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-3 border-l-2 border-gold/50 pl-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-gold",
									children: d.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-foreground",
									children: d.event
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground italic",
									children: ["Source: ", d.source]
								})
							] })
						}, i)), analysis.key_dates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No dates identified."
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "font-display text-lg",
						children: "Parties"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2",
						children: [analysis.parties.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-md bg-surface px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
								children: p.role
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-foreground",
								children: p.name
							})]
						}, i)), analysis.parties.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No parties identified."
						})]
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "font-display text-lg",
				children: "Legal context"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-4",
				children: analysis.legal_insights.map((insight, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-foreground",
						children: insight.heading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-muted-foreground",
						children: insight.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground italic",
						children: ["Basis: ", insight.source]
					}),
					i < analysis.legal_insights.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "mt-4" })
				] }, i))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "font-display text-lg",
					children: "Similar matters"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: analysis.similar_cases.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-gold",
									children: c.case_number
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] text-muted-foreground",
									children: [Math.round((c.similarity ?? 0) * 100), "% similar"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-foreground",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: c.court
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-xs text-foreground",
								children: ["Outcome: ", c.outcome]
							})
						]
					}, i))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "font-display text-lg",
					children: "Precedents cited"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: analysis.precedents.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-gold",
								children: p.citation
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium text-foreground",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: p.holding
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-xs text-foreground italic",
								children: ["Relevance: ", p.relevance]
							})
						]
					}, i))
				})] })]
			})
		]
	});
}
function DocumentsPanel({ documents }) {
	const [busy, setBusy] = (0, import_react.useState)(null);
	const getUrl = useServerFn(getDocumentDownloadUrl);
	async function open(doc) {
		if (!doc.storage_path) {
			toast.error("This document has no stored file.");
			return;
		}
		setBusy(doc.id);
		try {
			const res = await getUrl({ data: { documentId: doc.id } });
			window.open(res.url, "_blank", "noopener,noreferrer");
		} catch (error) {
			toast.error(error.message || "Could not open the document.");
		} finally {
			setBusy(null);
		}
	}
	if (documents.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-6" }),
		title: "No documents filed",
		description: "No papers were uploaded with this matter."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Documents are stored in an access-controlled vault. Links expire after five minutes." }), documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 rounded-md border border-border bg-card p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
					className: "size-5 shrink-0 text-gold",
					strokeWidth: 1.6
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium text-foreground",
						children: doc.file_name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-[11px] text-muted-foreground",
						children: [
							formatBytes(doc.size_bytes),
							" · uploaded ",
							formatDate(doc.created_at)
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					disabled: busy === doc.id,
					onClick: () => void open(doc),
					children: busy === doc.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "Open"
				})
			]
		}, doc.id))]
	});
}
function MessagesPanel({ caseId, messages, currentUserId, disabled, disabledReason }) {
	const [body, setBody] = (0, import_react.useState)("");
	const queryClient = useQueryClient();
	const send = useServerFn(sendCaseMessage);
	const endRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({ block: "end" });
	}, [messages.length]);
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel(`case-messages-${caseId}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "case_messages",
			filter: `case_id=eq.${caseId}`
		}, () => queryClient.invalidateQueries({ queryKey: ["case", caseId] })).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [caseId, queryClient]);
	const mutation = useMutation({
		mutationFn: (text) => send({ data: {
			caseId,
			body: text
		} }),
		onSuccess: () => {
			setBody("");
			queryClient.invalidateQueries({ queryKey: ["case", caseId] });
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex h-[32rem] flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "font-display text-lg",
					children: "Secure messages"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Visible only to the citizen and the assigned advocate." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex-1 space-y-3 overflow-y-auto py-4",
				children: [
					messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-10 text-center text-sm text-muted-foreground",
						children: "No messages yet. Start the conversation below."
					}),
					messages.map((m) => {
						const mine = m.sender_id === currentUserId;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("flex", mine ? "justify-end" : "justify-start"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("max-w-[80%] rounded-lg px-3 py-2", mine ? "bg-ink text-ink-foreground" : "border border-border bg-surface"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[10px] tracking-[0.12em] uppercase opacity-70",
										children: m.sender_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm whitespace-pre-wrap",
										children: m.body
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-right font-mono text-[10px] opacity-60",
										children: formatDateTime(m.created_at)
									})
								]
							})
						}, m.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border p-3",
				children: disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted-foreground",
					children: disabledReason
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						const text = body.trim();
						if (!text) return;
						mutation.mutate(text);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: body,
						maxLength: 4e3,
						onChange: (e) => setBody(e.target.value),
						placeholder: "Write a message…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						disabled: mutation.isPending || !body.trim(),
						children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})]
				})
			})
		]
	});
}
function AssistantPanel({ caseId, audience, suggestions }) {
	const [question, setQuestion] = (0, import_react.useState)("");
	const [thread, setThread] = (0, import_react.useState)([]);
	const ask = useServerFn(askCaseAssistant);
	const mutation = useMutation({
		mutationFn: (q) => ask({ data: {
			...caseId ? { caseId } : {},
			question: q,
			audience,
			history: thread.slice(-8)
		} }),
		onSuccess: (result, q) => setThread((prev) => [
			...prev,
			{
				role: "user",
				content: q
			},
			{
				role: "assistant",
				content: result.answer
			}
		]),
		onError: (error) => toast.error(error.message)
	});
	function submit(q) {
		const text = q.trim();
		if (!text) return;
		setQuestion("");
		mutation.mutate(text);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex h-[32rem] flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 font-display text-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-gold" }), " Legal assistant"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex-1 space-y-4 overflow-y-auto py-4",
				children: [
					thread.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Ask about this matter. Answers are grounded in the filed record."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => submit(s),
									className: "rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground",
									children: s
								}, s))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiNotice, {})
						]
					}),
					thread.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("rounded-lg px-3 py-2 text-sm", m.role === "user" ? "ml-auto max-w-[85%] bg-ink text-ink-foreground whitespace-pre-wrap" : "border border-border bg-surface"),
						children: m.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "prose prose-sm prose-p:leading-relaxed prose-pre:p-0 dark:prose-inv...",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
								components: {
									p: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 last:mb-0",
										...props
									}),
									ul: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mb-2 ml-4 list-disc space-y-1 las...",
										...props
									}),
									ol: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
										className: "mb-2 ml-4 list-decimal space-y-1...",
										...props
									}),
									li: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { ...props }),
									strong: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-semibold",
										...props
									}),
									a: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-primary underline underline-o...",
										...props
									})
								},
								children: m.content
							})
						}) : m.content
					}, i)),
					mutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Reading the record…"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						submit(question);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: question,
						maxLength: 2e3,
						onChange: (e) => setQuestion(e.target.value),
						placeholder: "Ask a question about this matter…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						disabled: mutation.isPending || !question.trim(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})]
				})
			})
		]
	});
}
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = import_react.useState(void 0);
	import_react.useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
function FloatingAssistant() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const isMobile = useIsMobile();
	const caseId = useParams({ strict: false }).caseId;
	const assistantContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-medium text-foreground",
					children: "AI Case Assistant"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: caseId ? "Answers grounded in the current matter." : "General guidance and procedures."
				})] }), isMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: () => setOpen(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiNotice, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex-1 overflow-hidden rounded-lg border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssistantPanel, {
					...caseId ? { caseId } : {},
					audience: "citizen",
					suggestions: [
						"What does my case mean in simple terms?",
						"What documents should I arrange before the first hearing?",
						"How long does a matter like this usually take?",
						"What should I ask an advocate at the first consultation?"
					]
				}, caseId ?? "general")
			})
		]
	});
	if (isMobile) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				className: "fixed right-4 bottom-4 z-50 size-14 rounded-full shadow-lg",
				"aria-label": "Open AI Assistant",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-6" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "bottom",
			className: "h-[85vh] p-0 sm:max-w-none",
			closeIcon: false,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
				className: "sr-only",
				children: "AI Case Assistant"
			}), assistantContent]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				className: "fixed right-6 bottom-6 z-50 size-14 rounded-full shadow-xl transition-transform hover:scale-105",
				"aria-label": "Open AI Assistant",
				children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-6" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
			align: "end",
			sideOffset: 16,
			className: "h-[600px] w-[400px] p-0 shadow-2xl",
			onInteractOutside: () => setOpen(false),
			children: assistantContent
		})]
	});
}
function AppShell({ nav, children }) {
	const { data: me } = useMe();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const fetchNotifications = useServerFn(listNotifications);
	const markRead = useServerFn(markNotificationsRead);
	const { data: notifications = [] } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => fetchNotifications(),
		refetchInterval: 6e4
	});
	const unread = notifications.filter((n) => !n.is_read).length;
	const readMutation = useMutation({
		mutationFn: () => markRead(),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
	});
	async function signOut() {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	const navLinks = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: item.to,
		className: cn("rounded-md px-3 py-1.5 text-sm transition-colors", pathname === item.to ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"),
		children: item.label
	}, item.to)) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "md:hidden",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "left",
							className: "w-72 p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "sr-only",
									children: "Navigation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
									className: "mt-8 flex flex-col gap-1",
									children: navLinks
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "ml-6 hidden items-center gap-1 md:flex",
							children: navLinks
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
								onOpenChange: (open) => {
									if (open && unread > 0) readMutation.mutate();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "icon",
										className: "relative",
										"aria-label": "Notifications",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
											className: "size-5",
											strokeWidth: 1.7
										}), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-gold font-mono text-[9px] text-gold-foreground",
											children: unread > 9 ? "9+" : unread
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
									align: "end",
									className: "w-88 p-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-b border-border px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-sm",
											children: "Notifications"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "max-h-80 overflow-y-auto",
										children: [notifications.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "px-4 py-8 text-center text-sm text-muted-foreground",
											children: "No notifications yet."
										}), notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-b border-border/60 px-4 py-3 last:border-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-medium text-foreground",
													children: n.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "shrink-0 font-mono text-[10px] text-muted-foreground",
													children: relativeTime(n.created_at)
												})]
											}), n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-muted-foreground",
												children: n.body
											})]
										}, n.id))]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									className: "gap-2 pr-2 pl-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-7 place-items-center rounded-full bg-ink font-mono text-[11px] text-ink-foreground",
										children: initials(me?.profile?.full_name ?? "PS")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "hidden text-left leading-tight sm:block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs font-medium",
											children: me?.profile?.full_name ?? "Account"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-mono text-[10px] text-muted-foreground uppercase",
											children: me?.role ? ROLE_LABEL[me.role] : "—"
										})]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-56",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, {
										className: "font-normal",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-sm",
											children: me?.profile?.full_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs text-muted-foreground",
											children: me?.email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onSelect: () => void signOut(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 size-4" }), " Sign out"]
									})
								]
							})] })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border py-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ParthSarathi — digital access to the Indian justice system." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Records are access-controlled and audited. AI outputs are assistive, not adjudicatory." })]
				})
			}),
			me?.role === "citizen" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingAssistant, {})
		]
	});
}
//#endregion
export { MessagesPanel as a, listLawyers as c, requestLawyer as d, DocumentsPanel as i, listMyCases as l, AppShell as n, createCaseWithAnalysis as o, AssistantPanel as r, getCaseBundle as s, AnalysisPanel as t, listNotifications as u };
