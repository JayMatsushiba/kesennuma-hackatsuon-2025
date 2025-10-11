/**
 * Main Cesium 3D viewer component for Kesennuma Digital Experiences
 * Integrates viewer initialization, story markers, and camera controls
 */

'use client';

import { useState, useCallback } from 'react';
import { useCesiumViewer } from '@/lib/cesium/hooks/useCesiumViewer';
import { useStoryMarkers } from '@/lib/cesium/hooks/useStoryMarkers';
import { useCameraControl } from '@/lib/cesium/hooks/useCameraControl';
import { use3DBuildings } from '@/lib/cesium/hooks/use3DBuildings';
import type { EntityClickEvent } from '@/lib/cesium/types';
import LoadingOverlay from './LoadingOverlay';
import ViewpointSelector from './ViewpointSelector';
import LayersPanel, { Layer } from './LayersPanel';
import { DEFAULT_LAYERS } from '@/lib/cesium/config/layers';

export interface CesiumViewerProps {
  showViewpointSelector?: boolean;
  show3DBuildings?: boolean;
  onStoryClick?: (event: EntityClickEvent) => void;
  className?: string;
}

export default function CesiumViewer({
  showViewpointSelector = true,
  show3DBuildings = true,
  onStoryClick,
  className = '',
}: CesiumViewerProps) {
  const [selectedStory, setSelectedStory] = useState<EntityClickEvent | null>(null);
  const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS);

  // Initialize viewer
  const { viewer, Cesium, isLoading: viewerLoading, error: viewerError, containerRef } = useCesiumViewer({
    terrainEnabled: true,
    requestRenderMode: true,
  });

  // Load story markers
  const storyMarkersEnabled = layers.find(l => l.id === 'story-markers')?.enabled ?? true;
  const {
    isLoading: markersLoading,
    error: markersError,
    reload: reloadStories,
    dataSource: storyDataSource,
  } = useStoryMarkers({
    viewer,
    Cesium,
    enabled: !!viewer && storyMarkersEnabled,
    onEntityClick: useCallback((event: EntityClickEvent) => {
      setSelectedStory(event);
      onStoryClick?.(event);
    }, [onStoryClick]),
  });

  // Camera controls
  const { flyToViewpoint, resetView } = useCameraControl({ viewer, Cesium });

  // Handle viewpoint selection (includes dynamic story IDs)
  const handleViewpointSelect = useCallback((viewpointId: string) => {
    // Check if it's a story viewpoint (format: "story-123")
    if (viewpointId.startsWith('story-') && storyDataSource) {
      const storyId = parseInt(viewpointId.replace('story-', ''));
      const entities = storyDataSource.entities.values;
      const entity = entities.find((e: any) => e.id === storyId || e._kesennumaFeature?.id === storyId);

      if (entity && viewer) {
        viewer.flyTo(entity, {
          duration: 1.5,
          offset: new (Cesium as any).HeadingPitchRange(
            0,
            (Cesium as any).Math.toRadians(-30),
            500
          ),
        }).then(() => {
          // Set as selected entity AFTER camera flight completes
          // This shows the infoBox with story details
          viewer.selectedEntity = entity;
          viewer.scene.requestRender();
        });
      }
    } else {
      // Use standard viewpoint
      flyToViewpoint(viewpointId);
    }
  }, [flyToViewpoint, storyDataSource, viewer, Cesium]);

  // 3D Buildings (OSM - 350M+ buildings worldwide)
  const buildingsEnabled = layers.find(l => l.id === 'osm-buildings')?.enabled ?? true;
  const {
    isLoading: buildingsLoading,
    toggleOSM,
    osmBuildings,
  } = use3DBuildings({
    viewer,
    Cesium,
    enabled: show3DBuildings && buildingsEnabled,
  });

  // Layer toggle handler
  const handleToggleLayer = useCallback((layerId: string, enabled: boolean) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, enabled } : layer
      )
    );

    // Handle specific layer toggles
    if (layerId === 'osm-buildings') {
      if (osmBuildings) {
        osmBuildings.show = enabled;
        viewer?.scene.requestRender();
      }
    } else if (layerId === 'story-markers' && storyDataSource) {
      storyDataSource.show = enabled;
      viewer?.scene.requestRender();
    } else if (layerId === 'terrain' && viewer) {
      viewer.scene.globe.show = enabled;
      viewer.scene.requestRender();
    }
  }, [viewer, storyDataSource, osmBuildings]);

  const isLoading = viewerLoading || markersLoading || buildingsLoading;
  const error = viewerError || markersError;

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading overlay */}
      {isLoading && <LoadingOverlay />}

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-lg max-w-md">
          <p className="font-medium">エラーが発生しました</p>
          <p className="text-sm">{error.message}</p>
          <button
            onClick={reloadStories}
            className="mt-2 text-sm underline hover:no-underline"
          >
            再読み込み
          </button>
        </div>
      )}

      {/* Cesium container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Viewpoint selector overlay */}
      {showViewpointSelector && viewer && (
        <ViewpointSelector onSelectViewpoint={handleViewpointSelect} onReset={resetView} />
      )}

      {/* Layers control panel */}
      {viewer && (
        <LayersPanel
          layers={layers}
          onToggleLayer={handleToggleLayer}
        />
      )}

      {/* Optional: Story info card (if you want custom popup outside Cesium's built-in infoBox) */}
      {/* {selectedStory && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-xl shadow-2xl p-4 max-w-sm">
          <h3 className="font-bold text-lg mb-2">{selectedStory.title}</h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedStory.description}</p>
          {selectedStory.mediaUrl && (
            <img src={selectedStory.mediaUrl} alt={selectedStory.title} className="mt-2 rounded-lg w-full" />
          )}
          <button
            onClick={() => setSelectedStory(null)}
            className="mt-2 text-sm text-slate-500 hover:text-slate-700"
          >
            閉じる
          </button>
        </div>
      )} */}
    </div>
  );
}
