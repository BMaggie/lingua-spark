
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Mesh } from 'three';

const Brain3D = () => {
  const meshRef = useRef<Mesh>(null);
  
  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={1.5}>
      <group>
        {/* Main brain shape */}
        <mesh ref={meshRef} position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial
            color="#8B5CF6"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
        {/* Brain hemispheres detail */}
        <mesh position={[-0.3, 0.1, 0.2]} scale={[0.6, 0.8, 0.9]}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial
            color="#7C3AED"
            roughness={0.7}
          />
        </mesh>
        <mesh position={[0.3, 0.1, 0.2]} scale={[0.6, 0.8, 0.9]}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial
            color="#7C3AED"
            roughness={0.7}
          />
        </mesh>
        {/* Neural connections */}
        <mesh position={[0, 0.4, 0.3]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#A855F7" emissive="#4C1D95" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.2, 0.2, 0.4]} rotation={[0.5, 0, 0.3]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2]} />
          <meshStandardMaterial color="#A855F7" emissive="#4C1D95" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </Float>
  );
};

const Floating3DBrain = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-36 h-36 ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 3], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 3, 1]} intensity={0.9} />
          <pointLight position={[-2, -1, 1]} intensity={0.3} color="#8B5CF6" />
          <Brain3D />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Floating3DBrain;
