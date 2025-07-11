
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Mesh } from 'three';

const Book3D = () => {
  const meshRef = useRef<Mesh>(null);
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} rotation={[0.2, 0.5, 0]}>
        <boxGeometry args={[1.2, 1.6, 0.2]} />
        <meshStandardMaterial 
          color="#4F46E5" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Book pages */}
      <mesh position={[0.05, 0, 0.11]} rotation={[0.2, 0.5, 0]}>
        <boxGeometry args={[1.1, 1.5, 0.15]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.8}
        />
      </mesh>
    </Float>
  );
};

const Floating3DBook = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-32 h-32 ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 2, 1]} intensity={0.8} />
          <Book3D />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Floating3DBook;
