import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { t as supabase } from "./client-BAvp7AVS.mjs";
import { L as ArrowLeft, d as Scale, g as LoaderCircle, n as User } from "../_libs/lucide-react.mjs";
import { a as SecureNotice, r as Logo } from "./brand-Csrv-w1h.mjs";
import { a as Input, n as CardContent, t as Card } from "./input-ensUWkxa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DcwhgRIs.mjs";
import { r as resolveAdvocateAccount } from "./verification.functions-CPQ9LYIW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-5Js3d671.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const [audience, setAudience] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden flex-col justify-between bg-ink p-12 text-ink-foreground lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-4xl leading-tight",
					children: "A verifiable bridge between citizens and justice."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md text-sm text-ink-foreground/80",
					children: "Secure, encrypted access for Indian citizens and Bar Council enrolled advocates."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-ink-foreground/60",
					children: "Designed in compliance with Supreme Court of India e-filing guidelines."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col justify-center px-6 py-12 lg:px-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-md",
				children: audience ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setAudience(null),
						className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), " Back to role selection"]
					}),
					audience === "citizen" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitizenPanel, {}),
					audience === "advocate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvocatePanel, {})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudiencePicker, { onPick: setAudience })
			})
		})]
	});
}
function AudiencePicker({ onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Are you a citizen or an advocate?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Judicial officers and authorised law-enforcement users continue on the citizen panel and pick their role after signing in."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3",
				children: [{
					key: "citizen",
					icon: User,
					title: "I am a citizen",
					blurb: "Verify your identity via Google to sign in or register instantly."
				}, {
					key: "advocate",
					icon: Scale,
					title: "I am an advocate",
					blurb: "Sign in with the Advocate Code issued after your Bar Council credentials are approved."
				}].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick(option.key),
					className: "elevate rounded-lg border border-border bg-card p-5 text-left hover:border-gold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(option.icon, {
							className: "size-5 text-gold",
							strokeWidth: 1.6
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-lg",
							children: option.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: option.blurb
						})
					]
				}, option.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Identity verification before privileged records are released — Google account for citizens, Bar Council review for advocates." })
			})
		]
	});
}
function CitizenPanel() {
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function google() {
		setBusy(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: `${window.location.origin}/gateway` }
		});
		if (error) {
			setBusy(false);
			toast.error(error.message || "Google sign-in could not be completed.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-6 font-display text-2xl",
			children: "Citizen access"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Sign in or register directly using your Google account."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "w-full",
					disabled: busy,
					onClick: () => void google(),
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), " Continue with Google"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "We use Google to verify your identity securely. No sensitive government identity numbers are required." })
				})]
			})
		})
	] });
}
function AdvocatePanel() {
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [code, setCode] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	async function resolve() {
		const { email: resolved } = await resolveAdvocateAccount({ data: { code } });
		return resolved;
	}
	async function signIn(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const resolved = await resolve();
			if (!resolved) {
				toast.error("That Advocate Code isn't recognised, or your application is still under review.");
				return;
			}
			const { error } = await supabase.auth.signInWithPassword({
				email: resolved,
				password
			});
			if (error) {
				toast.error(error.message);
				return;
			}
			navigate({
				to: "/gateway",
				replace: true
			});
		} catch {
			toast.error("Sign-in could not be completed. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	async function signUp(e) {
		e.preventDefault();
		setBusy(true);
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/gateway`,
				data: { full_name: fullName }
			}
		});
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Account created. Next: submit your Bar Council credentials for review.");
		navigate({
			to: "/gateway",
			replace: true
		});
	}
	async function forgot(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const resolved = await resolve();
			if (!resolved) {
				toast.error("That Advocate Code isn't recognised.");
				return;
			}
			const { error } = await supabase.auth.resetPasswordForEmail(resolved, { redirectTo: `${window.location.origin}/reset-password` });
			if (error) {
				toast.error(error.message);
				return;
			}
			toast.success("A recovery link has been sent to the email on your advocate record.");
			setMode("signin");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-6 font-display text-2xl",
			children: "Advocate access"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Your Advocate Code is issued once your Bar Council certificate has been reviewed and approved."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4 pt-6",
				children: [mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: signUp,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "adv-name",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "adv-name",
								required: true,
								maxLength: 120,
								value: fullName,
								onChange: (e) => setFullName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "adv-email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "adv-email",
								type: "email",
								required: true,
								maxLength: 255,
								value: email,
								onChange: (e) => setEmail(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "adv-pass",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "adv-pass",
								type: "password",
								required: true,
								minLength: 6,
								value: password,
								onChange: (e) => setPassword(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), " Start advocate application"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "w-full text-sm text-muted-foreground hover:text-foreground",
							onClick: () => setMode("signin"),
							children: "I already have an Advocate Code"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: mode === "forgot" ? forgot : signIn,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "adv-code",
								children: "Advocate Code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "adv-code",
								required: true,
								maxLength: 20,
								placeholder: "NYS-ADV-482910",
								value: code,
								onChange: (e) => setCode(e.target.value.toUpperCase()),
								className: cn("font-mono")
							})]
						}),
						mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "adv-pass2",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "adv-pass2",
								type: "password",
								required: true,
								minLength: 6,
								value: password,
								onChange: (e) => setPassword(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), mode === "forgot" ? "Send recovery link" : "Sign in"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "hover:text-foreground",
								onClick: () => setMode(mode === "forgot" ? "signin" : "forgot"),
								children: mode === "forgot" ? "Back to sign in" : "Forgot password?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "hover:text-foreground",
								onClick: () => setMode("signup"),
								children: "Apply as an advocate"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNotice, { children: "Bar Council enrolment certificates are reviewed by a ParthSarathi administrator before an Advocate Code is issued. Codes and enrolment numbers are never shown to citizens." })]
			})
		})
	] });
}
//#endregion
export { AuthPage as component };
