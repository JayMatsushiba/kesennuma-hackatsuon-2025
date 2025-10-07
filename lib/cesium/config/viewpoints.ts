/**
 * Predefined viewpoints for Kesennuma landmarks and areas
 * Based on key locations: port, islands, memorial sites, fishing areas
 */

import { Viewpoint } from '../types';

export const KESENNUMA_VIEWPOINTS: Viewpoint[] = [
  {
    id: 'overview',
    label: 'Overview',
    labelJa: '全体ビュー',
    latitude: 38.908,
    longitude: 141.566,
    heading: 0,
    pitch: -85,
    range: 15000,
    description: 'Complete view of Kesennuma city and bay'
  },
  {
    id: 'port',
    label: 'Kesennuma Port',
    labelJa: '気仙沼港',
    latitude: 38.905,
    longitude: 141.563,
    heading: 0,
    pitch: -60,
    range: 500,
    description: 'Main fishing port, heart of Kesennuma fishing industry'
  },
  {
    id: 'oshima',
    label: 'Oshima Island',
    labelJa: '大島',
    latitude: 38.898,
    longitude: 141.591,
    heading: 0,
    pitch: -60,
    range: 1000,
    description: 'Beautiful island connected by bridge, scenic views'
  },
  {
    id: 'fish-market',
    label: 'Fish Market',
    labelJa: '魚市場',
    latitude: 38.9068,
    longitude: 141.5648,
    heading: 45,
    pitch: -55,
    range: 400,
    description: 'Kesennuma fish market, one of Japan\'s largest'
  },
  {
    id: 'memorial',
    label: 'Tsunami Memorial',
    labelJa: '震災メモリアル',
    latitude: 38.900,
    longitude: 141.570,
    heading: 0,
    pitch: -45,
    range: 300,
    description: '2011 tsunami memorial and recovery monuments'
  },
  {
    id: 'bay-north',
    label: 'Kesennuma Bay (North)',
    labelJa: '気仙沼湾（北側）',
    latitude: 38.915,
    longitude: 141.570,
    heading: 180,
    pitch: -70,
    range: 2000,
    description: 'Northern bay area with fishing communities'
  },
  {
    id: 'downtown',
    label: 'Downtown',
    labelJa: '市街地',
    latitude: 38.907,
    longitude: 141.568,
    heading: 0,
    pitch: -65,
    range: 800,
    description: 'Central commercial district and shopping area'
  },
  {
    id: 'oshima-bridge',
    label: 'Oshima Bridge',
    labelJa: '大島大橋',
    latitude: 38.903,
    longitude: 141.585,
    heading: 90,
    pitch: -50,
    range: 600,
    description: 'Bridge connecting mainland to Oshima Island'
  }
];

// Default initial viewpoint
export const DEFAULT_VIEWPOINT_ID = 'overview';

// Get viewpoint by ID
export function getViewpoint(id: string): Viewpoint | undefined {
  return KESENNUMA_VIEWPOINTS.find(vp => vp.id === id);
}

// Get viewpoint by index (for menu ordering)
export function getViewpointByIndex(index: number): Viewpoint | undefined {
  return KESENNUMA_VIEWPOINTS[index];
}

// Kesennuma bounds for bounding box queries (future optimization)
export const KESENNUMA_BOUNDS = {
  north: 38.95,
  south: 38.85,
  east: 141.65,
  west: 141.50
};

// Center coordinates
export const KESENNUMA_CENTER = {
  latitude: 38.908,
  longitude: 141.566
};
