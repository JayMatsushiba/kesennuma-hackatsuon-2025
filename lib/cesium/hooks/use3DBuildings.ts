/**
 * Hook for managing 3D buildings in Cesium
 * Supports OSM Buildings and Google Photorealistic 3D Tiles
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { CesiumModule } from '../types';

export interface Use3DBuildingsOptions {
  viewer: any | null;
  Cesium: CesiumModule | null;
  enabled?: boolean;
  buildingType?: 'osm' | 'google' | 'both';
}

export interface Use3DBuildingsResult {
  osmBuildings: any | null;
  googleBuildings: any | null;
  isLoading: boolean;
  error: Error | null;
  toggleOSM: (visible: boolean) => void;
  toggleGoogle: (visible: boolean) => void;
  styleBuildings: (color: string, alpha?: number) => void;
}

export function use3DBuildings({
  viewer,
  Cesium,
  enabled = true,
  buildingType = 'osm',
}: Use3DBuildingsOptions): Use3DBuildingsResult {
  const [osmBuildings, setOsmBuildings] = useState<any | null>(null);
  const [googleBuildings, setGoogleBuildings] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load OSM Buildings
  const loadOSMBuildings = useCallback(async () => {
    if (!viewer || !Cesium || !enabled) return;
    if (buildingType !== 'osm' && buildingType !== 'both') return;

    try {
      setIsLoading(true);
      console.log('Loading Cesium OSM Buildings...');

      // Method 1: Modern API (Cesium 1.95+)
      try {
        const osmBuildingsTileset = await Cesium.createOsmBuildingsAsync();
        viewer.scene.primitives.add(osmBuildingsTileset);
        setOsmBuildings(osmBuildingsTileset);
        console.log('✅ OSM Buildings loaded via createOsmBuildingsAsync');
      } catch (modernError) {
        console.warn('Modern API failed, trying legacy method:', modernError);

        // Method 2: Legacy API (fallback)
        const osmBuildingsTileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
        viewer.scene.primitives.add(osmBuildingsTileset);
        setOsmBuildings(osmBuildingsTileset);
        console.log('✅ OSM Buildings loaded via Ion Asset ID 96188');
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load OSM Buildings:', err);
      setError(err instanceof Error ? err : new Error('Failed to load OSM Buildings'));
      setIsLoading(false);
    }
  }, [viewer, Cesium, enabled, buildingType]);

  // Load Google Photorealistic 3D Tiles
  const loadGoogleBuildings = useCallback(async () => {
    if (!viewer || !Cesium || !enabled) return;
    if (buildingType !== 'google' && buildingType !== 'both') return;

    try {
      setIsLoading(true);
      console.log('Loading Google Photorealistic 3D Tiles...');

      // Google Photorealistic 3D Tiles
      // Note: Requires Google Maps Platform API key
      const googleTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207, {
        show: true,
      });

      viewer.scene.primitives.add(googleTileset);
      setGoogleBuildings(googleTileset);

      console.log('✅ Google Photorealistic 3D Tiles loaded');
      setIsLoading(false);
    } catch (err) {
      console.warn('Google 3D Tiles not available (may require subscription):', err);
      // Not critical - OSM Buildings are the fallback
      setIsLoading(false);
    }
  }, [viewer, Cesium, enabled, buildingType]);

  // Initial load
  useEffect(() => {
    loadOSMBuildings();
    // loadGoogleBuildings(); // Uncomment if you have Google access
  }, [loadOSMBuildings]);

  // Toggle OSM Buildings visibility
  const toggleOSM = useCallback(
    (visible: boolean) => {
      if (osmBuildings) {
        osmBuildings.show = visible;
        viewer?.scene.requestRender();
      }
    },
    [osmBuildings, viewer]
  );

  // Toggle Google Buildings visibility
  const toggleGoogle = useCallback(
    (visible: boolean) => {
      if (googleBuildings) {
        googleBuildings.show = visible;
        viewer?.scene.requestRender();
      }
    },
    [googleBuildings, viewer]
  );

  // Style buildings (color, transparency)
  const styleBuildings = useCallback(
    (color: string, alpha: number = 1.0) => {
      if (!osmBuildings || !Cesium) return;

      osmBuildings.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [
            ['true', `color("${color}", ${alpha})`],
          ],
        },
      });

      viewer?.scene.requestRender();
    },
    [osmBuildings, Cesium, viewer]
  );

  return {
    osmBuildings,
    googleBuildings,
    isLoading,
    error,
    toggleOSM,
    toggleGoogle,
    styleBuildings,
  };
}
