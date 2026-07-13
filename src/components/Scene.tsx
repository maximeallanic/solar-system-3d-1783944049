'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS, SCENE } from '@/lib/designTokens';
import { PLANETS, useStore, getPlanetById } from '@/lib/store';

interface PlanetMeshProps {
  planet: typeof PLANETS[0];
}

// Sun component with glow
const Sun: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[30, 64, 64]} />
        <meshBasicMaterial color={COLORS.sun} />
      </mesh>
      {/* Sun glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[32, 64, 64]} />
        <meshBasicMaterial
          color={COLORS.sun}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
};

// Individual planet component with orbit
const PlanetComponent: React.FC<PlanetMeshProps> = ({ planet }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [angle, setPlanetAngle] = useState(0);
  const { openPanel } = useStore();

  useFrame(() => {
    if (orbitRef.current) {
      // Rotate orbit
      setPlanetAngle(a => (a + planet.speed * 0.001) % (Math.PI * 2));
    }
    
    if (meshRef.current) {
      // Rotate planet on its axis
      meshRef.current.rotation.y += 0.003;
    }
  });

  const x = Math.cos(angle) * planet.distance;
  const z = Math.sin(angle) * planet.distance;

  return (
    <group ref={orbitRef}>
      {/* Orbit line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={64}
            array={new Float32Array(
              Array.from({ length: 64 }, (_, i) => {
                const a = (i / 64) * Math.PI * 2;
                return [
                  Math.cos(a) * planet.distance,
                  0,
                  Math.sin(a) * planet.distance,
                ];
              }).flat()
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={COLORS.textSecondary} opacity={0.2} transparent />
      </line>

      {/* Planet mesh */}
      <mesh
        ref={meshRef}
        position={[x, 0, z]}
        onClick={() => openPanel(planet.id)}
        onPointerEnter={(e) => {
          e.object.scale.set(1.15, 1.15, 1.15);
        }}
        onPointerLeave={(e) => {
          e.object.scale.set(1, 1, 1);
        }}
      >
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshPhongMaterial color={planet.color} />
      </mesh>
    </group>
  );
};

// Saturn with rings
const Saturn: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [angle, setAngle] = useState(0);
  const saturn = getPlanetById('saturn');
  const { openPanel } = useStore();

  if (!saturn) return null;

  useFrame(() => {
    setAngle(a => (a + saturn.speed * 0.001) % (Math.PI * 2));
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const x = Math.cos(angle) * saturn.distance;
  const z = Math.sin(angle) * saturn.distance;

  return (
    <group ref={orbitRef}>
      {/* Orbit line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={64}
            array={new Float32Array(
              Array.from({ length: 64 }, (_, i) => {
                const a = (i / 64) * Math.PI * 2;
                return [
                  Math.cos(a) * saturn.distance,
                  0,
                  Math.sin(a) * saturn.distance,
                ];
              }).flat()
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={COLORS.textSecondary} opacity={0.2} transparent />
      </line>

      {/* Saturn planet */}
      <mesh
        ref={meshRef}
        position={[x, 0, z]}
        onClick={() => openPanel('saturn')}
        onPointerEnter={(e) => {
          if (e.object.name === 'planet') e.object.scale.set(1.15, 1.15, 1.15);
        }}
        onPointerLeave={(e) => {
          if (e.object.name === 'planet') e.object.scale.set(1, 1, 1);
        }}
        name="planet"
      >
        <sphereGeometry args={[saturn.size, 32, 32]} />
        <meshPhongMaterial color={saturn.color} />
      </mesh>

      {/* Saturn rings */}
      <mesh ref={ringRef} position={[x, 0, z]} rotation={[0.4, 0.2, 0]}>
        <ringGeometry args={[saturn.size * 1.8, saturn.size * 2.4, 32]} />
        <meshPhongMaterial
          color={COLORS.saturnRings}
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

// Starfield with parallax depth
const Starfield: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (groupRef.current) {
      // Subtle parallax effect based on camera position
      groupRef.current.position.x = camera.position.x * 0.05;
      groupRef.current.position.y = camera.position.y * 0.05;
      groupRef.current.position.z = camera.position.z * 0.05;
    }
  });

  // Create star positions
  const stars = Array.from({ length: SCENE.starCount }, () => ({
    x: (Math.random() - 0.5) * 4000,
    y: (Math.random() - 0.5) * 4000,
    z: (Math.random() - 0.5) * 4000,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  return (
    <group ref={groupRef}>
      {stars.map((star, i) => (
        <mesh key={i} position={[star.x, star.y, star.z]}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={star.opacity}
          />
        </mesh>
      ))}
    </group>
  );
};

// Scene lighting setup
const Lights: React.FC = () => {
  return (
    <>
      {/* Directional light from the Sun */}
      <directionalLight
        position={[100, 50, 100]}
        intensity={SCENE.lightIntensityDirectional}
        color="#FFEE99"
      />
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={SCENE.lightIntensityAmbient} color="#1A3A52" />
    </>
  );
};

// Controls manager
const ControlsManager: React.FC<{ controlsRef: React.RefObject<any> }> = ({ controlsRef }) => {
  const { resetView } = useStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const controls = controlsRef.current;
      if (!controls) return;

      switch (e.key) {
        case ' ':
          resetView();
          controls.reset();
          break;
        case 'Escape':
          resetView();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8': {
          const index = parseInt(e.key) - 1;
          if (PLANETS[index]) {
            useStore.setState({ selectedPlanetId: PLANETS[index].id, isPanelOpen: true });
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [resetView]);

  return null;
};

// Main Scene component
export const Scene: React.FC = () => {
  const controlsRef = useRef<any>(null);
  const { setLoading } = useStore();

  useEffect(() => {
    // Scene is ready after a short delay
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <Canvas
      className="w-full h-full"
      gl={{ antialias: true, alpha: false }}
      style={{ background: COLORS.bgSpace }}
    >
      <PerspectiveCamera
        makeDefault
        position={[0, 150, 200]}
        fov={SCENE.fov}
        near={SCENE.nearPlane}
        far={SCENE.farPlane}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        autoRotate={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={100}
        maxDistance={800}
      />

      <Lights />
      <Starfield />

      <Sun />
      {PLANETS.filter(p => p.id !== 'saturn').map((planet) => (
        <PlanetComponent key={planet.id} planet={planet} />
      ))}
      <Saturn />

      <ControlsManager controlsRef={controlsRef} />
    </Canvas>
  );
};
