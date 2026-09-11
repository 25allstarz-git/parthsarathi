import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "./scene-support";

export type ProgressRef = React.RefObject<number>;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Eased 0→1 ramp between two progress marks. */
const seg = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function Pages({ progress }: { progress: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Mesh>(null);
  const marks = useRef<THREE.Group>(null);
  const link = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Group | null)[]>([]);

  const pages = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        start: [(i - 2) * 1.35, (i % 2 ? 0.5 : -0.4) + i * 0.12, (i - 2) * 0.5] as const,
        tilt: (i - 2) * 0.14,
      })),
    [],
  );

  useFrame(() => {
    const p = progress.current ?? 0;
    const gather = seg(p, 0.34, 0.66); // scattered pages → one stack
    const handoff = seg(p, 0.68, 1);

    meshes.current.forEach((m, i) => {
      if (!m) return;
      const s = pages[i]!;
      m.position.x = THREE.MathUtils.lerp(s.start[0], 0, gather);
      m.position.y = THREE.MathUtils.lerp(s.start[1], (i - 2) * 0.055, gather);
      m.position.z = THREE.MathUtils.lerp(s.start[2], (i - 2) * 0.02, gather);
      m.rotation.z = THREE.MathUtils.lerp(s.tilt, 0, gather);
      m.rotation.x = THREE.MathUtils.lerp(0, -0.18, gather);
    });

    if (scan.current) {
      const scanT = seg(p, 0.02, 0.32);
      scan.current.visible = scanT > 0.01 && scanT < 0.99;
      scan.current.position.y = THREE.MathUtils.lerp(1.9, -1.9, scanT);
    }
    if (marks.current) {
      const m = seg(p, 0.16, 0.42);
      marks.current.scale.set(m, m, 1);
      marks.current.visible = m > 0.02;
    }
    if (link.current) {
      link.current.scale.setScalar(Math.max(0.001, handoff));
      link.current.visible = handoff > 0.02;
    }
    if (group.current) {
      group.current.rotation.y = -0.5 + p * 0.85;
      group.current.position.z = p * 0.9;
    }
  });

  return (
    <group ref={group}>
      {pages.map((_, i) => (
        <group
          key={i}
          ref={(g) => {
            meshes.current[i] = g;
          }}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.55, 2.15, 0.02]} />
            <meshStandardMaterial color={i % 2 ? PALETTE.stone : PALETTE.stoneDim} roughness={0.95} />
          </mesh>
          {[0.7, 0.35, 0, -0.35, -0.7].map((y) => (
            <mesh key={y} position={[-0.1, y, 0.013]}>
              <planeGeometry args={[1.05, 0.055]} />
              <meshStandardMaterial color={PALETTE.navy} roughness={1} opacity={0.35} transparent />
            </mesh>
          ))}
        </group>
      ))}

      {/* scanning bar */}
      <mesh ref={scan} position={[0, 0, 0.9]}>
        <planeGeometry args={[5.6, 0.06]} />
        <meshBasicMaterial color={PALETTE.brassLight} transparent opacity={0.85} />
      </mesh>

      {/* highlighted fields */}
      <group ref={marks} position={[0, 0, 0.06]}>
        {[
          [-0.4, 0.7],
          [0.25, 0],
          [-0.2, -0.7],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x!, y!, 0]}>
            <planeGeometry args={[0.8, 0.14]} />
            <meshBasicMaterial color={PALETTE.brass} transparent opacity={0.55} />
          </mesh>
        ))}
      </group>

      {/* handoff to the advocate */}
      <group ref={link} position={[2.6, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.55, 0.05, 12, 48]} />
          <meshStandardMaterial color={PALETTE.brass} roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.19, 24, 20]} />
          <meshStandardMaterial color={PALETTE.maroon} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <capsuleGeometry args={[0.24, 0.24, 6, 20]} />
          <meshStandardMaterial color={PALETTE.navy} roughness={0.8} />
        </mesh>
        <mesh position={[-1.35, 0, 0]}>
          <boxGeometry args={[1.6, 0.03, 0.03]} />
          <meshStandardMaterial color={PALETTE.brass} metalness={0.7} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function Rig({ progress }: { progress: ProgressRef }) {
  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const p = progress.current ?? 0;
    const targetX = -0.6 + p * 2.0;
    const targetY = 0.9 - p * 0.7;
    const targetZ = 8.6 - p * 1.6;
    const c = state.camera;
    const k = 1 - Math.exp(-6 * dt);
    c.position.x += (targetX - c.position.x) * k;
    c.position.y += (targetY - c.position.y) * k;
    c.position.z += (targetZ - c.position.z) * k;
    c.lookAt(0.4, 0, 0);
  });
  return null;
}

export default function StoryScene({
  progress,
  active = true,
}: {
  progress: ProgressRef;
  active?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      shadows
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [-0.6, 0.9, 8.6], fov: 42 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 6, 5]} intensity={1.9} color="#FFF3DC" castShadow />
        <directionalLight position={[-6, 2, 3]} intensity={0.6} color="#9FB4CE" />
        <directionalLight position={[0, 3, -6]} intensity={0.9} color={PALETTE.brassLight} />
        <Environment>
          <Lightformer intensity={1.4} position={[0, 5, 2]} scale={[8, 8, 1]} />
          <Lightformer
            intensity={0.8}
            color={PALETTE.navy}
            position={[-5, 1, -2]}
            rotation-y={Math.PI / 2}
            scale={[12, 3, 1]}
          />
        </Environment>
        <Pages progress={progress} />
        <Rig progress={progress} />
      </Suspense>
    </Canvas>
  );
}
