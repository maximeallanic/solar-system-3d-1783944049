'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { COLORS, TYPOGRAPHY, ANIMATIONS } from '@/lib/designTokens';

export const LoadingSpinner: React.FC = () => {
  const { isLoading } = useStore();
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
    setShouldRender(true);
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.bgSpace,
        zIndex: 1000,
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 200ms ease-out',
      }}
    >
      {/* Spinner */}
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        style={{
          animation: `spin ${ANIMATIONS.panelSlideIn * 1.2}ms linear infinite`,
          marginBottom: '16px',
        }}
      >
        <circle
          cx="30"
          cy="30"
          r="25"
          fill="none"
          stroke={COLORS.accentPrimary}
          strokeWidth="2"
          opacity="0.3"
        />
        <circle
          cx="30"
          cy="30"
          r="25"
          fill="none"
          stroke={COLORS.accentPrimary}
          strokeWidth="2"
          strokeDasharray="40 100"
          strokeLinecap="round"
        />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </svg>

      {/* Loading text */}
      <p
        style={{
          fontFamily: TYPOGRAPHY.fontFamily,
          fontSize: TYPOGRAPHY.label,
          color: COLORS.textSecondary,
          textAlign: 'center',
          margin: 0,
        }}
      >
        Chargement du Système Solaire...
      </p>
    </div>
  );
};
