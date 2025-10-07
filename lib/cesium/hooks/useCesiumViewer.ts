/**
 * Main Cesium viewer hook
 * Handles viewer initialization, cleanup, and basic setup
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { CesiumModule, CesiumViewerOptions } from '../types';
import {
  CESIUM_ION_TOKEN,
  CESIUM_BASE_URL,
  DEFAULT_VIEWER_CONFIG,
  TERRAIN_CONFIG,
  CAMERA_CONFIG,
} from '../config/cesium-config';
import { KESENNUMA_CENTER, DEFAULT_VIEWPOINT_ID, getViewpoint } from '../config/viewpoints';

export interface UseCesiumViewerResult {
  viewer: any | null;
  Cesium: CesiumModule | null;
  isLoading: boolean;
  error: Error | null;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useCesiumViewer(options?: CesiumViewerOptions): UseCesiumViewerResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [Cesium, setCesium] = useState<CesiumModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    let mounted = true;

    async function initViewer() {
      try {
        setIsLoading(true);

        // Dynamic import Cesium
        const CesiumModule = await import('cesium');
        await import('cesium/Build/Cesium/Widgets/widgets.css');

        if (!mounted) return;

        setCesium(CesiumModule);

        // Set base URL for workers/assets
        (window as any).CESIUM_BASE_URL = CESIUM_BASE_URL;

        // Set Ion token
        CesiumModule.Ion.defaultAccessToken = options?.ionToken || CESIUM_ION_TOKEN;

        if (!containerRef.current) {
          throw new Error('Container ref not available');
        }

        // Create viewer
        const viewer = new CesiumModule.Viewer(containerRef.current, {
          ...DEFAULT_VIEWER_CONFIG,
          animation: options?.showAnimation ?? DEFAULT_VIEWER_CONFIG.animation,
          timeline: options?.showTimeline ?? DEFAULT_VIEWER_CONFIG.timeline,
          requestRenderMode: options?.requestRenderMode ?? DEFAULT_VIEWER_CONFIG.requestRenderMode,
        });

        viewerRef.current = viewer;

        // Configure camera
        viewer.camera.frustum.near = CAMERA_CONFIG.frustumNearPlane;

        // Load terrain if enabled
        if (options?.terrainEnabled ?? TERRAIN_CONFIG.enabled) {
          try {
            viewer.scene.terrainProvider = await CesiumModule.createWorldTerrainAsync({
              requestWaterMask: TERRAIN_CONFIG.requestWaterMask,
              requestVertexNormals: TERRAIN_CONFIG.requestVertexNormals,
            });
          } catch (terrainError) {
            console.warn('Failed to load terrain:', terrainError);
            // Continue without terrain
          }
        }

        // Fly to initial viewpoint
        const initialViewpoint = options?.initialViewpoint
          ? getViewpoint(options.initialViewpoint)
          : getViewpoint(DEFAULT_VIEWPOINT_ID);

        if (initialViewpoint) {
          const center = CesiumModule.Cartesian3.fromDegrees(
            initialViewpoint.longitude,
            initialViewpoint.latitude
          );
          const headingPitchRange = new CesiumModule.HeadingPitchRange(
            CesiumModule.Math.toRadians(initialViewpoint.heading),
            CesiumModule.Math.toRadians(initialViewpoint.pitch),
            initialViewpoint.range
          );

          viewer.camera.flyToBoundingSphere(
            new CesiumModule.BoundingSphere(center, initialViewpoint.range),
            {
              duration: CAMERA_CONFIG.defaultFlyDuration,
              offset: headingPitchRange,
            }
          );
        } else {
          // Fallback to Kesennuma center
          viewer.camera.flyTo({
            destination: CesiumModule.Cartesian3.fromDegrees(
              KESENNUMA_CENTER.longitude,
              KESENNUMA_CENTER.latitude,
              15000
            ),
            duration: CAMERA_CONFIG.defaultFlyDuration,
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize Cesium viewer:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize viewer'));
          setIsLoading(false);
        }
      }
    }

    initViewer();

    // Cleanup
    return () => {
      mounted = false;
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (err) {
          console.warn('Error destroying viewer:', err);
        }
        viewerRef.current = null;
      }
    };
  }, []); // Empty deps - only init once

  return {
    viewer: viewerRef.current,
    Cesium,
    isLoading,
    error,
    containerRef,
  };
}
