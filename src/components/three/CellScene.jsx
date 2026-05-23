import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Html, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { organelles } from '../../data/organelles.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useGLTF } from '@react-three/drei';

export default function CellScene() {
  return (
    <div className="h-[58vh] min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/25 shadow-neon">
      <Canvas shadows dpr={[1, 1.7]}>
        <Suspense fallback={<Html center><span className="text-sm text-cyanGlow">Loading cell matrix...</span></Html>}>
          <PerspectiveCamera makeDefault position={[0, 1.8, 6]} fov={48} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[3, 4, 5]} intensity={2.2} castShadow />
          <pointLight position={[-3, -2, 3]} intensity={1.8} color="#ff5bd6" />
          <Environment preset="city" />
          <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.45}>
            <CellBody />
          </Float>
          <OrbitControls enablePan={false} minDistance={3.4} maxDistance={8} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function CellBody() {
  const selectedOrganelle = useLearningStore((state) => state.selectedOrganelle);
  const setSelectedOrganelle = useLearningStore((state) => state.setSelectedOrganelle);

  return (
    <group>
      <RealCellModel />
      <ParticleField />
    </group>
  );
}

function Membrane({ selected, onSelect }) {
  return (
    <mesh onClick={onSelect} castShadow receiveShadow>
      <sphereGeometry args={[2.25, 80, 80]} />
      <meshPhysicalMaterial
        color="#70f7ff"
        transparent
        opacity={selected ? 0.23 : 0.14}
        roughness={0.18}
        metalness={0.1}
        transmission={0.45}
        thickness={0.55}
        emissive="#38f8ff"
        emissiveIntensity={selected ? 0.32 : 0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Cytoplasm({ selected, onSelect }) {
  return (
    <mesh scale={[1.9, 1.45, 1.45]} onClick={onSelect}>
      <sphereGeometry args={[1, 56, 56]} />
      <meshStandardMaterial
        color="#8cf9dc"
        transparent
        opacity={selected ? 0.18 : 0.08}
        emissive="#0affc6"
        emissiveIntensity={selected ? 0.18 : 0.03}
      />
    </mesh>
  );
}

function Organelle({ data, selected, onSelect }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y += selected ? 0.018 : 0.006;
    const pulse = selected ? 1 + Math.sin(clock.elapsedTime * 5) * 0.07 : 1;
    ref.current.scale.set(data.scale[0] * pulse, data.scale[1] * pulse, data.scale[2] * pulse);
  });

  const geometry = getGeometry(data.name);

  return (
    <group position={data.position}>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        {geometry}
        <meshStandardMaterial
          color={data.color}
          roughness={0.28}
          metalness={0.18}
          emissive={data.color}
          emissiveIntensity={selected || hovered ? 0.55 : 0.14}
        />
      </mesh>
      {(selected || hovered) && (
        <Html distanceFactor={8} position={[0, 0.55, 0]} center>
          <div className="rounded-full border border-cyanGlow/40 bg-ink/90 px-3 py-1 text-xs font-semibold text-white shadow-neon backdrop-blur">
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function getGeometry(name) {
  if (name === 'Mitochondria') return <capsuleGeometry args={[0.52, 1.15, 16, 32]} />;
  if (name === 'Golgi Apparatus') return <torusKnotGeometry args={[0.45, 0.09, 80, 10]} />;
  if (name === 'Endoplasmic Reticulum') return <torusGeometry args={[0.75, 0.12, 14, 90]} />;
  if (name === 'Ribosomes' || name === 'Lysosomes') return <sphereGeometry args={[1, 32, 32]} />;
  return <sphereGeometry args={[1, 56, 56]} />;
}
function RealCellModel() {
  const { scene } = useGLTF('/models/humanCell.glb');
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;

    ref.current.rotation.y += 0.002;
    ref.current.position.y = Math.sin(clock.elapsedTime) * 0.08;
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={2.1}
      position={[0, -1, 0]}
    />
  );
}
function ParticleField() {
  const points = useRef();
  const positions = useMemo(() => {
    const values = new Float32Array(150 * 3);
    for (let index = 0; index < values.length; index += 3) {
      values[index] = (Math.random() - 0.5) * 4.1;
      values[index + 1] = (Math.random() - 0.5) * 3;
      values[index + 2] = (Math.random() - 0.5) * 3;
    }
    return values;
  }, []);

  useFrame(() => {
    if (points.current) points.current.rotation.y += 0.0015;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#b8ff5d" size={0.026} transparent opacity={0.65} />
    </points>
  );
}
