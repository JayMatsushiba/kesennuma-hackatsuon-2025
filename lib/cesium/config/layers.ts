/**
 * Layer configuration for Cesium viewer
 * Defines available map layers and their properties
 */

import { Layer } from '@/app/components/cesium/LayersPanel';

export const DEFAULT_LAYERS: Layer[] = [
  {
    id: 'terrain',
    label: 'Terrain',
    labelJa: '地形',
    icon: '⛰️',
    enabled: true,
    available: true,
  },
  {
    id: 'osm-buildings',
    label: 'OSM Buildings (350M+ worldwide)',
    labelJa: 'OSM 建物 (3D)',
    icon: '🏢',
    enabled: true,
    available: true,
  },
  {
    id: 'story-markers',
    label: 'Story Markers',
    labelJa: 'ストーリーマーカー',
    icon: '📍',
    enabled: true,
    available: true,
  },
  {
    id: 'gaussian-splats',
    label: 'Gaussian Splats (Photorealistic 3D)',
    labelJa: 'ガウシアンスプラット',
    icon: '📸',
    enabled: false,
    available: false, // Not yet implemented
  },
  {
    id: 'historical-photos',
    label: 'Historical Photo Overlays',
    labelJa: '歴史写真オーバーレイ',
    icon: '🖼️',
    enabled: false,
    available: false, // Not yet implemented
  },
];

export type LayerId = 'terrain' | 'osm-buildings' | 'story-markers' | 'gaussian-splats' | 'historical-photos';
