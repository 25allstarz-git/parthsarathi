import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as PALETTE } from "./scene-support-B_1_89uG.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useFrame, n as Environment, r as Canvas, t as Lightformer } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/JusticeScene-eBxHhhCu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var damp = (current, target, k, dt) => target + (current - target) * Math.exp(-k * dt);
function Pan({ side }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			side * 2.05,
			-.06,
			0
		],
		children: [
			[-.42, .42].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.5,
					z
				],
				"rotation-x": z > 0 ? .72 : -.72,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.014,
					.014,
					1.25,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: PALETTE.brass,
					roughness: .5,
					metalness: .6
				})]
			}, z)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-1.02,
					0
				],
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.72,
					.66,
					.075,
					48
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: PALETTE.brass,
					roughness: .42,
					metalness: .75
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.97,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.72,
					.028,
					10,
					48
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: PALETTE.brassLight,
					roughness: .35,
					metalness: .85
				})]
			})
		]
	});
}
function Scales({ pointer, progress }) {
	const root = (0, import_react.useRef)(null);
	const beam = (0, import_react.useRef)(null);
	const left = (0, import_react.useRef)(null);
	const right = (0, import_react.useRef)(null);
	const t = (0, import_react.useRef)(0);
	useFrame((_, raw) => {
		const dt = Math.min(raw, .05);
		t.current += dt;
		const p = pointer.current ?? {
			x: 0,
			y: 0
		};
		const scroll = progress.current ?? 0;
		if (root.current) {
			root.current.rotation.y = damp(root.current.rotation.y, p.x * .32 + scroll * .2, 3, dt);
			root.current.rotation.x = damp(root.current.rotation.x, -p.y * .14 - scroll * .07, 3, dt);
			root.current.position.z = damp(root.current.position.z, scroll * 1.1, 3, dt);
		}
		if (beam.current) {
			const tilt = Math.exp(-t.current * 1.1) * .2 * Math.cos(t.current * 2.4) + Math.sin(t.current * .5) * .012 + p.x * .02;
			beam.current.rotation.z = tilt;
			if (left.current) left.current.rotation.z = -tilt;
			if (right.current) right.current.rotation.z = -tilt;
		}
	});
	const brass = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
		color: PALETTE.brass,
		roughness: .42,
		metalness: .72
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: root,
		position: [
			0,
			-.5,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-2.5,
					0
				],
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					1.35,
					1.55,
					.22,
					56
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: PALETTE.navyDeep,
					roughness: .85,
					metalness: .1
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-2.32,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.85,
					1.15,
					.3,
					56
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: PALETTE.maroon,
					roughness: .7,
					metalness: .15
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.7,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.11,
					.16,
					3.1,
					32
				] }), brass]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.92,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.19,
					32,
					24
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: PALETTE.brassLight,
					roughness: .3,
					metalness: .85
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: beam,
				position: [
					0,
					.84,
					0
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						castShadow: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							4.5,
							.1,
							.14
						] }), brass]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
						ref: left,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pan, { side: -1 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
						ref: right,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pan, { side: 1 })
					})
				]
			})
		]
	});
}
function DocumentPlanes({ pointer }) {
	const group = (0, import_react.useRef)(null);
	const sheets = (0, import_react.useMemo)(() => Array.from({ length: 7 }, (_, i) => ({
		pos: [
			-4.4 + i * 1.63 % 8.8,
			-2.2 + i * 2.1 % 4.6,
			-3.2 - i % 3 * 1.4
		],
		rot: [
			.2 + i * .07,
			-.35 + i * .16,
			.12 * (i % 2 ? 1 : -1)
		],
		speed: .16 + i % 4 * .05,
		phase: i * 1.1
	})), []);
	const refs = (0, import_react.useRef)([]);
	useFrame((_, raw) => {
		const dt = Math.min(raw, .05);
		const p = pointer.current ?? {
			x: 0,
			y: 0
		};
		if (group.current) {
			group.current.position.x = damp(group.current.position.x, p.x * -.6, 2, dt);
			group.current.position.y = damp(group.current.position.y, p.y * .4, 2, dt);
		}
		const now = performance.now() / 1e3;
		refs.current.forEach((mesh, i) => {
			if (!mesh) return;
			const s = sheets[i];
			mesh.position.y = s.pos[1] + Math.sin(now * s.speed + s.phase) * .32;
			mesh.rotation.z = s.rot[2] + Math.sin(now * s.speed * .7 + s.phase) * .05;
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: group,
		children: sheets.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: (m) => {
				refs.current[i] = m;
			},
			position: s.pos,
			rotation: s.rot,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.5, 2.05] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: i % 3 === 0 ? PALETTE.stoneDim : PALETTE.stone,
				roughness: .95,
				metalness: 0,
				transparent: true,
				opacity: .16 + i % 3 * .05,
				side: 2
			})]
		}, i))
	});
}
function Studio(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .55 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					5,
					7,
					6
				],
				intensity: 2.1,
				color: "#FFF3DC",
				castShadow: true,
				"shadow-mapSize-width": 1024,
				"shadow-mapSize-height": 1024
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					-6,
					2,
					4
				],
				intensity: .7,
				color: "#9FB4CE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					-2,
					4,
					-6
				],
				intensity: 1.1,
				color: PALETTE.brassLight
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Environment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
					intensity: 1.6,
					position: [
						0,
						5,
						2
					],
					scale: [
						8,
						8,
						1
					],
					color: "#FFFFFF"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
					intensity: .9,
					color: PALETTE.navy,
					position: [
						-5,
						1,
						-2
					],
					"rotation-y": Math.PI / 2,
					scale: [
						14,
						3,
						1
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
					intensity: .7,
					color: PALETTE.brass,
					position: [
						5,
						0,
						1
					],
					"rotation-y": -Math.PI / 2,
					scale: [
						10,
						3,
						1
					]
				})
			] })
		]
	});
}
function CameraDolly({ progress }) {
	useFrame((state, raw) => {
		const dt = Math.min(raw, .05);
		const scroll = progress.current ?? 0;
		state.camera.position.z = damp(state.camera.position.z, 9.4 - scroll * 1.25, 3, dt);
		state.camera.position.y = damp(state.camera.position.y, .4 + scroll * .35, 3, dt);
		state.camera.lookAt(0, -.15 + scroll * .15, 0);
	});
	return null;
}
function JusticeScene({ active = true, progress }) {
	const pointer = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
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
				0,
				.4,
				9.4
			],
			fov: 40
		},
		onPointerMove: (e) => {
			const r = e.currentTarget.getBoundingClientRect();
			pointer.current = {
				x: (e.clientX - r.left) / r.width * 2 - 1,
				y: (e.clientY - r.top) / r.height * 2 - 1
			};
		},
		onPointerLeave: () => {
			pointer.current = {
				x: 0,
				y: 0
			};
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
			fallback: null,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraDolly, { progress }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentPlanes, { pointer }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scales, {
					pointer,
					progress
				})
			]
		})
	});
}
//#endregion
export { JusticeScene as default };
