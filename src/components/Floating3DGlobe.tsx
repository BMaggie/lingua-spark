
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Mesh } from 'three';

const Globe3D = () => {
  const meshRef = useRef<Mesh>(null);
  
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#10B981"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      {/* Continents/landmasses */}
      <mesh position={[0.2, 0.3, 0.8]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
      <mesh position={[-0.4, -0.2, 0.7]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
      <mesh position={[0.1, -0.5, 0.6]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
    </Float>
  );
};

const Floating3DGlobe = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-40 h-40 ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 3], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 3, 2]} intensity={1} />
          <Globe3D />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Floating3DGlobe;
