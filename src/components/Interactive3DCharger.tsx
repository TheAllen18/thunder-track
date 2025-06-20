
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ChargerProps {
  isActive: boolean;
}

const Charger = ({ isActive }: ChargerProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      if (isActive) {
        meshRef.current.rotation.x += delta * 0.2;
      }
    }
  });

  return (
    <group>
      {/* Main Charger Body */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial 
          color={hovered ? "#00ff00" : isActive ? "#0066ff" : "#666666"}
          emissive={isActive ? "#001122" : "#000000"}
        />
      </mesh>

      {/* Charging Cable */}
      <mesh position={[0.6, -0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial 
          color={isActive ? "#ffff00" : "#333333"}
        />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.3, 0.26]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial 
          color={isActive ? "#00ffff" : "#000000"}
          emissive={isActive ? "#004444" : "#000000"}
        />
      </mesh>
    </group>
  );
};

const Lights = () => {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={1}
        castShadow
      />
    </group>
  );
};

const Particles = ({ isActive }: { isActive: boolean }) => {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (particlesRef.current && isActive) {
      particlesRef.current.rotation.y += delta * 0.5;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color={isActive ? "#00ff00" : "#666666"} 
        size={0.1}
        transparent
        opacity={isActive ? 0.8 : 0.3}
      />
    </points>
  );
};

const Interactive3DCharger = ({ isActive }: ChargerProps) => {
  return (
    <div className="w-full h-64 bg-gradient-to-br from-gray-900 to-blue-900 rounded-lg overflow-hidden shadow-2xl border border-blue-500/30">
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Lights />
        <Charger isActive={isActive} />
        <Particles isActive={isActive} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
};

export default Interactive3DCharger;
