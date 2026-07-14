'use client';

import React from 'react';
import { Scene } from '@/components/Scene';
import { Header } from '@/components/Header';
import { InfoPanel } from '@/components/InfoPanel';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Three.js Canvas - fills remaining space */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', marginTop: '60px' }}>
        <React.Suspense fallback={<div>Chargement...</div>}>
          <Scene />
        </React.Suspense>
      </div>

      {/* UI Components */}
      <Header />
      <InfoPanel />
      <LoadingSpinner />
      <ControlsHint />
    </div>
  );
}
