/**
 * Cesium TypeScript definitions for Kesennuma Digital Experiences
 */

// Core Story type (matches Prisma schema)
export interface Story {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  latitude: number;
  longitude: number;
  coverImageUrl?: string | null;
  authorId: string;
  status: string; // 'pending_review' | 'approved' | 'rejected' | 'flagged'
  featured: boolean;
  viewCount: number;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations (optional for API responses)
  contentBlocks?: StoryContentBlock[];
  tags?: StoryTagRelation[];
}

export interface StoryContentBlock {
  id: string;
  storyId: number;
  blockType: string; // 'text' | 'image' | 'video' | 'gallery' | 'quote' | 'embed' | 'model3d'
  order: number;
  data: string; // JSON string
  createdAt: Date | string;
}

export interface StoryTagRelation {
  tag: {
    id: number;
    name: string;
    slug: string;
  };
}

// GeoJSON types
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
    mediaUrl?: string | null;
    submitter?: string | null;
    createdAt: string;
    tags?: string[];
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
