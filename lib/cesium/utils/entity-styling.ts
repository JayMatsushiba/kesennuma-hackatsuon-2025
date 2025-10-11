/**
 * Entity styling utilities for Cesium markers
 * Handles billboard customization, popups, etc.
 */

import type { CesiumModule, MarkerStyle, StoryFeature } from '../types';
import { MARKER_DEFAULTS, TAG_CATEGORIES } from '../config/cesium-config';

/**
 * Create HTML description for entity popup
 */
export function createEntityDescription(feature: StoryFeature): string {
  const { title, description, slug, locationName, coverImageUrl, publishedAt, tags } = feature.properties;

  // Format date (use publishedAt from Supabase)
  let dateStr = '日付不明';
  if (publishedAt) {
    try {
      const date = new Date(publishedAt);
      if (!isNaN(date.getTime())) {
        dateStr = date.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    } catch (e) {
      console.warn('Invalid date:', publishedAt);
    }
  }

  // Tag badges (tags are now objects from Supabase: {id, name, color})
  const tagBadges = (tags || [])
    .map((tag) => {
      // Tags from Supabase already have name and color
      const tagName = typeof tag === 'object' && tag.name ? tag.name : String(tag);
      const tagColor = typeof tag === 'object' && tag.color ? tag.color : '#6b7280';
      return `<span style="display: inline-block; background: ${tagColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-right: 4px;">${tagName}</span>`;
    })
    .join('');

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 360px; padding: 4px;">
      <h3 style="margin: 0 0 8px 0; font-size: 1.125rem; font-weight: 600; color: #0f172a;">${title}</h3>
      ${tagBadges ? `<div style="margin-bottom: 8px;">${tagBadges}</div>` : ''}
      ${locationName ? `<p style="font-size: 0.875rem; color: #64748b; margin: 0 0 8px 0;">📍 ${locationName}</p>` : ''}
      <p style="white-space: pre-wrap; line-height: 1.6; color: #334155; margin: 0 0 12px 0;">${description}</p>
      ${
        coverImageUrl
          ? `<img src="${coverImageUrl}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 12px; display: block;" />`
          : ''
      }
      <div style="font-size: 0.875rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px;">
        <p style="margin: 4px 0;">公開日: ${dateStr}</p>
      </div>
    </div>
  `;
}

/**
 * Apply custom styling to entity billboard
 */
export function styleEntityBillboard(
  entity: any,
  Cesium: CesiumModule,
  customStyle?: Partial<MarkerStyle>
) {
  const style = { ...MARKER_DEFAULTS, ...customStyle };

  if (entity.billboard) {
    // Scale
    if (style.scale !== undefined) {
      entity.billboard.scale = style.scale;
    }

    // Scale by distance
    if (style.scaleByDistance) {
      entity.billboard.scaleByDistance = new Cesium.NearFarScalar(
        style.scaleByDistance.near,
        style.scaleByDistance.nearValue,
        style.scaleByDistance.far,
        style.scaleByDistance.farValue
      );
    }

    // Disable depth test (always visible)
    if (style.disableDepthTest) {
      entity.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    }

    // Color (if custom color provided)
    if (style.color) {
      entity.billboard.color = Cesium.Color.fromCssColorString(style.color);
    }
  }
}

/**
 * Get marker color by tag category
 */
export function getMarkerColorByTag(tags: Array<{id: number; name: string; color: string}> | string[]): string {
  if (!tags || tags.length === 0) return MARKER_DEFAULTS.color;

  // Tags from Supabase are objects with color property
  const firstTag = tags[0];
  if (typeof firstTag === 'object' && firstTag.color) {
    return firstTag.color;
  }

  // Fallback for old string-based tags
  if (typeof firstTag === 'string') {
    const category = TAG_CATEGORIES.find((c) => c.id === firstTag);
    if (category) return category.color;
  }

  return MARKER_DEFAULTS.color;
}

/**
 * Customize all entities in a data source
 */
export function customizeDataSourceEntities(
  dataSource: any,
  Cesium: CesiumModule,
  features: StoryFeature[]
) {
  const entities = dataSource.entities.values;

  entities.forEach((entity: any, index: number) => {
    // Try to match by ID first, then by index as fallback
    let feature = features.find((f) => f.id === entity.id);
    if (!feature && index < features.length) {
      feature = features[index];
      console.log(`⚠️ Entity ${entity.id} matched by index to feature ${feature.id}`);
    }

    if (!feature) {
      console.error(`❌ No feature found for entity ${entity.id} at index ${index}`);
      return;
    }

    // Apply description
    entity.description = createEntityDescription(feature);

    // Style billboard with tag-based color
    const color = getMarkerColorByTag(feature.properties.tags || []);
    styleEntityBillboard(entity, Cesium, { color });

    // Store original feature data for later access
    entity._kesennumaFeature = feature;

    console.log(`✅ Styled marker: ${feature.properties.title}`);
  });
}

/**
 * Create vertical line from ground to marker (like Hiroshima Archive)
 */
export function addVerticalLine(
  viewer: any,
  Cesium: CesiumModule,
  lng: number,
  lat: number,
  height: number = 10
) {
  return viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([lng, lat, height, lng, lat, 0]),
      width: 1,
      material: Cesium.Color.WHITE.withAlpha(0.3),
    },
  });
}
