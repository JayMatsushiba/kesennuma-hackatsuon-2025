/**
 * Main Cesium 3D viewer component for Kesennuma Digital Experiences
 * Integrates viewer initialization, story markers, and camera controls
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useCesiumViewer } from '@/lib/cesium/hooks/useCesiumViewer';
import { useStoryMarkers } from '@/lib/cesium/hooks/useStoryMarkers';
import { useCameraControl } from '@/lib/cesium/hooks/useCameraControl';
import { use3DBuildings } from '@/lib/cesium/hooks/use3DBuildings';
import type { EntityClickEvent } from '@/lib/cesium/types';
import LoadingOverlay from './LoadingOverlay';
import ViewpointSelector from './ViewpointSelector';
import LayersPanel, { Layer } from './LayersPanel';
import StorySidebar, { Story } from './StorySidebar';
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
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [nearbyStories, setNearbyStories] = useState<Story[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS);

  // Initialize viewer
  const { viewer, Cesium, isLoading: viewerLoading, error: viewerError, containerRef } = useCesiumViewer({
    terrainEnabled: true,
    requestRenderMode: true,
  });

  // Helper function to find stories at the same location (within 10m)
  const findStoriesAtLocation = useCallback((lat: number, lng: number, stories: Story[]) => {
    const DISTANCE_THRESHOLD = 0.0001; // ~10 meters in degrees
    return stories.filter(story => {
      const latDiff = Math.abs(story.position.latitude - lat);
      const lngDiff = Math.abs(story.position.longitude - lng);
      return latDiff < DISTANCE_THRESHOLD && lngDiff < DISTANCE_THRESHOLD;
    });
  }, []);

  // Load story markers
  const storyMarkersEnabled = layers.find(l => l.id === 'story-markers')?.enabled ?? true;
  const {
    isLoading: markersLoading,
    error: markersError,
    reload: reloadStories,
    dataSource: storyDataSource,
    featureCollection,
  } = useStoryMarkers({
    viewer,
    Cesium,
    enabled: !!viewer && storyMarkersEnabled,
    onEntityClick: useCallback((event: EntityClickEvent) => {
      setSelectedStory(event);
      setSelectedStoryId(String(event.entityId));
      setSelectedLocation({ lat: event.position.latitude, lng: event.position.longitude });

      // Filter stories to only show those at the clicked location
      const storiesAtLocation = findStoriesAtLocation(
        event.position.latitude,
        event.position.longitude,
        allStories
      );
      setNearbyStories(storiesAtLocation);
      setShowSidebar(true);
      onStoryClick?.(event);
    }, [onStoryClick, allStories, findStoriesAtLocation]),
  });

  // Convert GeoJSON features to Story objects when featureCollection changes
  useEffect(() => {
    if (featureCollection?.features) {
      const stories: Story[] = featureCollection.features.map(feature => ({
        id: String(feature.id),
        title: feature.properties.title || 'Untitled',
        description: feature.properties.description || '',
        mediaUrl: feature.properties.coverImageUrl || undefined,
        submitter: undefined, // Not available in current schema
        createdAt: feature.properties.publishedAt || undefined,
        position: {
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
        },
        tags: feature.properties.tags || [],
        content: undefined, // Will be fetched when story is clicked
      }));
      setAllStories(stories);
    }
  }, [featureCollection]);

  // Handle story selection from sidebar
  const handleStorySelect = useCallback((storyId: string) => {
    setSelectedStoryId(storyId);

    // Find the entity in Cesium and select it (but don't fly - camera stays in place)
    if (viewer && storyDataSource && Cesium) {
      const entity = storyDataSource.entities.getById(storyId);
      if (entity) {
        // Just select the entity without moving the camera
        viewer.selectedEntity = entity;
        viewer.scene.requestRender();
      }
    }
  }, [viewer, storyDataSource, Cesium]);

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

      {/* Story Sidebar - Custom collapsible sidebar for stories */}
      {showSidebar && nearbyStories.length > 0 && (
        <StorySidebar
          stories={nearbyStories}
          selectedStoryId={selectedStoryId}
          onStorySelect={handleStorySelect}
          onClose={() => {
            setShowSidebar(false);
            setSelectedStoryId(null);
            setSelectedLocation(null);
            setNearbyStories([]);
            if (viewer) {
              viewer.selectedEntity = undefined;
              viewer.scene.requestRender();
            }
          }}
        />
      )}
    </div>
  );
}
