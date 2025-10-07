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
  const { title, description, mediaUrl, submitter, createdAt, tags } = feature.properties;

  // Format date
  const date = new Date(createdAt);
  const dateStr = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Tag badges
  const tagBadges = (tags || [])
    .map((tag) => {
      const category = TAG_CATEGORIES.find((c) => c.id === tag);
      const color = category?.color || '#6b7280';
      const label = category?.labelJa || tag;
      return `<span style="display: inline-block; background: ${color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-right: 4px;">${label}</span>`;
    })
    .join('');

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 360px; padding: 4px;">
      <h3 style="margin: 0 0 8px 0; font-size: 1.125rem; font-weight: 600; color: #0f172a;">${title}</h3>
      ${tagBadges ? `<div style="margin-bottom: 8px;">${tagBadges}</div>` : ''}
      <p style="white-space: pre-wrap; line-height: 1.6; color: #334155; margin: 0 0 12px 0;">${description}</p>
      ${
        mediaUrl
          ? `<img src="${mediaUrl}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 12px; display: block;" />`
          : ''
      }
      <div style="font-size: 0.875rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px;">
        ${submitter ? `<p style="margin: 4px 0;">投稿者: <strong>${submitter}</strong></p>` : ''}
        <p style="margin: 4px 0;">投稿日: ${dateStr}</p>
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
export function getMarkerColorByTag(tags: string[]): string {
  if (!tags || tags.length === 0) return MARKER_DEFAULTS.color;

  // Return color of first matching tag
  for (const tag of tags) {
    const category = TAG_CATEGORIES.find((c) => c.id === tag);
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
    const feature = features.find((f) => f.id === entity.id);
    if (!feature) return;

    // Apply description
    entity.description = createEntityDescription(feature);

    // Style billboard with tag-based color
    const color = getMarkerColorByTag(feature.properties.tags || []);
    styleEntityBillboard(entity, Cesium, { color });

    // Store original feature data for later access
    entity._kesennumaFeature = feature;
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
