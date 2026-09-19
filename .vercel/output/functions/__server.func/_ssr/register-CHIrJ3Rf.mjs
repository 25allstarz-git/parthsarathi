import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useMe, n as completeRegistration, o as useServerFn } from "./use-me-DsqR-uUx.mjs";
import { r as ROLE_HOME, s as cn } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { t as supabase } from "./client-BAvp7AVS.mjs";
import { D as CircleCheck, E as CircleX, b as FileUp, d as Scale, g as LoaderCircle, n as User, o as Shield, w as Clock, y as Gavel } from "../_libs/lucide-react.mjs";
import { a as SecureNotice, r as Logo } from "./brand-Csrv-w1h.mjs";
import { a as Input, n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DcwhgRIs.mjs";
import { a as submitLawyerApplication, n as myLawyerApplication } from "./verification.functions-CPQ9LYIW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-CHIrJ3Rf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Utility functions for mobile phone formatting, validation, and masking.
*/
/**
* Normalizes user input into E.164 phone format (+91XXXXXXXXXX).
* Accepts 10 digits ("9876543210"), with 0 ("09876543210"), or international ("+919876543210").
*/
function formatPhoneNumber(input) {
	const cleaned = input.trim().replace(/[^\d+]/g, "");
	if (cleaned.startsWith("+")) return cleaned;
	const digits = cleaned.replace(/\D/g, "");
	if (digits.length === 10) return `+91${digits}`;
	if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
	if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
	return digits.length > 0 ? `+${digits}` : "";
}
var ROLES = [
	{
		role: "citizen",
		icon: User,
		title: "Citizen",
		blurb: "File a matter, track it, and find an advocate."
	},
	{
		role: "lawyer",
		icon: Scale,
		title: "Advocate",
		blurb: "Take up matters, manage your cause list and research."
	},
	{
		role: "judge",
		icon: Gavel,
		title: "Judicial Officer",
		blurb: "Review the docket, cause lists and case records.",
		credential: "Judicial service identifier"
	},
	{
		role: "law_enforcement",
		icon: Shield,
		title: "Law Enforcement",
		blurb: "Look up case status and hearing information.",
		credential: "Departmental service number"
	}
];
function RegisterPage() {
	const { data: me } = useMe();
	const [role, setRole] = (0, import_react.useState)("citizen");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-3xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-8 font-display text-3xl",
				children: "Set up your ParthSarathi access"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Your role determines the records and actions available to you. Citizens authenticate securely with their Google account; advocates are approved by a ParthSarathi administrator."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: ROLES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setRole(item.role),
					className: cn("elevate rounded-lg border p-4 text-left", role === item.role ? "border-gold bg-gold/5" : "border-border bg-card"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
							className: "size-5 text-gold",
							strokeWidth: 1.6
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-lg",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: item.blurb
						})
					]
				}, item.role))
			}),
			role === "citizen" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitizenFlow, { defaultName: me?.profile?.full_name ?? "" }),
			role === "lawyer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvocateFlow, {
				defaultName: me?.profile?.full_name ?? "",
				email: me?.email ?? ""
			}),
			(role === "judge" || role === "law_enforcement") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficialFlow, {
				role,
				defaultName: me?.profile?.full_name ?? "",
				credentialLabel: ROLES.find((r) => r.role === role)?.credential ?? "Service identifier"
			})
		]
	});
}
function CitizenFlow({ defaultName }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: me } = useMe();
	const [fullName, setFullName] = (0, import_react.useState)(defaultName || me?.profile?.full_name || "");
	const [phone, setPhone] = (0, import_react.useState)(me?.phone ?? me?.profile?.phone ?? "");
	const [city, setCity] = (0, import_react.useState)(me?.profile?.city ?? "");
	const register = useServerFn(completeRegistration);
	const checkUnique = useServerFn(checkPhoneUnique);
	const finish = useMutation({
		mutationFn: async () => {
			const formattedPhone = phone ? formatPhoneNumber(phone) : null;
			if (formattedPhone && formattedPhone !== me?.phone && formattedPhone !== me?.profile?.phone) {
				const { isAvailable } = await checkUnique({ data: formattedPhone });
				if (!isAvailable) throw new Error("This mobile number is already linked to another ParthSarathi account. Each number can only be used once — if you believe this is a mistake, contact support.");
			}
			return register({ data: {
				fullName: fullName.trim(),
				role: "citizen",
				...me?.email ? { email: me.email } : {},
				...formattedPhone ? { phone: formattedPhone } : {},
				...city.trim() ? { city: city.trim() } : {}
			} });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["me"] });
			navigate({
				to: ROLE_HOME["citizen"],
				replace: true
			});
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "mt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-5 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Citizen Registration"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Please confirm your details to set up your citizen account."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "fullName",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "fullName",
								value: fullName,
								maxLength: 120,
								placeholder: "e.g. Ramesh Kumar",
								onChange: (e) => setFullName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "city",
								children: "City (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "city",
								value: city,
								maxLength: 80,
								placeholder: "e.g. New Delhi",
								onChange: (e) => setCity(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "phone",
								children: "Mobile Number (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground font-mono",
									children: "+91"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									inputMode: "tel",
									placeholder: "98765 43210",
									maxLength: 10,
									value: phone.replace(/^\+91/, "").replace(/\D/g, ""),
									onChange: (e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Your information is securely stored. An optional mobile number helps with case notifications." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					disabled: finish.isPending || fullName.trim().length < 2,
					onClick: () => finish.mutate(),
					children: [finish.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), " Continue to my dashboard"]
				})
			]
		})
	});
}
function AdvocateFlow({ defaultName, email }) {
	const queryClient = useQueryClient();
	const { data: me } = useMe();
	const fetchApplication = useServerFn(myLawyerApplication);
	const submit = useServerFn(submitLawyerApplication);
	const { data: application, isLoading } = useQuery({
		queryKey: ["lawyer-application"],
		queryFn: () => fetchApplication({})
	});
	const [fullName, setFullName] = (0, import_react.useState)(defaultName);
	const [barNumber, setBarNumber] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	const send = useMutation({
		mutationFn: async () => {
			if (!file) throw new Error("Attach your Bar Council enrolment certificate.");
			setUploading(true);
			try {
				const { data: session } = await supabase.auth.getUser();
				const uid = session.user?.id;
				if (!uid) throw new Error("Your session has expired. Please sign in again.");
				const path = `${uid}/bar-council-certificate.${file.name.split(".").pop()?.toLowerCase() ?? "pdf"}`;
				const { error: uploadError } = await supabase.storage.from("lawyer-credentials").upload(path, file, {
					upsert: true,
					contentType: file.type
				});
				if (uploadError) throw new Error(uploadError.message);
				return submit({ data: {
					fullName,
					barCouncilNumber: barNumber,
					documentPath: path,
					documentName: file.name,
					...email ? { email } : {}
				} });
			} finally {
				setUploading(false);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["lawyer-application"] });
			await queryClient.invalidateQueries({ queryKey: ["me"] });
			toast.success("Application submitted for review.");
		},
		onError: (error) => toast.error(error.message)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "mt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex items-center gap-2 py-10 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Loading your application…"]
		})
	});
	if (application && application.status !== "rejected") {
		const approved = application.status === "verified";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4 pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-gold" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: approved ? "Your credentials are approved" : "Application under review"
						})]
					}),
					approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Sign in from the advocate panel using the code below. Keep it confidential."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-gold/50 bg-gold/5 p-4 font-mono text-lg",
						children: me?.advocateCode ?? "—"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "A ParthSarathi administrator is checking your Bar Council enrolment certificate. You'll be notified here and by email once your Advocate Code is issued."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Advocate Codes and enrolment numbers are never shown to citizens on the platform." })
				]
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "mt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-5 pt-6",
			children: [
				application?.status === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mt-0.5 size-4 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Your previous application was not approved.",
						application.review_note ? ` ${application.review_note}` : "",
						" You may correct the details and submit again."
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Bar Council verification"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Submit your enrolment number and a scan of your Bar Council enrolment certificate. An administrator reviews it before your Advocate Code is issued."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "adv-full-name",
							children: "Full name (as enrolled)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "adv-full-name",
							maxLength: 120,
							value: fullName,
							onChange: (e) => setFullName(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "bar-number",
							children: "Bar Council enrolment number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "bar-number",
							maxLength: 60,
							placeholder: "D/1234/2016",
							value: barNumber,
							onChange: (e) => setBarNumber(e.target.value)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Enrolment certificate" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => inputRef.current?.click(),
							className: "flex w-full items-center gap-3 rounded-md border border-dashed border-border p-4 text-left text-sm hover:border-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, {
								className: "size-5 text-gold",
								strokeWidth: 1.6
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: file ? "" : "text-muted-foreground",
								children: file ? file.name : "Attach a PDF or image (max 10 MB)"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "file",
							accept: "application/pdf,image/png,image/jpeg",
							className: "hidden",
							onChange: (e) => {
								const picked = e.target.files?.[0] ?? null;
								if (picked && picked.size > 10485760) {
									toast.error("That file is larger than 10 MB.");
									return;
								}
								setFile(picked);
							}
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Certificates are stored privately and are visible only to ParthSarathi administrators reviewing your application." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					disabled: send.isPending || uploading || fullName.trim().length < 2 || barNumber.trim().length < 4 || !file,
					onClick: () => send.mutate(),
					children: [(send.isPending || uploading) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), " Submit for review"]
				})
			]
		})
	});
}
function OfficialFlow({ role, defaultName, credentialLabel }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: me } = useMe();
	const [fullName, setFullName] = (0, import_react.useState)(defaultName);
	const [city, setCity] = (0, import_react.useState)("");
	const [credentialId, setCredentialId] = (0, import_react.useState)("");
	const register = useServerFn(completeRegistration);
	const mutation = useMutation({
		mutationFn: () => register({ data: {
			fullName,
			role,
			...me?.email ? { email: me.email } : {},
			...city ? { city } : {},
			...credentialId ? { credentialId } : {}
		} }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["me"] });
			navigate({
				to: ROLE_HOME[role],
				replace: true
			});
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "mt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "off-name",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "off-name",
								maxLength: 120,
								value: fullName,
								onChange: (e) => setFullName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "off-city",
								children: "City"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "off-city",
								maxLength: 80,
								value: city,
								onChange: (e) => setCity(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "off-cred",
								children: credentialLabel
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "off-cred",
								maxLength: 60,
								value: credentialId,
								onChange: (e) => setCredentialId(e.target.value)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Credentials are checked against the issuing authority before privileged records are released." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					disabled: mutation.isPending || fullName.trim().length < 2,
					onClick: () => mutation.mutate(),
					children: [mutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), " Continue"]
				})
			]
		})
	});
}
//#endregion
export { RegisterPage as component };
