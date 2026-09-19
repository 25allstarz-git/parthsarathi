import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scene-support-B_1_89uG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Shared palette for every 3D element, matched to the courthouse tokens. */
var PALETTE = {
	navy: "#1F3A5F",
	navyDeep: "#16293F",
	brass: "#B08D48",
	brassLight: "#D8BE86",
	maroon: "#7A2B2B",
	stone: "#F6F3EC",
	stoneDim: "#E4DCC9"
};
/**
* True when the device can reasonably run a WebGL scene and the user has not
* asked for reduced motion. SSR-safe: starts false, so the 2D fallback renders
* first and 3D is opted into after hydration.
*/
function useSceneCapable() {
	const [capable, setCapable] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let ok = false;
		try {
			const canvas = document.createElement("canvas");
			ok = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
		} catch {
			ok = false;
		}
		setCapable(ok);
	}, []);
	return capable;
}
/** Tracks whether an element is on screen, for pausing the render loop. */
function useOnScreen(rootMargin = "120px") {
	const ref = (0, import_react.useRef)(null);
	const [onScreen, setOnScreen] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const node = ref.current;
		if (!node || typeof IntersectionObserver === "undefined") return;
		const observer = new IntersectionObserver((entries) => setOnScreen(entries.some((e) => e.isIntersecting)), { rootMargin });
		observer.observe(node);
		return () => observer.disconnect();
	}, [rootMargin]);
	return {
		ref,
		onScreen
	};
}
//#endregion
export { useOnScreen as n, useSceneCapable as r, PALETTE as t };
