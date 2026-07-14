'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/designTokens';

export const Header: React.FC = () => {
  const { resetView } = useStore();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 100%)',
        borderBottom: `1px solid rgba(0, 212, 255, 0.2)`,
        backdropFilter: 'blur(10px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${SPACING.lg}px`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: `${SPACING.sm}px` }}>
        {/* Logo */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          style={{ fill: COLORS.accentPrimary }}
        >
          <circle cx="20" cy="20" r="8" />
          <circle cx="20" cy="20" r="12" fill="none" stroke={COLORS.accentPrimary} strokeWidth="1" />
          <circle cx="20" cy="20" r="16" fill="none" stroke={COLORS.accentPrimary} strokeWidth="0.5" opacity="0.5" />
        </svg>

        {/* Title */}
        <h1
          style={{
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: '28px',
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.textPrimary,
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          Système Solaire
        </h1>
      </div>

      {/* Right buttons */}
      <div style={{ display: 'flex', gap: `${SPACING.sm - 4}px`, alignItems: 'center' }}>
        <button
          onClick={() => resetView()}
          aria-label="Reset camera to home view"
          style={{
            padding: '8px 18px',
            border: `1px solid rgba(0, 212, 255, 0.4)`,
            background: 'rgba(0, 212, 255, 0.06)',
            color: COLORS.accentPrimary,
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: TYPOGRAPHY.semi,
            cursor: 'pointer',
            fontFamily: TYPOGRAPHY.fontFamily,
            transition: 'all 150ms ease-out',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.background = 'rgba(0, 212, 255, 0.15)';
            target.style.borderColor = COLORS.accentPrimary;
            target.style.boxShadow = `0 0 12px rgba(0, 212, 255, 0.3)`;
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.background = 'rgba(0, 212, 255, 0.06)';
            target.style.borderColor = 'rgba(0, 212, 255, 0.4)';
            target.style.boxShadow = 'none';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ↺ Réinitialiser
        </button>

        <button
          onClick={() => alert('Aide:\n🖱 Glisser pour orbiter\n🔲 Molette pour zoomer\n🪐 Cliquer sur une planète pour infos\n[1-8] Raccourcis clavier planètes\n[Espace] Réinitialiser vue')}
          aria-label="Show help and instructions"
          style={{
            padding: '8px 18px',
            border: `1px solid rgba(0, 212, 255, 0.25)`,
            background: 'transparent',
            color: COLORS.textSecondary,
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: TYPOGRAPHY.semi,
            cursor: 'pointer',
            fontFamily: TYPOGRAPHY.fontFamily,
            transition: 'all 150ms ease-out',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.borderColor = COLORS.accentPrimary;
            target.style.color = COLORS.accentPrimary;
            target.style.boxShadow = `0 0 8px rgba(0, 212, 255, 0.2)`;
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.borderColor = 'rgba(0, 212, 255, 0.25)';
            target.style.color = COLORS.textSecondary;
            target.style.boxShadow = 'none';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ? Aide
        </button>
      </div>
    </header>
  );
};
