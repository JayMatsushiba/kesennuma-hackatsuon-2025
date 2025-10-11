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
  // Extract tags from relations
  const tags = story.tags?.map(t => t.tag.slug) || [];

  // Extract description from first text content block
  let description = story.excerpt || '';
  if (story.contentBlocks && story.contentBlocks.length > 0) {
    const firstTextBlock = story.contentBlocks.find(b => b.blockType === 'text');
    if (firstTextBlock) {
      try {
        const data = JSON.parse(firstTextBlock.data);
        description = data.content || story.excerpt || '';
      } catch (e) {
        console.warn(`Failed to parse content block for story ${story.id}:`, e);
      }
    }
  }

  // Extract media URL from first image content block or use cover image
  let mediaUrl = story.coverImageUrl;
  if (!mediaUrl && story.contentBlocks && story.contentBlocks.length > 0) {
    const firstImageBlock = story.contentBlocks.find(b => b.blockType === 'image');
    if (firstImageBlock) {
      try {
        const data = JSON.parse(firstImageBlock.data);
        mediaUrl = data.url || null;
      } catch (e) {
        console.warn(`Failed to parse image block for story ${story.id}:`, e);
      }
    }
  }

  return {
    type: 'Feature',
    id: story.id,
    geometry: {
      type: 'Point',
      coordinates: [story.longitude, story.latitude], // [lng, lat] order!
    },
    properties: {
      title: story.title,
      description: description,
      mediaUrl: mediaUrl,
      submitter: null, // No longer in new schema
      createdAt: story.createdAt instanceof Date ? story.createdAt.toISOString() : story.createdAt,
      tags,
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
 * Filter features by tag
 */
export function filterFeaturesByTag(
  featureCollection: StoryFeatureCollection,
  tag: string
): StoryFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: featureCollection.features.filter(
      (f) => f.properties.tags && f.properties.tags.includes(tag)
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
 * Get feature count by tag
 */
export function getFeatureCountByTag(featureCollection: StoryFeatureCollection): Record<string, number> {
  const counts: Record<string, number> = {};
  featureCollection.features.forEach((f) => {
    (f.properties.tags || []).forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  return counts;
}
