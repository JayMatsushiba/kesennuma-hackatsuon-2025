/**
 * Cesium TypeScript definitions for Kesennuma Digital Experiences
 */

// Core Story type (matches Supabase schema)
export interface Story {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  mediaUrl?: string | null;
  submitter?: string | null;
  tags?: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  approved: boolean;
  createdAt: Date | string;
}

// GeoJSON types (updated for Supabase schema)
export interface StoryFeature {
  type: 'Feature';
  id: number;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    title: string;
    description: string;
    slug: string;
    locationName: string;
    coverImageUrl?: string | null;
    publishedAt?: string | null;
    tags: Array<{
      id: number;
      name: string;
      color: string;
    }>;
  };
}

export interface StoryFeatureCollection {
  type: 'FeatureCollection';
  features: StoryFeature[];
}

// Viewpoint configuration
export interface Viewpoint {
  id: string;
  label: string;
  labelJa: string;
  latitude: number;
  longitude: number;
  heading: number; // degrees
  pitch: number; // degrees
  range: number; // meters
  description?: string;
  entityId?: number | string; // Associated marker/story ID to auto-select
}

// Cesium viewer options
export interface CesiumViewerOptions {
  ionToken?: string;
  terrainEnabled?: boolean;
  initialViewpoint?: string; // viewpoint id
  showTimeline?: boolean;
  showAnimation?: boolean;
  requestRenderMode?: boolean;
}

// Camera position
export interface CameraPosition {
  longitude: number;
  latitude: number;
  height: number;
  heading: number;
  pitch: number;
  roll: number;
}

// Entity click event
export interface EntityClickEvent {
  entityId: number;
  title: string;
  description: string;
  mediaUrl?: string | null;
  submitter?: string | null;
  createdAt: string;
  position: {
    latitude: number;
    longitude: number;
  };
}

// Marker style configuration
export interface MarkerStyle {
  color?: string; // Hex color
  size?: number; // pixels
  scale?: number;
  scaleByDistance?: {
    near: number;
    nearValue: number;
    far: number;
    farValue: number;
  };
  disableDepthTest?: boolean;
}

// Tag category for thematic layers
export interface TagCategory {
  id: string;
  label: string;
  labelJa: string;
  color: string;
  icon?: string;
}

// Cesium async module type (for dynamic import)
export type CesiumModule = typeof import('cesium');
