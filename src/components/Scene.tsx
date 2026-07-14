'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS, SCENE } from '@/lib/designTokens';
import { PLANETS, useStore, getPlanetById } from '@/lib/store';

// Procedural texture generator for planets
const createPlanetTexture = (planetId: string): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  switch (planetId) {
    case 'sun':
      // Yellow/orange gradient with noise
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const dist = Math.hypot(x - 128, y - 128) / 128;
          const noise = Math.random() * 0.3;
          const hue = (20 + noise * 30) % 360;
          const sat = Math.min(100, 100 - dist * 50);
          const light = Math.max(50, 80 - dist * 30);
          ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      break;
    case 'mercury':
      // Grey cratered surface
      ctx.fillStyle = '#8C7853';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const r = Math.random() * 8 + 2;
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 'venus':
      // Thick yellow-white clouds
      ctx.fillStyle = '#FFC649';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 30 + 5, 2);
      }
      break;
    case 'earth':
      // Blue with continents
      ctx.fillStyle = '#4A90E2';
      ctx.fillRect(0, 0, 256, 256);
      // Continents
      ctx.fillStyle = '#2ECC71';
      for (let i = 0; i < 15; i++) {
        ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 40 + 20, Math.random() * 40 + 20);
      }
      break;
    case 'mars':
      // Red with dust storms
      ctx.fillStyle = '#E27B58';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(139,69,19,${Math.random() * 0.3})`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 20 + 5, Math.random() * 20 + 5);
      }
      break;
    case 'jupiter':
      // Bands of clouds
      ctx.fillStyle = '#F5DEB3';
      ctx.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y += 16) {
        ctx.fillStyle = `rgba(139,69,19,${0.2 + Math.sin(y / 20) * 0.2})`;
        ctx.fillRect(0, y, 256, 8);
      }
      // Great Red Spot
      ctx.fillStyle = 'rgba(200,100,50,0.6)';
      ctx.beginPath();
      ctx.ellipse(180, 140, 30, 20, 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'saturn':
      // Pale yellow with bands
      ctx.fillStyle = '#E8D4A8';
      ctx.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y += 20) {
        ctx.fillStyle = `rgba(200,180,100,${0.15 + Math.sin(y / 25) * 0.1})`;
        ctx.fillRect(0, y, 256, 10);
      }
      break;
    case 'uranus':
      // Cyan/light blue
      ctx.fillStyle = '#A8D8EA';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 40 + 10, 2);
      }
      break;
    case 'neptune':
      // Deep blue with storm
      ctx.fillStyle = '#4166F5';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = 'rgba(30,50,150,0.5)';
      ctx.fillRect(0, 80, 256, 60);
      // Great Dark Spot
      ctx.fillStyle = 'rgba(20,30,100,0.8)';
      ctx.beginPath();
      ctx.ellipse(200, 120, 25, 35, -0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'moon':
      // Grey crater surface
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const r = Math.random() * 6 + 1;
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    default:
      ctx.fillStyle = '#999999';
      ctx.fillRect(0, 0, 256, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
};

interface PlanetMeshProps {
  planet: typeof PLANETS[0];
}

// Sun component with glow
const Sun: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const sunTexture = useMemo(() => createPlanetTexture('sun'), []);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[30, 64, 64]} />
        <meshBasicMaterial map={sunTexture} />
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
  const planetTexture = useMemo(() => createPlanetTexture(planet.id), [planet.id]);

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
        <meshPhongMaterial map={planetTexture} />
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
  const saturnTexture = useMemo(() => createPlanetTexture('saturn'), []);

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
        <meshPhongMaterial map={saturnTexture} />
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

// Moon component (orbits Earth)
const Moon: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [angle, setAngle] = useState(0);
  const earthPlanet = getPlanetById('earth');
  const moon = getPlanetById('moon');
  const { openPanel } = useStore();
  const moonTexture = useMemo(() => createPlanetTexture('moon'), []);

  if (!moon || !earthPlanet) return null;

  useFrame(() => {
    setAngle(a => (a + moon.speed * 0.001) % (Math.PI * 2));
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  // Position relative to Earth
  const earthX = Math.cos((earthPlanet.angle) * 0.001) * earthPlanet.distance;
  const earthZ = Math.sin((earthPlanet.angle) * 0.001) * earthPlanet.distance;
  
  const moonOrbitRadius = 12;
  const moonX = earthX + Math.cos(angle) * moonOrbitRadius;
  const moonZ = earthZ + Math.sin(angle) * moonOrbitRadius;

  return (
    <group ref={orbitRef}>
      {/* Moon mesh */}
      <mesh
        ref={meshRef}
        position={[moonX, 0, moonZ]}
        onClick={() => openPanel('moon')}
        onPointerEnter={(e) => {
          e.object.scale.set(1.2, 1.2, 1.2);
        }}
        onPointerLeave={(e) => {
          e.object.scale.set(1, 1, 1);
        }}
      >
        <sphereGeometry args={[moon.size, 24, 24]} />
        <meshPhongMaterial map={moonTexture} />
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
      {PLANETS.filter(p => p.id !== 'saturn' && p.id !== 'moon').map((planet) => (
        <PlanetComponent key={planet.id} planet={planet} />
      ))}
      <Saturn />
      <Moon />

      <ControlsManager controlsRef={controlsRef} />
    </Canvas>
  );
};
