import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useMe } from "./use-me-DsqR-uUx.mjs";
import { r as ROLE_HOME } from "./nyaysetu-CQpKPlck.mjs";
import { t as Button } from "./button-CqGpiWC-.mjs";
import { t as supabase } from "./client-BAvp7AVS.mjs";
import { O as CircleAlert, g as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gateway-bgHSi12R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Gateway() {
	const navigate = useNavigate();
	const [sessionReady, setSessionReady] = (0, import_react.useState)(false);
	const [authError, setAuthError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data, error }) => {
			if (error) setAuthError(error);
			else if (data.session) setSessionReady(true);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" || session) {
				setSessionReady(true);
				setAuthError(null);
			} else if (event === "SIGNED_OUT") navigate({
				to: "/auth",
				replace: true
			});
		});
		return () => {
			subscription.unsubscribe();
		};
	}, [navigate]);
	const { data: me, isLoading, isError, error: meError, refetch } = useMe({ enabled: sessionReady });
	(0, import_react.useEffect)(() => {
		if (!sessionReady || isLoading || isError || !me) return;
		if (me.isAdmin) {
			navigate({
				to: "/admin/verifications",
				replace: true
			});
			return;
		}
		if (!me.role) {
			navigate({
				to: "/register",
				replace: true
			});
			return;
		}
		navigate({
			to: ROLE_HOME[me.role],
			replace: true
		});
	}, [
		me,
		isLoading,
		isError,
		sessionReady,
		navigate
	]);
	const error = authError || (isError ? meError : null);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-w-sm flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 rounded-full bg-destructive/10 p-3 text-destructive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Sign-in could not be completed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error instanceof Error ? error.message : "An unexpected error occurred while loading your profile."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex w-full flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "flex-1",
						onClick: () => navigate({
							to: "/auth",
							replace: true
						}),
						children: "Return to sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						onClick: () => {
							setAuthError(null);
							refetch();
						},
						children: "Try again"
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), !sessionReady ? "Waiting for authentication…" : "Preparing your workspace…"]
		})
	});
}
//#endregion
export { Gateway as component };
