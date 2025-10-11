/**
 * Cesium configuration for Kesennuma platform
 * Manages Ion tokens, default settings, and viewer options
 */

import { CesiumViewerOptions } from '../types';

// Cesium Ion access token (from env)
export const CESIUM_ION_TOKEN = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || '';

// Base URL for Cesium static assets
export const CESIUM_BASE_URL = '/cesium';

// Default viewer configuration
export const DEFAULT_VIEWER_CONFIG = {
  // UI widgets
  animation: false, // No animation timeline (enable for CZML later)
  timeline: false, // No timeline scrubber (enable for CZML later)
  geocoder: false, // No search box (we have custom viewpoints)
  baseLayerPicker: true, // Allow imagery layer selection
  navigationHelpButton: false, // Hide help button
  homeButton: true, // Keep home button
  sceneModePicker: false, // Lock to 3D mode
  selectionIndicator: true, // Show selection indicator
  infoBox: false, // Disable default info box (using custom sidebar)
  fullscreenButton: true, // Allow fullscreen
  vrButton: false, // No VR support

  // Performance optimizations (critical!)
  requestRenderMode: true, // Only render on scene changes
  maximumRenderTimeChange: Infinity, // Don't force re-render on time changes
  scene3DOnly: true, // Disable 2D/Columbus modes

  // Quality settings
  resolutionScale: 1.0, // Full resolution (reduce to 0.5 for low-end devices)

  // Shadows (disable for performance)
  shadows: false,

  // Terrain exaggeration
  terrainExaggeration: 1.0,
} as const;

// Terrain configuration
export const TERRAIN_CONFIG = {
  enabled: true,
  requestWaterMask: false, // Disable water effects (performance)
  requestVertexNormals: false, // Disable lighting normals (performance)
};

// Camera constraints
export const CAMERA_CONFIG = {
  frustumNearPlane: 20.0, // Clip objects closer than 20m (performance)
  defaultFlyDuration: 2.5, // seconds
  defaultZoomDuration: 1.0, // seconds
};

// Marker/Entity styling defaults
export const MARKER_DEFAULTS = {
  size: 48, // pixels
  color: '#1d4ed8', // brand-600 blue
  scale: 0.5,
  scaleByDistance: {
    near: 1500,
    nearValue: 1.4,
    far: 20000,
    farValue: 0.8,
  },
  disableDepthTest: true, // Always visible (not hidden by terrain)
};

// Fog configuration
export const FOG_CONFIG = {
  enabled: false, // Disable for clarity (can enable for atmosphere)
  density: 0.0002,
  screenSpaceErrorFactor: 2.0,
};

// Sky atmosphere
export const SKY_CONFIG = {
  hueShift: 0.0,
  saturationShift: 0.0,
  brightnessShift: 0.0,
};

// Clustering configuration (for many markers)
export const CLUSTERING_CONFIG = {
  enabled: false, // Enable when stories > 500
  pixelRange: 50, // Cluster radius in pixels
  minimumClusterSize: 3, // Min points to form cluster
};

// Tag categories with colors
export const TAG_CATEGORIES = [
  { id: 'memorial', label: 'Memorial', labelJa: '震災の記憶', color: '#dc2626', icon: '🕯️' },
  { id: 'fishing', label: 'Fishing', labelJa: '漁業', color: '#2563eb', icon: '🎣' },
  { id: 'daily-life', label: 'Daily Life', labelJa: '日常', color: '#16a34a', icon: '🏘️' },
  { id: 'food', label: 'Food', labelJa: '食', color: '#d97706', icon: '🍜' },
  { id: 'events', label: 'Events', labelJa: 'イベント', color: '#9333ea', icon: '🎉' },
  { id: 'nature', label: 'Nature', labelJa: '自然', color: '#059669', icon: '🌊' },
  { id: 'culture', label: 'Culture', labelJa: '文化', color: '#7c3aed', icon: '⛩️' },
] as const;

// API endpoints
export const API_ENDPOINTS = {
  stories: '/api/stories', // GET GeoJSON
  submitStory: '/api/stories', // POST new story
  approveStory: (id: number) => `/api/stories/${id}/approve`, // POST approve
  czmlMemorial: '/api/czml/memorial', // GET CZML (future)
} as const;

// Build complete viewer options
export function buildViewerOptions(overrides?: Partial<CesiumViewerOptions>) {
  return {
    ionToken: CESIUM_ION_TOKEN,
    terrainEnabled: TERRAIN_CONFIG.enabled,
    showTimeline: DEFAULT_VIEWER_CONFIG.timeline,
    showAnimation: DEFAULT_VIEWER_CONFIG.animation,
    requestRenderMode: DEFAULT_VIEWER_CONFIG.requestRenderMode,
    ...overrides,
  };
}
