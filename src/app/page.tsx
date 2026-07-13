'use client';

import React from 'react';
import { Scene } from '@/components/Scene';
import { Header } from '@/components/Header';
import { InfoPanel } from '@/components/InfoPanel';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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
    </div>
  );
}
