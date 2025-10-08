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
import BuildingsControl from './BuildingsControl';

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

  // Initialize viewer
  const { viewer, Cesium, isLoading: viewerLoading, error: viewerError, containerRef } = useCesiumViewer({
    terrainEnabled: true,
    requestRenderMode: true,
  });

  // Load story markers
  const {
    isLoading: markersLoading,
    error: markersError,
    reload: reloadStories,
  } = useStoryMarkers({
    viewer,
    Cesium,
    enabled: !!viewer,
    onEntityClick: useCallback((event: EntityClickEvent) => {
      setSelectedStory(event);
      onStoryClick?.(event);
    }, [onStoryClick]),
  });

  // Camera controls
  const { flyToViewpoint, resetView } = useCameraControl({ viewer, Cesium });

  // 3D Buildings (OSM - 350M+ buildings worldwide)
  const {
    isLoading: buildingsLoading,
    toggleOSM,
    styleBuildings,
  } = use3DBuildings({
    viewer,
    Cesium,
    enabled: show3DBuildings,
  });

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
        <ViewpointSelector onSelectViewpoint={flyToViewpoint} onReset={resetView} />
      )}

      {/* 3D Buildings control */}
      {show3DBuildings && viewer && (
        <BuildingsControl
          onToggleOSM={toggleOSM}
          onStyleChange={styleBuildings}
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
