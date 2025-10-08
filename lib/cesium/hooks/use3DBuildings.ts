/**
 * Hook for managing 3D buildings in Cesium
 * Uses OSM Buildings (350M+ buildings worldwide from OpenStreetMap)
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { CesiumModule } from '../types';

export interface Use3DBuildingsOptions {
  viewer: any | null;
  Cesium: CesiumModule | null;
  enabled?: boolean;
}

export interface Use3DBuildingsResult {
  osmBuildings: any | null;
  isLoading: boolean;
  error: Error | null;
  toggleOSM: (visible: boolean) => void;
  styleBuildings: (color: string, alpha?: number) => void;
}

export function use3DBuildings({
  viewer,
  Cesium,
  enabled = true,
}: Use3DBuildingsOptions): Use3DBuildingsResult {
  const [osmBuildings, setOsmBuildings] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load OSM Buildings (350M+ buildings worldwide)
  const loadOSMBuildings = useCallback(async () => {
    if (!viewer || !Cesium || !enabled) return;

    try {
      setIsLoading(true);
      console.log('🏢 Loading Cesium OSM Buildings...');

      // Method 1: Modern API (Cesium 1.95+)
      try {
        const osmBuildingsTileset = await Cesium.createOsmBuildingsAsync();
        viewer.scene.primitives.add(osmBuildingsTileset);
        setOsmBuildings(osmBuildingsTileset);
        console.log('✅ OSM Buildings loaded (350M+ buildings worldwide)');
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
  }, [viewer, Cesium, enabled]);

  // Initial load
  useEffect(() => {
    loadOSMBuildings();
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
    isLoading,
    error,
    toggleOSM,
    styleBuildings,
  };
}
