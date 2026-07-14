'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { InfoPanel } from '@/components/InfoPanel';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Dynamically import Scene to prevent SSR hydration mismatch
const Scene = dynamic(() => import('@/components/Scene').then(mod => ({ default: mod.Scene })), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: '#000' }} />,
});

// Subtle bottom-left HUD: controls hint
const ControlsHint: React.FC = () => (
  <div style={{
    position: 'fixed',
    bottom: '20px',
    left: '24px',
    display: 'flex',
    gap: '16px',
    zIndex: 10,
    pointerEvents: 'none',
  }}>
    {[
      { key: '⌖', label: 'Glisser · orbiter' },
      { key: '⊕', label: 'Molette · zoomer' },
      { key: '⬡', label: 'Cliquer · infos' },
    ].map(({ key, label }) => (
      <div key={label} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        opacity: 0.45,
      }}>
        <span style={{
          fontSize: '11px',
          color: '#00D4FF',
          fontFamily: '"Space Grotesk", sans-serif',
        }}>{key}</span>
        <span style={{
          fontSize: '11px',
          color: '#A9A9A9',
          fontFamily: '"Space Grotesk", sans-serif',
          letterSpacing: '0.3px',
        }}>{label}</span>
      </div>
    ))}
  </div>
);

export default function Home() {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Defer all rendering to client to avoid hydration mismatch
  if (!mounted) {
    return (
      <div style={{ width: '100%', height: '100%', background: '#000' }} suppressHydrationWarning>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} suppressHydrationWarning>
      {/* Three.js Canvas - fills remaining space */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', marginTop: '60px' }}>
        <Scene />
      </div>

      {/* UI Components */}
      <Header />
      <InfoPanel />
      <LoadingSpinner />
      <ControlsHint />
    </div>
  );
}
