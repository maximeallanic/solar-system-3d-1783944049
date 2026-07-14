/**
 * Design Tokens - From the design specification
 * Copy-paste ready constants for colors, spacing, typography
 */

export const COLORS = {
  // Scene & Background
  bgSpace: '#000000',
  textPrimary: '#F0F0F0',
  textSecondary: '#A9A9A9',
  
  // UI Accents
  accentPrimary: '#00D4FF',    // Cyan
  accentSecondary: '#9D4EDD',  // Purple
  accentSuccess: '#39FF14',    // Lime
  
  // Planets
  sun: '#FDB813',
  jupiter: '#F5DEB3',
  saturn: '#E8D4A8',
  saturnRings: '#D2B48C',
  uranus: '#A8D8EA',
  neptune: '#4166F5',
  earth: '#4A90E2',
  mars: '#E27B58',
  venus: '#FFC649',
  mercury: '#8C7853',
  
  // UI Components
  panelBg: 'rgba(15, 15, 15, 0.92)',
  panelBorder: '#00D4FF',
  panelShadow: '0 8px 32px rgba(0, 212, 255, 0.15)',
  btnGlow: '0 0 12px rgba(0, 212, 255, 0.4)',
};

export const TYPOGRAPHY = {
  fontFamily: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  
  // Desktop sizes
  h1: 48,
  h2: 32,
  body: 16,
  label: 12,
  caption: 11,
  
  // Mobile sizes
  h1Mobile: 36,
  h2Mobile: 28,
  bodyMobile: 14,
  
  // Font weights
  bold: 700,
  semi: 600,
  regular: 400,
  
  // Line heights
  lhTight: 1.2,
  lhNormal: 1.4,
  lhRelaxed: 1.6,
};

export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
  xxxl: 56,
  xxxxl: 64,
};

export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1920,
};

export const ANIMATIONS = {
  panelSlideIn: 300,      // ms
  panelSlideOut: 200,     // ms
  cameraTransition: 800,  // ms
  buttonHover: 150,       // ms
  clickPulse: 600,        // ms
};

export const Z_INDEX = {
  canvas: 1,
  header: 50,
  panel: 100,
  modal: 1000,
};

// Three.js specific constants
export const SCENE = {
  fov: 75,
  nearPlane: 0.1,
  farPlane: 10000,
  defaultCameraDistance: 240,
  lightIntensityDirectional: 0.8,
  lightIntensityAmbient: 0.25,
  starCount: 2500,
};
