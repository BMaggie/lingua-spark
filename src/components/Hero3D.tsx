
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

const AnimatedSphere = () => {
  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial
          color="#667eea"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.2}
        />
      </Sphere>
    </Float>
  );
};

const BookFloat = ({ position }: { position: [number, number, number] }) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position} rotation={[0.2, 0.5, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.05]} />
        <meshStandardMaterial color="#764ba2" />
      </mesh>
    </Float>
  );
};

const Hero3D = () => {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          
          <AnimatedSphere />
          <BookFloat position={[-3, 1, 0]} />
          <BookFloat position={[3, -1, 0]} />
          <BookFloat position={[2, 2, -1]} />
          <BookFloat position={[-2, -2, -1]} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-50/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default Hero3D;
