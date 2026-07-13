import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, PLANETS, getPlanetById } from './store';

describe('Store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useStore.setState({
      selectedPlanetId: null,
      isLoading: true,
      isPanelOpen: false,
    });
  });

  describe('PLANETS', () => {
    it('should have 8 planets', () => {
      expect(PLANETS).toHaveLength(8);
    });

    it('should have all required planet properties', () => {
      PLANETS.forEach((planet) => {
        expect(planet).toHaveProperty('id');
        expect(planet).toHaveProperty('name');
        expect(planet).toHaveProperty('description');
        expect(planet).toHaveProperty('distance');
        expect(planet).toHaveProperty('size');
        expect(planet).toHaveProperty('color');
        expect(planet).toHaveProperty('speed');
        expect(planet).toHaveProperty('type');
        expect(planet).toHaveProperty('fact');
      });
    });

    it('should have correct planet IDs', () => {
      const ids = PLANETS.map(p => p.id);
      expect(ids).toEqual([
        'mercury', 'venus', 'earth', 'mars',
        'jupiter', 'saturn', 'uranus', 'neptune'
      ]);
    });
  });

  describe('getPlanetById', () => {
    it('should return planet by ID', () => {
      const earth = getPlanetById('earth');
      expect(earth).toBeDefined();
      expect(earth?.name).toBe('Terre');
    });

    it('should return undefined for unknown ID', () => {
      const planet = getPlanetById('unknown');
      expect(planet).toBeUndefined();
    });
  });

  describe('useStore', () => {
    it('should initialize with correct default state', () => {
      const state = useStore.getState();
      expect(state.selectedPlanetId).toBeNull();
      expect(state.isLoading).toBe(true);
      expect(state.isPanelOpen).toBe(false);
    });

    it('should select planet', () => {
      const { selectPlanet } = useStore.getState();
      selectPlanet('earth');
      
      const state = useStore.getState();
      expect(state.selectedPlanetId).toBe('earth');
    });

    it('should open panel for a planet', () => {
      const { openPanel } = useStore.getState();
      openPanel('mars');
      
      const state = useStore.getState();
      expect(state.selectedPlanetId).toBe('mars');
      expect(state.isPanelOpen).toBe(true);
    });

    it('should close panel', () => {
      const { openPanel, closePanel } = useStore.getState();
      openPanel('venus');
      closePanel();
      
      const state = useStore.getState();
      expect(state.isPanelOpen).toBe(false);
    });

    it('should set loading state', () => {
      const { setLoading } = useStore.getState();
      setLoading(false);
      
      const state = useStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should reset view', () => {
      const { openPanel, resetView } = useStore.getState();
      openPanel('jupiter');
      resetView();
      
      const state = useStore.getState();
      expect(state.selectedPlanetId).toBeNull();
      expect(state.isPanelOpen).toBe(false);
    });
  });
});
