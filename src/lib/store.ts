import { create } from 'zustand';

export interface Planet {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  distance: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  type: string;
  fact: string;
}

export const PLANETS: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercure',
    nameEn: 'Mercury',
    description: 'La plus petite planète, proche du Soleil.',
    distance: 40,
    size: 3,
    color: '#8C7853',
    speed: 4,
    angle: 0,
    type: 'Rocheuse',
    fact: 'Mercure est la planète la plus rapide en orbite.'
  },
  {
    id: 'venus',
    name: 'Vénus',
    nameEn: 'Venus',
    description: 'La planète la plus chaude de notre système solaire.',
    distance: 60,
    size: 7,
    color: '#FFC649',
    speed: 1.6,
    angle: 0,
    type: 'Rocheuse',
    fact: 'Vénus a une atmosphère épaisse et toxique.'
  },
  {
    id: 'earth',
    name: 'Terre',
    nameEn: 'Earth',
    description: 'Notre planète, l\'unique foyer de la vie connue.',
    distance: 80,
    size: 8,
    color: '#4A90E2',
    speed: 1,
    angle: 0,
    type: 'Rocheuse',
    fact: 'La Terre tourne sur son axe une fois tous les 24 heures.'
  },
  {
    id: 'mars',
    name: 'Mars',
    nameEn: 'Mars',
    description: 'La planète rouge, captivante pour les explorateurs.',
    distance: 100,
    size: 5,
    color: '#E27B58',
    speed: 0.8,
    angle: 0,
    type: 'Rocheuse',
    fact: 'Mars a le plus grand volcan du système solaire.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameEn: 'Jupiter',
    description: 'La plus grande planète, un géant gazeux majestueux.',
    distance: 140,
    size: 20,
    color: '#F5DEB3',
    speed: 0.2,
    angle: 0,
    type: 'Géante Gazeuse',
    fact: 'Jupiter a une Grande Tache Rouge visible depuis 350 ans.'
  },
  {
    id: 'saturn',
    name: 'Saturne',
    nameEn: 'Saturn',
    description: 'La planète des anneaux, spectaculaire et élégante.',
    distance: 180,
    size: 18,
    color: '#E8D4A8',
    speed: 0.09,
    angle: 0,
    type: 'Géante Gazeuse',
    fact: 'Les anneaux de Saturne sont composés de glace et de roche.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameEn: 'Uranus',
    description: 'Une géante de glace au-delà de l\'orbite de Saturne.',
    distance: 220,
    size: 12,
    color: '#A8D8EA',
    speed: 0.04,
    angle: 0,
    type: 'Géante de Glace',
    fact: 'Uranus tourne sur son côté, incliné de 98 degrés.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameEn: 'Neptune',
    description: 'La planète bleue la plus éloignée, venteuse et froide.',
    distance: 260,
    size: 12,
    color: '#4166F5',
    speed: 0.01,
    angle: 0,
    type: 'Géante de Glace',
    fact: 'Neptune a les vents les plus rapides du système solaire.'
  }
];

interface StoreState {
  selectedPlanetId: string | null;
  isLoading: boolean;
  isPanelOpen: boolean;
  
  selectPlanet: (planetId: string | null) => void;
  openPanel: (planetId: string) => void;
  closePanel: () => void;
  setLoading: (loading: boolean) => void;
  resetView: () => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedPlanetId: null,
  isLoading: true,
  isPanelOpen: false,
  
  selectPlanet: (planetId: string | null) => set({ selectedPlanetId: planetId }),
  openPanel: (planetId: string) => set({ selectedPlanetId: planetId, isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  resetView: () => set({ selectedPlanetId: null, isPanelOpen: false }),
}));

export const getPlanetById = (id: string): Planet | undefined => {
  return PLANETS.find(p => p.id === id);
};
