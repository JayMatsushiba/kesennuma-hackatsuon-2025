/**
 * Camera control hook for Cesium
 * Provides functions to fly to viewpoints, coordinates, etc.
 */

'use client';

import { useCallback } from 'react';
import type { CesiumModule, Viewpoint, CameraPosition } from '../types';
import { CAMERA_CONFIG } from '../config/cesium-config';
import { getViewpoint } from '../config/viewpoints';
import { getCameraPosition } from '../utils/coordinates';

export interface UseCameraControlOptions {
  viewer: any | null;
  Cesium: CesiumModule | null;
}

export interface UseCameraControlResult {
  flyToViewpoint: (viewpointId: string, duration?: number) => void;
  flyToCoordinates: (lng: number, lat: number, height?: number, duration?: number) => void;
  flyToEntity: (entityId: number | string) => void;
  getCurrentPosition: () => CameraPosition | null;
  resetView: () => void;
}

export function useCameraControl({ viewer, Cesium }: UseCameraControlOptions): UseCameraControlResult {
  /**
   * Fly to predefined viewpoint
   */
  const flyToViewpoint = useCallback(
    (viewpointId: string, duration?: number) => {
      if (!viewer || !Cesium) return;

      const viewpoint = getViewpoint(viewpointId);
      if (!viewpoint) {
        console.warn(`Viewpoint not found: ${viewpointId}`);
        return;
      }

      const center = Cesium.Cartesian3.fromDegrees(viewpoint.longitude, viewpoint.latitude);
      const headingPitchRange = new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(viewpoint.heading),
        Cesium.Math.toRadians(viewpoint.pitch),
        viewpoint.range
      );

      viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(center, viewpoint.range), {
        duration: duration ?? CAMERA_CONFIG.defaultFlyDuration,
        offset: headingPitchRange,
        complete: () => {
          viewer.scene.requestRender();
        },
      });
    },
    [viewer, Cesium]
  );

  /**
   * Fly to specific coordinates
   */
  const flyToCoordinates = useCallback(
    (lng: number, lat: number, height: number = 1000, duration?: number) => {
      if (!viewer || !Cesium) return;

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-60),
          roll: 0,
        },
        duration: duration ?? CAMERA_CONFIG.defaultFlyDuration,
        complete: () => {
          viewer.scene.requestRender();
        },
      });
    },
    [viewer, Cesium]
  );

  /**
   * Fly to entity by ID
   */
  const flyToEntity = useCallback(
    (entityId: number | string) => {
      if (!viewer || !Cesium) return;

      const entity = viewer.entities.getById(entityId);
      if (!entity) {
        console.warn(`Entity not found: ${entityId}`);
        return;
      }

      viewer.flyTo(entity, {
        duration: CAMERA_CONFIG.defaultFlyDuration,
        offset: new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(0),
          Cesium.Math.toRadians(-60),
          500
        ),
      });
    },
    [viewer, Cesium]
  );

  /**
   * Get current camera position
   */
  const getCurrentPosition = useCallback((): CameraPosition | null => {
    if (!viewer || !Cesium) return null;
    return getCameraPosition(viewer, Cesium);
  }, [viewer, Cesium]);

  /**
   * Reset to overview
   */
  const resetView = useCallback(() => {
    flyToViewpoint('overview');
  }, [flyToViewpoint]);

  return {
    flyToViewpoint,
    flyToCoordinates,
    flyToEntity,
    getCurrentPosition,
    resetView,
  };
}
