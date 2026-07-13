'use client';

import React, { useEffect, useState } from 'react';
import { useStore, getPlanetById } from '@/lib/store';
import { COLORS, SPACING, TYPOGRAPHY, ANIMATIONS, Z_INDEX, BREAKPOINTS } from '@/lib/designTokens';

export const InfoPanel: React.FC = () => {
  const { selectedPlanetId, isPanelOpen, closePanel } = useStore();
  const planet = selectedPlanetId ? getPlanetById(selectedPlanetId) : null;
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.desktop);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isPanelOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), ANIMATIONS.panelSlideOut);
      return () => clearTimeout(timer);
    }
  }, [isPanelOpen]);

  if (!planet || !isVisible) return null;

  const panelWidth = isMobile ? '100%' : '340px';
  const panelMaxWidth = isMobile ? 'none' : '380px';
  
  const getPositionStyle = () => {
    if (isMobile) {
      return {
        position: 'fixed' as const,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: '20px 20px 0 0',
        height: '70vh',
        minHeight: '300px',
        width: '100%',
        transform: isPanelOpen ? 'translateY(0)' : 'translateY(100%)',
      };
    }
    
    return {
      position: 'fixed' as const,
      right: `${SPACING.lg}px`,
      bottom: `${SPACING.lg}px`,
      width: panelWidth,
      maxWidth: panelMaxWidth,
      height: 'auto',
      transform: isPanelOpen ? 'translateX(0)' : 'translateX(120%)',
    };
  };

  return (
    <div
      style={{
        ...getPositionStyle(),
        background: COLORS.panelBg,
        border: `1px solid ${COLORS.panelBorder}`,
        borderRadius: isMobile ? '20px 20px 0 0' : '12px',
        boxShadow: COLORS.panelShadow,
        backdropFilter: 'blur(10px)',
        zIndex: Z_INDEX.panel,
        padding: `${SPACING.md}px`,
        transition: isMobile
          ? `transform ${isPanelOpen ? ANIMATIONS.panelSlideIn : ANIMATIONS.panelSlideOut}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
          : `transform ${isPanelOpen ? ANIMATIONS.panelSlideIn : ANIMATIONS.panelSlideOut}ms ease-out`,
        overflow: 'auto',
      }}
      role="dialog"
      aria-label={`Information about ${planet.name}`}
    >
      {/* Header with close button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: `${SPACING.md}px`,
        }}
      >
        <h2
          style={{
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: isMobile ? TYPOGRAPHY.h2Mobile : TYPOGRAPHY.h2,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.textPrimary,
            margin: 0,
          }}
        >
          {planet.name}
        </h2>

        <button
          onClick={closePanel}
          aria-label="Close information panel"
          style={{
            background: 'transparent',
            border: 'none',
            color: COLORS.textSecondary,
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 150ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = COLORS.accentPrimary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = COLORS.textSecondary;
          }}
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: TYPOGRAPHY.fontFamily,
          fontSize: isMobile ? TYPOGRAPHY.bodyMobile : TYPOGRAPHY.body,
          color: COLORS.textPrimary,
          lineHeight: TYPOGRAPHY.lhNormal,
          margin: 0,
          marginBottom: `${SPACING.md}px`,
        }}
      >
        {planet.description}
      </p>

      {/* Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: `${SPACING.md}px`,
          marginBottom: `${SPACING.md}px`,
        }}
      >
        <div>
          <dt
            style={{
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: TYPOGRAPHY.label,
              fontWeight: TYPOGRAPHY.semi,
              color: COLORS.accentPrimary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px',
            }}
          >
            Type
          </dt>
          <dd
            style={{
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: isMobile ? TYPOGRAPHY.bodyMobile : TYPOGRAPHY.body,
              color: COLORS.textPrimary,
              margin: 0,
            }}
          >
            {planet.type}
          </dd>
        </div>

        <div>
          <dt
            style={{
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: TYPOGRAPHY.label,
              fontWeight: TYPOGRAPHY.semi,
              color: COLORS.accentPrimary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px',
            }}
          >
            Distance (UA)
          </dt>
          <dd
            style={{
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: isMobile ? TYPOGRAPHY.bodyMobile : TYPOGRAPHY.body,
              color: COLORS.textPrimary,
              margin: 0,
            }}
          >
            {(planet.distance / 30).toFixed(1)}
          </dd>
        </div>
      </div>

      {/* Fact */}
      <div
        style={{
          backgroundColor: 'rgba(0, 212, 255, 0.05)',
          border: `1px solid rgba(0, 212, 255, 0.2)`,
          borderRadius: '8px',
          padding: `${SPACING.sm}px`,
          marginBottom: `${SPACING.md}px`,
        }}
      >
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: TYPOGRAPHY.label,
            fontStyle: 'italic',
            color: COLORS.textSecondary,
            margin: 0,
            lineHeight: TYPOGRAPHY.lhNormal,
          }}
        >
          💫 {planet.fact}
        </p>
      </div>

      {/* Close button for mobile */}
      {isMobile && (
        <button
          onClick={closePanel}
          style={{
            width: '100%',
            padding: `${SPACING.sm}px`,
            border: `1px solid ${COLORS.accentPrimary}`,
            background: 'transparent',
            color: COLORS.accentPrimary,
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: TYPOGRAPHY.semi,
            cursor: 'pointer',
            fontFamily: TYPOGRAPHY.fontFamily,
            transition: 'all 150ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `rgba(0, 212, 255, 0.1)`;
            e.currentTarget.style.boxShadow = COLORS.btnGlow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Fermer
        </button>
      )}
    </div>
  );
};
