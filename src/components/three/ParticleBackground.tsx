"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const particlesCount = 2000;

  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#06b6d4"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);
  const mesh3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.5 + 2;
    }

    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.x = time * 0.3;
      mesh2Ref.current.rotation.z = time * 0.2;
      mesh2Ref.current.position.y = Math.cos(time * 0.4) * 0.5 - 2;
    }

    if (mesh3Ref.current) {
      mesh3Ref.current.rotation.y = time * 0.25;
      mesh3Ref.current.rotation.z = time * 0.15;
      mesh3Ref.current.position.x = Math.sin(time * 0.3) * 0.5 + 3;
    }
  });

  return (
    <>
      {/* Floating Icosahedron */}
      <mesh ref={meshRef} position={[-3, 2, -2]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floating Octahedron */}
      <mesh ref={mesh2Ref} position={[3, -2, -3]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floating Torus */}
      <mesh ref={mesh3Ref} position={[4, 1, -4]}>
        <torusGeometry args={[0.4, 0.15, 16, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </>
  );
}

function GradientPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -8]} rotation={[0, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial color="#0a0a0f" transparent opacity={0.5} />
    </mesh>
  );
}

export function ParticleBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0a0f"]} />
        <ambientLight intensity={0.5} />
        <GradientPlane />
        <ParticleField />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}
