/**
 * GeoJSON utilities for Cesium
 * Convert between Story model and GeoJSON FeatureCollection
 */

import type { Story, StoryFeature, StoryFeatureCollection } from '../types';

/**
 * Convert Story array to GeoJSON FeatureCollection
 */
export function storiesToGeoJSON(stories: Story[]): StoryFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: stories.map(storyToFeature),
  };
}

/**
 * Convert single Story to GeoJSON Feature
 */
export function storyToFeature(story: Story): StoryFeature {
  return {
    type: 'Feature',
    id: story.id,
    geometry: {
      type: 'Point',
      coordinates: [story.longitude, story.latitude], // [lng, lat] order!
    },
    properties: {
      title: story.title,
      description: story.description,
      slug: '', // Add slug if available in Story type
      locationName: '', // Add location name if available in Story type
      coverImageUrl: story.mediaUrl,
      publishedAt: story.createdAt instanceof Date ? story.createdAt.toISOString() : story.createdAt,
      tags: story.tags || [],
    },
  };
}

/**
 * Validate GeoJSON FeatureCollection structure
 */
export function isValidGeoJSON(data: any): data is StoryFeatureCollection {
  return (
    data &&
    typeof data === 'object' &&
    data.type === 'FeatureCollection' &&
    Array.isArray(data.features)
  );
}

/**
 * Filter features by tag (by tag ID or name)
 */
export function filterFeaturesByTag(
  featureCollection: StoryFeatureCollection,
  tagIdOrName: string | number
): StoryFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: featureCollection.features.filter(
      (f) => f.properties.tags && f.properties.tags.some(
        (t) => t.id === tagIdOrName || t.name === tagIdOrName
      )
    ),
  };
}

/**
 * Filter features by bounding box (for optimization)
 */
export function filterFeaturesByBounds(
  featureCollection: StoryFeatureCollection,
  bounds: { north: number; south: number; east: number; west: number }
): StoryFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: featureCollection.features.filter((f) => {
      const [lng, lat] = f.geometry.coordinates;
      return (
        lat <= bounds.north &&
        lat >= bounds.south &&
        lng <= bounds.east &&
        lng >= bounds.west
      );
    }),
  };
}

/**
 * Search features by text query (title or description)
 */
export function searchFeatures(
  featureCollection: StoryFeatureCollection,
  query: string
): StoryFeatureCollection {
  const lowerQuery = query.toLowerCase();
  return {
    type: 'FeatureCollection',
    features: featureCollection.features.filter((f) => {
      const title = f.properties.title.toLowerCase();
      const description = f.properties.description.toLowerCase();
      return title.includes(lowerQuery) || description.includes(lowerQuery);
    }),
  };
}

/**
 * Get feature count by tag (keyed by tag name)
 */
export function getFeatureCountByTag(featureCollection: StoryFeatureCollection): Record<string, number> {
  const counts: Record<string, number> = {};
  featureCollection.features.forEach((f) => {
    (f.properties.tags || []).forEach((tag) => {
      counts[tag.name] = (counts[tag.name] || 0) + 1;
    });
  });
  return counts;
}
