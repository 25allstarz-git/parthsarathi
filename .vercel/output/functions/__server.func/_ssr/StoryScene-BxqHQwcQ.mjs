import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as PALETTE } from "./scene-support-B_1_89uG.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as MathUtils } from "../_libs/monogrid__gainmap-js+three.mjs";
import { i as useFrame, n as Environment, r as Canvas, t as Lightformer } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StoryScene-BxqHQwcQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var clamp01 = (v) => Math.min(1, Math.max(0, v));
/** Eased 0→1 ramp between two progress marks. */
var seg = (p, a, b) => {
	const t = clamp01((p - a) / (b - a));
	return t * t * (3 - 2 * t);
};
function Pages({ progress }) {
	const group = (0, import_react.useRef)(null);
	const scan = (0, import_react.useRef)(null);
	const marks = (0, import_react.useRef)(null);
	const link = (0, import_react.useRef)(null);
	const meshes = (0, import_react.useRef)([]);
	const pages = (0, import_react.useMemo)(() => Array.from({ length: 5 }, (_, i) => ({
		start: [
			(i - 2) * 1.35,
			(i % 2 ? .5 : -.4) + i * .12,
			(i - 2) * .5
		],
		tilt: (i - 2) * .14
	})), []);
	useFrame(() => {
		const p = progress.current ?? 0;
		const gather = seg(p, .34, .66);
		const handoff = seg(p, .68, 1);
		meshes.current.forEach((m, i) => {
			if (!m) return;
			const s = pages[i];
			m.position.x = MathUtils.lerp(s.start[0], 0, gather);
			m.position.y = MathUtils.lerp(s.start[1], (i - 2) * .055, gather);
			m.position.z = MathUtils.lerp(s.start[2], (i - 2) * .02, gather);
			m.rotation.z = MathUtils.lerp(s.tilt, 0, gather);
			m.rotation.x = MathUtils.lerp(0, -.18, gather);
		});
		if (scan.current) {
			const scanT = seg(p, .02, .32);
			scan.current.visible = scanT > .01 && scanT < .99;
			scan.current.position.y = MathUtils.lerp(1.9, -1.9, scanT);
		}
		if (marks.current) {
			const m = seg(p, .16, .42);
			marks.current.scale.set(m, m, 1);
			marks.current.visible = m > .02;
		}
		if (link.current) {
			link.current.scale.setScalar(Math.max(.001, handoff));
			link.current.visible = handoff > .02;
		}
		if (group.current) {
			group.current.rotation.y = -.5 + p * .85;
			group.current.position.z = p * .9;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		children: [
			pages.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: (g) => {
					meshes.current[i] = g;
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						1.55,
						2.15,
						.02
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: i % 2 ? PALETTE.stone : PALETTE.stoneDim,
						roughness: .95
					})]
				}), [
					.7,
					.35,
					0,
					-.35,
					-.7
				].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.1,
						y,
						.013
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.05, .055] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: PALETTE.navy,
						roughness: 1,
						opacity: .35,
						transparent: true
					})]
				}, y))]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: scan,
				position: [
					0,
					0,
					.9
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [5.6, .06] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: PALETTE.brassLight,
					transparent: true,
					opacity: .85
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
				ref: marks,
				position: [
					0,
					0,
					.06
				],
				children: [
					[-.4, .7],
					[.25, 0],
					[-.2, -.7]
				].map(([x, y], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						x,
						y,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.8, .14] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
						color: PALETTE.brass,
						transparent: true,
						opacity: .55
					})]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: link,
				position: [
					2.6,
					0,
					0
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
						.55,
						.05,
						12,
						48
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: PALETTE.brass,
						roughness: .4,
						metalness: .7
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							.16,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							.19,
							24,
							20
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: PALETTE.maroon,
							roughness: .65
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							-.28,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
							.24,
							.24,
							6,
							20
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: PALETTE.navy,
							roughness: .8
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							-1.35,
							0,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							1.6,
							.03,
							.03
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: PALETTE.brass,
							metalness: .7,
							roughness: .4
						})]
					})
				]
			})
		]
	});
}
function Rig({ progress }) {
	useFrame((state, raw) => {
		const dt = Math.min(raw, .05);
		const p = progress.current ?? 0;
		const targetX = -.6 + p * 2;
		const targetY = .9 - p * .7;
		const targetZ = 8.6 - p * 1.6;
		const c = state.camera;
		const k = 1 - Math.exp(-6 * dt);
		c.position.x += (targetX - c.position.x) * k;
		c.position.y += (targetY - c.position.y) * k;
		c.position.z += (targetZ - c.position.z) * k;
		c.lookAt(.4, 0, 0);
	});
	return null;
}
function StoryScene({ progress, active = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
		dpr: [1, 2],
		frameloop: active ? "always" : "never",
		shadows: true,
		gl: {
			antialias: true,
			alpha: true
		},
		camera: {
			position: [
				-.6,
				.9,
				8.6
			],
			fov: 42
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
			fallback: null,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .6 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						5,
						6,
						5
					],
					intensity: 1.9,
					color: "#FFF3DC",
					castShadow: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						-6,
						2,
						3
					],
					intensity: .6,
					color: "#9FB4CE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						0,
						3,
						-6
					],
					intensity: .9,
					color: PALETTE.brassLight
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Environment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
					intensity: 1.4,
					position: [
						0,
						5,
						2
					],
					scale: [
						8,
						8,
						1
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
					intensity: .8,
					color: PALETTE.navy,
					position: [
						-5,
						1,
						-2
					],
					"rotation-y": Math.PI / 2,
					scale: [
						12,
						3,
						1
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pages, { progress }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rig, { progress })
			]
		})
	});
}
//#endregion
export { StoryScene as default };
