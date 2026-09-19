import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { M as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as supabase } from "./client-BAvp7AVS.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$18 } from "./citizen.case._caseId-B8Z9jtoX.mjs";
import { t as Route$19 } from "./lawyer.case._caseId-BRbBVkla.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Be1pszYb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-DXRmCJgV.css";
function reportError(error, context = {}) {
	if (typeof window === "undefined") return;
	console.error(error, context);
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-[0.2em] text-gold uppercase",
					children: "ParthSarathi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-6xl text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-lg font-medium text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "This record or page is not available. It may have been moved, closed, or is outside your access permissions."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Return home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong while retrieving this record. You can retry or return home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$17 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ParthSarathi — AI-assisted access to the courts" },
			{
				name: "description",
				content: "ParthSarathi connects citizens, lawyers, judicial officers and law enforcement with AI-assisted case understanding, document analysis and cause lists."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Noto+Sans+Devanagari:wght@500&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$17.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true,
			closeButton: true
		})]
	});
}
var $$splitComponentImporter$16 = () => import("./routes-C2ZlkllF.mjs");
var Route$16 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "ParthSarathi — AI-assisted access to Indian courts" },
		{
			name: "description",
			content: "File a matter, understand your documents, find verified advocates and track hearings. A role-aware platform for citizens, advocates, judges and law enforcement."
		},
		{
			property: "og:title",
			content: "ParthSarathi — AI-assisted access to Indian courts"
		},
		{
			property: "og:description",
			content: "Case intake, document analysis, advocate discovery and cause lists in one secure platform."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./route-Di7iQBCH.mjs");
var Route$15 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./auth-5Js3d671.mjs");
var Route$14 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — ParthSarathi" },
		{
			name: "description",
			content: "Sign in to ParthSarathi to file a matter, track hearings, and work securely with verified advocates and courts."
		},
		{
			property: "og:title",
			content: "Sign in — ParthSarathi"
		},
		{
			property: "og:description",
			content: "Secure access to India's digital justice platform."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./gateway-bgHSi12R.mjs");
var Route$13 = createFileRoute("/gateway")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./reset-password-DfmX63RP.mjs");
var Route$12 = createFileRoute("/reset-password")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Set a new password — ParthSarathi" },
		{
			name: "description",
			content: "Choose a new password for your ParthSarathi citizen or advocate account."
		},
		{
			property: "og:title",
			content: "Set a new password — ParthSarathi"
		},
		{
			property: "og:description",
			content: "Account recovery for ParthSarathi users."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./register-CHIrJ3Rf.mjs");
var Route$11 = createFileRoute("/_authenticated/register")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./admin.verifications-s5Ji1u3j.mjs");
var Route$10 = createFileRoute("/_authenticated/admin/verifications")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./citizen.index-mAobvXIY.mjs");
var Route$9 = createFileRoute("/_authenticated/citizen/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./citizen.assistant-ByjFsTQT.mjs");
var Route$8 = createFileRoute("/_authenticated/citizen/assistant")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./citizen.lawyers-BLjswYg1.mjs");
var Route$7 = createFileRoute("/_authenticated/citizen/lawyers")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./citizen.messages-DY__dDkC.mjs");
var Route$6 = createFileRoute("/_authenticated/citizen/messages")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./citizen.new-C66Jy3f7.mjs");
var Route$5 = createFileRoute("/_authenticated/citizen/new")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./citizen.profile-BwI8xdPT.mjs");
var Route$4 = createFileRoute("/_authenticated/citizen/profile")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./enforcement.index-C8CnxEJi.mjs");
var Route$3 = createFileRoute("/_authenticated/enforcement/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./judicial.index-r--UfqtF.mjs");
var Route$2 = createFileRoute("/_authenticated/judicial/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./lawyer.index-BbQcjyPS.mjs");
var Route$1 = createFileRoute("/_authenticated/lawyer/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./lawyer.profile-Bb1EldZf.mjs");
var Route = createFileRoute("/_authenticated/lawyer/profile")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$17
});
var AuthenticatedRouteRoute = Route$15.update({
	id: "/_authenticated",
	getParentRoute: () => Route$17
});
var AuthRoute = Route$14.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$17
});
var GatewayRoute = Route$13.update({
	id: "/gateway",
	path: "/gateway",
	getParentRoute: () => Route$17
});
var ResetPasswordRoute = Route$12.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$17
});
var AuthenticatedRegisterRoute = Route$11.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminVerificationsRoute = Route$10.update({
	id: "/admin/verifications",
	path: "/admin/verifications",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCitizenIndexRoute = Route$9.update({
	id: "/citizen/",
	path: "/citizen/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCitizenAssistantRoute = Route$8.update({
	id: "/citizen/assistant",
	path: "/citizen/assistant",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCitizenLawyersRoute = Route$7.update({
	id: "/citizen/lawyers",
	path: "/citizen/lawyers",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCitizenMessagesRoute = Route$6.update({
	id: "/citizen/messages",
	path: "/citizen/messages",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCitizenNewRoute = Route$5.update({
	id: "/citizen/new",
	path: "/citizen/new",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCitizenProfileRoute = Route$4.update({
	id: "/citizen/profile",
	path: "/citizen/profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedEnforcementIndexRoute = Route$3.update({
	id: "/enforcement/",
	path: "/enforcement/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedJudicialIndexRoute = Route$2.update({
	id: "/judicial/",
	path: "/judicial/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedLawyerIndexRoute = Route$1.update({
	id: "/lawyer/",
	path: "/lawyer/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedRegisterRoute,
	AuthenticatedAdminVerificationsRoute,
	AuthenticatedCitizenAssistantRoute,
	AuthenticatedCitizenLawyersRoute,
	AuthenticatedCitizenMessagesRoute,
	AuthenticatedCitizenNewRoute,
	AuthenticatedCitizenProfileRoute,
	AuthenticatedLawyerProfileRoute: Route.update({
		id: "/lawyer/profile",
		path: "/lawyer/profile",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedCitizenIndexRoute,
	AuthenticatedEnforcementIndexRoute,
	AuthenticatedJudicialIndexRoute,
	AuthenticatedLawyerIndexRoute,
	AuthenticatedCitizenCaseCaseIdRoute: Route$18.update({
		id: "/citizen/case/$caseId",
		path: "/citizen/case/$caseId",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedLawyerCaseCaseIdRoute: Route$19.update({
		id: "/lawyer/case/$caseId",
		path: "/lawyer/case/$caseId",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	GatewayRoute,
	ResetPasswordRoute
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
