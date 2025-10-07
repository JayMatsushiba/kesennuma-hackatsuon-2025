/**
 * Hook for loading and managing story markers in Cesium
 * Fetches GeoJSON, creates entities, handles clicks
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { CesiumModule, StoryFeatureCollection, EntityClickEvent } from '../types';
import { API_ENDPOINTS, MARKER_DEFAULTS, CLUSTERING_CONFIG } from '../config/cesium-config';
import { customizeDataSourceEntities } from '../utils/entity-styling';
import { isValidGeoJSON, filterFeaturesByTag, searchFeatures } from '../utils/geojson';

export interface UseStoryMarkersOptions {
  viewer: any | null;
  Cesium: CesiumModule | null;
  enabled?: boolean;
  onEntityClick?: (event: EntityClickEvent) => void;
}

export interface UseStoryMarkersResult {
  dataSource: any | null;
  featureCollection: StoryFeatureCollection | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  filterByTag: (tag: string) => void;
  search: (query: string) => void;
  clearFilters: () => void;
}

export function useStoryMarkers({
  viewer,
  Cesium,
  enabled = true,
  onEntityClick,
}: UseStoryMarkersOptions): UseStoryMarkersResult {
  const [dataSource, setDataSource] = useState<any | null>(null);
  const [featureCollection, setFeatureCollection] = useState<StoryFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load stories from API
  const loadStories = useCallback(async () => {
    if (!viewer || !Cesium || !enabled) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch GeoJSON
      const response = await fetch(API_ENDPOINTS.stories);
      if (!response.ok) {
        throw new Error(`Failed to fetch stories: ${response.statusText}`);
      }

      const data = await response.json();

      if (!isValidGeoJSON(data)) {
        throw new Error('Invalid GeoJSON format');
      }

      setFeatureCollection(data);

      // Load into Cesium
      const ds = await Cesium.GeoJsonDataSource.load(data, {
        clampToGround: true,
        markerSize: MARKER_DEFAULTS.size,
        markerColor: Cesium.Color.fromCssColorString(MARKER_DEFAULTS.color),
      });

      // Customize entities (styling, descriptions)
      customizeDataSourceEntities(ds, Cesium, data.features);

      // Enable clustering if needed
      if (CLUSTERING_CONFIG.enabled) {
        ds.clustering.enabled = true;
        ds.clustering.pixelRange = CLUSTERING_CONFIG.pixelRange;
        ds.clustering.minimumClusterSize = CLUSTERING_CONFIG.minimumClusterSize;
      }

      // Add to viewer
      viewer.dataSources.add(ds);
      setDataSource(ds);

      // Request render
      viewer.scene.requestRender();

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load stories:', err);
      setError(err instanceof Error ? err : new Error('Failed to load stories'));
      setIsLoading(false);
    }
  }, [viewer, Cesium, enabled]);

  // Setup click handler
  useEffect(() => {
    if (!viewer || !Cesium || !onEntityClick) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction((click: any) => {
      const picked = viewer.scene.pick(click.position);

      if (Cesium.defined(picked) && picked.id && picked.id._kesennumaFeature) {
        const feature = picked.id._kesennumaFeature;
        const event: EntityClickEvent = {
          entityId: feature.id,
          title: feature.properties.title,
          description: feature.properties.description,
          mediaUrl: feature.properties.mediaUrl,
          submitter: feature.properties.submitter,
          createdAt: feature.properties.createdAt,
          position: {
            latitude: feature.geometry.coordinates[1],
            longitude: feature.geometry.coordinates[0],
          },
        };
        onEntityClick(event);

        // Also set as selected entity (shows built-in info box)
        viewer.selectedEntity = picked.id;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [viewer, Cesium, onEntityClick]);

  // Initial load
  useEffect(() => {
    loadStories();
  }, [loadStories]);

  // Filter by tag
  const filterByTag = useCallback(
    (tag: string) => {
      if (!dataSource || !featureCollection) return;

      const filtered = filterFeaturesByTag(featureCollection, tag);
      const entities = dataSource.entities.values;

      entities.forEach((entity: any) => {
        if (entity._kesennumaFeature) {
          const tags = entity._kesennumaFeature.properties.tags || [];
          entity.show = tags.includes(tag);
        }
      });

      viewer?.scene.requestRender();
    },
    [dataSource, featureCollection, viewer]
  );

  // Search
  const searchStories = useCallback(
    (query: string) => {
      if (!dataSource || !featureCollection) return;

      const results = searchFeatures(featureCollection, query);
      const resultIds = new Set(results.features.map((f) => f.id));
      const entities = dataSource.entities.values;

      entities.forEach((entity: any) => {
        entity.show = resultIds.has(entity.id);
      });

      viewer?.scene.requestRender();
    },
    [dataSource, featureCollection, viewer]
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    if (!dataSource) return;

    const entities = dataSource.entities.values;
    entities.forEach((entity: any) => {
      entity.show = true;
    });

    viewer?.scene.requestRender();
  }, [dataSource, viewer]);

  return {
    dataSource,
    featureCollection,
    isLoading,
    error,
    reload: loadStories,
    filterByTag,
    search: searchStories,
    clearFilters,
  };
}
