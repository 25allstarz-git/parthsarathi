import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "./scene-support";

const damp = (current: number, target: number, k: number, dt: number) =>
  target + (current - target) * Math.exp(-k * dt);

function Pan({ side }: { side: -1 | 1 }) {
  return (
    <group position={[side * 2.05, -0.06, 0]}>
      {[-0.42, 0.42].map((z) => (
        <mesh key={z} position={[0, -0.5, z]} rotation-x={z > 0 ? 0.72 : -0.72}>
          <cylinderGeometry args={[0.014, 0.014, 1.25, 6]} />
          <meshStandardMaterial color={PALETTE.brass} roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, -1.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.66, 0.075, 48]} />
        <meshStandardMaterial color={PALETTE.brass} roughness={0.42} metalness={0.75} />
      </mesh>
      <mesh position={[0, -0.97, 0]}>
        <torusGeometry args={[0.72, 0.028, 10, 48]} />
        <meshStandardMaterial color={PALETTE.brassLight} roughness={0.35} metalness={0.85} />
      </mesh>
    </group>
  );
}

function Scales({
  pointer,
  progress,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  progress: React.RefObject<number>;
}) {
  const root = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    t.current += dt;
    const p = pointer.current ?? { x: 0, y: 0 };
    const scroll = progress.current ?? 0;

    if (root.current) {
      root.current.rotation.y = damp(root.current.rotation.y, p.x * 0.32 + scroll * 0.2, 3, dt);
      root.current.rotation.x = damp(root.current.rotation.x, -p.y * 0.14 - scroll * 0.07, 3, dt);
      root.current.position.z = damp(root.current.position.z, scroll * 1.1, 3, dt);
    }
    if (beam.current) {
      // Settles toward balance over the first seconds, then breathes very slightly.
      const settle = Math.exp(-t.current * 1.1) * 0.2;
      const tilt = settle * Math.cos(t.current * 2.4) + Math.sin(t.current * 0.5) * 0.012 + p.x * 0.02;
      beam.current.rotation.z = tilt;
      if (left.current) left.current.rotation.z = -tilt;
      if (right.current) right.current.rotation.z = -tilt;
    }
  });

  const brass = <meshStandardMaterial color={PALETTE.brass} roughness={0.42} metalness={0.72} />;

  return (
    <group ref={root} position={[0, -0.5, 0]}>
      {/* base */}
      <mesh position={[0, -2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.55, 0.22, 56]} />
        <meshStandardMaterial color={PALETTE.navyDeep} roughness={0.85} metalness={0.1} />
      </mesh>
      <mesh position={[0, -2.32, 0]} castShadow>
        <cylinderGeometry args={[0.85, 1.15, 0.3, 56]} />
        <meshStandardMaterial color={PALETTE.maroon} roughness={0.7} metalness={0.15} />
      </mesh>
      {/* column */}
      <mesh position={[0, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.16, 3.1, 32]} />
        {brass}
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <sphereGeometry args={[0.19, 32, 24]} />
        <meshStandardMaterial color={PALETTE.brassLight} roughness={0.3} metalness={0.85} />
      </mesh>
      {/* beam + pans */}
      <group ref={beam} position={[0, 0.84, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.5, 0.1, 0.14]} />
          {brass}
        </mesh>
        <group ref={left}>
          <Pan side={-1} />
        </group>
        <group ref={right}>
          <Pan side={1} />
        </group>
      </group>
    </group>
  );
}

function DocumentPlanes({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const sheets = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        pos: [
          -4.4 + ((i * 1.63) % 8.8),
          -2.2 + ((i * 2.1) % 4.6),
          -3.2 - (i % 3) * 1.4,
        ] as [number, number, number],
        rot: [0.2 + i * 0.07, -0.35 + i * 0.16, 0.12 * (i % 2 ? 1 : -1)] as [number, number, number],
        speed: 0.16 + (i % 4) * 0.05,
        phase: i * 1.1,
      })),
    [],
  );
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const p = pointer.current ?? { x: 0, y: 0 };
    if (group.current) {
      group.current.position.x = damp(group.current.position.x, p.x * -0.6, 2, dt);
      group.current.position.y = damp(group.current.position.y, p.y * 0.4, 2, dt);
    }
    const now = performance.now() / 1000;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = sheets[i]!;
      mesh.position.y = s.pos[1] + Math.sin(now * s.speed + s.phase) * 0.32;
      mesh.rotation.z = s.rot[2] + Math.sin(now * s.speed * 0.7 + s.phase) * 0.05;
    });
  });

  return (
    <group ref={group}>
      {sheets.map((s, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={s.pos}
          rotation={s.rot}
        >
          <planeGeometry args={[1.5, 2.05]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? PALETTE.stoneDim : PALETTE.stone}
            roughness={0.95}
            metalness={0}
            transparent
            opacity={0.16 + (i % 3) * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function Studio(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      <ambientLight intensity={0.55} />
      {/* key */}
      <directionalLight
        position={[5, 7, 6]}
        intensity={2.1}
        color="#FFF3DC"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* fill */}
      <directionalLight position={[-6, 2, 4]} intensity={0.7} color="#9FB4CE" />
      {/* rim */}
      <directionalLight position={[-2, 4, -6]} intensity={1.1} color={PALETTE.brassLight} />
      <Environment>
        <Lightformer intensity={1.6} position={[0, 5, 2]} scale={[8, 8, 1]} color="#FFFFFF" />
        <Lightformer
          intensity={0.9}
          color={PALETTE.navy}
          position={[-5, 1, -2]}
          rotation-y={Math.PI / 2}
          scale={[14, 3, 1]}
        />
        <Lightformer
          intensity={0.7}
          color={PALETTE.brass}
          position={[5, 0, 1]}
          rotation-y={-Math.PI / 2}
          scale={[10, 3, 1]}
        />
      </Environment>
    </group>
  );
}

function CameraDolly({ progress }: { progress: React.RefObject<number> }) {
  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const scroll = progress.current ?? 0;
    state.camera.position.z = damp(state.camera.position.z, 9.4 - scroll * 1.25, 3, dt);
    state.camera.position.y = damp(state.camera.position.y, 0.4 + scroll * 0.35, 3, dt);
    state.camera.lookAt(0, -0.15 + scroll * 0.15, 0);
  });
  return null;
}

export default function JusticeScene({
  active = true,
  progress,
}: {
  active?: boolean;
  progress: React.RefObject<number>;
}) {
  const pointer = useRef({ x: 0, y: 0 });

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      shadows
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.4, 9.4], fov: 40 }}
      onPointerMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        pointer.current = {
          x: ((e.clientX - r.left) / r.width) * 2 - 1,
          y: ((e.clientY - r.top) / r.height) * 2 - 1,
        };
      }}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 };
      }}
    >
      <Suspense fallback={null}>
        <Studio />
        <CameraDolly progress={progress} />
        <DocumentPlanes pointer={pointer} />
        <Scales pointer={pointer} progress={progress} />
      </Suspense>
    </Canvas>
  );
}
