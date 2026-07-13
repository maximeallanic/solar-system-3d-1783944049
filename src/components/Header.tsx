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
            padding: '10px 20px',
            border: `1px solid ${COLORS.textSecondary}`,
            background: 'transparent',
            color: COLORS.textSecondary,
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: TYPOGRAPHY.semi,
            cursor: 'pointer',
            fontFamily: TYPOGRAPHY.fontFamily,
            transition: 'all 150ms ease-out',
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.borderColor = COLORS.textPrimary;
            target.style.color = COLORS.textPrimary;
            target.style.boxShadow = `0 0 8px rgba(240, 240, 240, 0.2)`;
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.borderColor = COLORS.textSecondary;
            target.style.color = COLORS.textSecondary;
            target.style.boxShadow = 'none';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Réinitialiser Vue
        </button>

        <button
          onClick={() => alert('Aide:\nGlissez pour orbiter\nRoulette pour zoomer\nCliquez sur une planète pour plus d\'informations\nBarre d\'espace pour réinitialiser')}
          aria-label="Show help and instructions"
          style={{
            padding: '10px 20px',
            border: `1px solid ${COLORS.textSecondary}`,
            background: 'transparent',
            color: COLORS.textSecondary,
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: TYPOGRAPHY.semi,
            cursor: 'pointer',
            fontFamily: TYPOGRAPHY.fontFamily,
            transition: 'all 150ms ease-out',
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.borderColor = COLORS.textPrimary;
            target.style.color = COLORS.textPrimary;
            target.style.boxShadow = `0 0 8px rgba(240, 240, 240, 0.2)`;
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.borderColor = COLORS.textSecondary;
            target.style.color = COLORS.textSecondary;
            target.style.boxShadow = 'none';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Aide
        </button>
      </div>
    </header>
  );
};
