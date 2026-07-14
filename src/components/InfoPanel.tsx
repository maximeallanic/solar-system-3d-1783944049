'use client';

import React, { useEffect, useState } from 'react';
import { useStore, getPlanetById } from '@/lib/store';
import { COLORS, SPACING, TYPOGRAPHY, ANIMATIONS, Z_INDEX, BREAKPOINTS } from '@/lib/designTokens';

// Map planet ids to their accent color for panel header bar
const PLANET_COLORS: Record<string, string> = {
  sun: '#FDB813',
  mercury: '#8C7853',
  venus: '#FFC649',
  earth: '#4A90E2',
  moon: '#C0C0C0',
  mars: '#E27B58',
  jupiter: '#F5DEB3',
  saturn: '#E8D4A8',
  uranus: '#A8D8EA',
  neptune: '#4166F5',
};

export const InfoPanel: React.FC = () => {
  const { selectedPlanetId, isPanelOpen, closePanel } = useStore();
  const planet = selectedPlanetId ? getPlanetById(selectedPlanetId) : null;
  const planetAccent = planet ? (PLANET_COLORS[planet.id] || COLORS.accentPrimary) : COLORS.accentPrimary;
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
        border: `1px solid rgba(0, 212, 255, 0.35)`,
        borderRadius: isMobile ? '20px 20px 0 0' : '12px',
        boxShadow: `0 8px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 212, 255, 0.08)`,
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
      {/* Planet accent bar */}
      <div
        style={{
          height: '3px',
          background: `linear-gradient(90deg, ${planetAccent}, transparent)`,
          borderRadius: '2px 2px 0 0',
          marginBottom: `${SPACING.sm}px`,
          marginLeft: `-${SPACING.md}px`,
          marginRight: `-${SPACING.md}px`,
          marginTop: `-${SPACING.md}px`,
        }}
      />

      {/* Header with close button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: `${SPACING.sm}px`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Planet color dot */}
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: planetAccent,
            boxShadow: `0 0 8px ${planetAccent}`,
            flexShrink: 0,
          }} />
          <h2
            style={{
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: isMobile ? TYPOGRAPHY.h2Mobile : TYPOGRAPHY.h2,
              fontWeight: TYPOGRAPHY.bold,
              color: COLORS.textPrimary,
              margin: 0,
              letterSpacing: '-0.3px',
            }}
          >
            {planet.name}
          </h2>
        </div>

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
          backgroundColor: `rgba(${planet.id === 'sun' ? '253, 184, 19' : '0, 212, 255'}, 0.06)`,
          border: `1px solid ${planetAccent}33`,
          borderLeft: `3px solid ${planetAccent}`,
          borderRadius: '0 8px 8px 0',
          padding: `${SPACING.sm}px`,
          marginBottom: `${SPACING.md}px`,
        }}
      >
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: '13px',
            fontStyle: 'italic',
            color: COLORS.textPrimary,
            margin: 0,
            lineHeight: 1.5,
            opacity: 0.85,
          }}
        >
          ✦ {planet.fact}
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
