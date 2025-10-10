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
    description: 'Complete view of Kesennuma city and bay',
    // No entityId - overview shows entire area
  },
  {
    id: 'port',
    label: 'Kesennuma Port',
    labelJa: '気仙沼港',
    latitude: 38.8626562,
    longitude: 141.606009,
    heading: 0,
    pitch: -60,
    range: 500,
    description: 'Main fishing port, heart of Kesennuma fishing industry',
    entityId: 1 // Story: 気仙沼港の朝
  },
  {
    id: 'oshima',
    label: 'Oshima Island',
    labelJa: '大島',
    latitude: 38.878779,
    longitude: 141.606243,
    heading: 0,
    pitch: -60,
    range: 1000,
    description: 'Beautiful island connected by bridge, scenic views',
    entityId: 3 // Story: 大島の美しい海岸
  },
  {
    id: 'fish-market',
    label: 'Fish Market',
    labelJa: '魚市場',
    latitude: 38.9047061,
    longitude: 141.5786374,
    heading: 45,
    pitch: -55,
    range: 400,
    description: 'Kesennuma fish market, one of Japan\'s largest',
    entityId: 2 // Story: 魚市場の賑わい
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
    description: '2011 tsunami memorial and recovery monuments',
    entityId: 5 // Story: 東日本大震災の記憶
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
    description: 'Northern bay area with fishing communities',
    entityId: 9 // Story: 気仙沼湾の夕暮れ
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
    description: 'Central commercial district and shopping area',
    entityId: 6 // Story: 復興への歩み
  },
  {
    id: 'oshima-bridge',
    label: 'Oshima Bridge',
    labelJa: '大島大橋',
    latitude: 38.878779,
    longitude: 141.606243,
    heading: 90,
    pitch: -50,
    range: 600,
    description: 'Bridge connecting mainland to Oshima Island',
    entityId: 4 // Story: 大島大橋
  },
  {
    id: 'shark-museum',
    label: 'Shark Museum',
    labelJa: 'シャークミュージアム',
    latitude: 38.90009720623811,
    longitude: 141.57946292489987,
    heading: 0,
    pitch: -55,
    range: 350,
    description: 'Kesennuma Umi no Ichi Shark Museum, Japan\'s only shark museum',
    entityId: 11 // Story: シャークミュージアム
  },
  {
    id: 'station',
    label: 'Kesennuma Station',
    labelJa: '気仙沼駅',
    latitude: 38.90995,
    longitude: 141.55931,
    heading: 0,
    pitch: -60,
    range: 400,
    description: 'JR East Kesennuma Station, gateway to the city',
    entityId: 12 // Story: 気仙沼駅前
  },
  {
    id: 'pier7',
    label: 'Pier 7 (UMARERU)',
    labelJa: 'Pier7（創）',
    latitude: 38.90522595237508,
    longitude: 141.575339182962,
    heading: 180,
    pitch: -55,
    range: 350,
    description: 'Waterfront community plaza, symbol of recovery and renewal',
    entityId: 13 // Story: Pier7（創/ウマレル）
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
