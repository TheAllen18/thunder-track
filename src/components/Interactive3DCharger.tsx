
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, MeshWobbleMaterial, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

const EVCharger3D = ({ isCharging }: { isCharging: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group>
      {/* Main charger body */}
      <Box
        ref={meshRef}
        args={[1, 2, 0.5]}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <MeshWobbleMaterial
          color={isCharging ? "#00ff00" : "#4ade80"}
          factor={isCharging ? 0.6 : 0.2}
          speed={isCharging ? 3 : 1}
        />
      </Box>
      
      {/* Charging cable */}
      <Box args={[0.1, 1.5, 0.1]} position={[0.7, -0.5, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
      
      {/* Floating energy particles when charging */}
      {isCharging && (
        <>
          {[...Array(10)].map((_, i) => (
            <Sphere key={i} args={[0.05]} position={[
              Math.sin(i * 0.6 + Date.now() * 0.005) * 2,
              Math.cos(i * 0.8 + Date.now() * 0.003) * 2,
              Math.sin(i * 0.4 + Date.now() * 0.004) * 2
            ]}>
              <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
            </Sphere>
          ))}
        </>
      )}
      
      {/* Holographic text */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        {isCharging ? "⚡ CHARGING ⚡" : "Thunder Track 3D"}
      </Text>
    </group>
  );
};

const Interactive3DCharger = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="w-full h-96 bg-black/20 rounded-xl overflow-hidden border border-green-500/30">
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#00ff88"
        />
        <EVCharger3D isCharging={isActive} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {/* Starfield background */}
        {[...Array(200)].map((_, i) => (
          <Sphere
            key={i}
            args={[0.02]}
            position={[
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 50
            ]}
          >
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.8} />
          </Sphere>
        ))}
      </Canvas>
    </div>
  );
};

export default Interactive3DCharger;
