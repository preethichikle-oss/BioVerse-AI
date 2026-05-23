import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

export default function HeroCell() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0.4, 5.2], fov: 46 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={2} color="#38f8ff" />
        <pointLight position={[-3, -2, 2]} intensity={1.7} color="#ff5bd6" />
        <Float floatIntensity={1.3} rotationIntensity={0.35}>
          <Cell />
        </Float>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.45} />
      </Canvas>
    </div>
  );
}

function Cell() {
  const ring = useRef();
  useFrame(() => {
    if (ring.current) ring.current.rotation.z += 0.008;
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.45, 64, 64]} />
        <meshPhysicalMaterial color="#68f7ff" transparent opacity={0.24} roughness={0.2} transmission={0.55} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.56, 48, 48]} />
        <meshStandardMaterial color="#7c5cff" emissive="#7c5cff" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-0.92, -0.25, 0.25]} scale={[0.52, 0.25, 0.25]}>
        <capsuleGeometry args={[0.5, 0.9, 12, 28]} />
        <meshStandardMaterial color="#ff5bd6" emissive="#ff5bd6" emissiveIntensity={0.4} />
      </mesh>
      <mesh ref={ring} rotation={[1.3, 0.2, 0]}>
        <torusGeometry args={[1.78, 0.015, 12, 120]} />
        <meshBasicMaterial color="#b8ff5d" />
      </mesh>
    </group>
  );
}
