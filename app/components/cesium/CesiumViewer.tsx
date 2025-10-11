/**
 * Main Cesium 3D viewer component for Kesmemento
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
import TagFilter from './TagFilter';
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
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [nearbyStories, setNearbyStories] = useState<Story[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isViewpointSelectorOpen, setIsViewpointSelectorOpen] = useState(false);

  // Initialize viewer
  const { viewer, Cesium, isLoading: viewerLoading, error: viewerError, containerRef } = useCesiumViewer({
    terrainEnabled: true,
    requestRenderMode: true,
  });

  // Helper function to find stories at the same location (within 10m)
  const findStoriesAtLocation = useCallback((lat: number, lng: number, stories: Story[]) => {
    const DISTANCE_THRESHOLD = 0.0001; // ~10 meters in degrees
    let filteredStories = stories.filter(story => {
      const latDiff = Math.abs(story.position.latitude - lat);
      const lngDiff = Math.abs(story.position.longitude - lng);
      return latDiff < DISTANCE_THRESHOLD && lngDiff < DISTANCE_THRESHOLD;
    });

    // Filter by selected tags if any
    if (selectedTags.length > 0) {
      filteredStories = filteredStories.filter(story => {
        const storyTags = story.tags || [];
        return storyTags.some((tag: any) => selectedTags.includes(tag?.id || tag));
      });
    }

    return filteredStories;
  }, [selectedTags]);

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
      // Don't auto-select a story - let user choose from the list
      setSelectedStoryId(null);

      // Filter stories to only show those at the clicked location
      const storiesAtLocation = findStoriesAtLocation(
        event.position.latitude,
        event.position.longitude,
        allStories
      );

      // Remove duplicates by ID (safeguard)
      const uniqueStories = Array.from(
        new Map(storiesAtLocation.map(story => [story.id, story])).values()
      );

      // Get location name from first story (they all share same location)
      const locationName = uniqueStories[0]?.title?.split(' - ')[0] || 'この場所';

      setSelectedLocation({
        lat: event.position.latitude,
        lng: event.position.longitude,
        name: locationName,
      });

      setNearbyStories(uniqueStories);
      setShowSidebar(true);
      onStoryClick?.(event);
    }, [onStoryClick, allStories, findStoriesAtLocation]),
  });

  // Convert GeoJSON features to Story objects when featureCollection changes
  useEffect(() => {
    if (featureCollection?.features) {
      // Flatten all stories from deduplicated markers
      // Each feature now has _allStoriesAtLocation containing all stories at that location
      const allFeatures = featureCollection.features.flatMap(feature =>
        (feature.properties as any)._allStoriesAtLocation || [feature]
      );

      const stories: Story[] = allFeatures.map(feature => ({
        id: String(feature.id),
        title: feature.properties.title || 'Untitled',
        slug: feature.properties.slug,
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

      // Remove duplicates by ID (safeguard)
      const uniqueStories = Array.from(
        new Map(stories.map(story => [story.id, story])).values()
      );

      setAllStories(uniqueStories);
    }
  }, [featureCollection]);

  // Filter markers by selected tags
  useEffect(() => {
    if (!storyDataSource || !viewer) return;

    const showAll = selectedTags.length === 0;
    const entities = storyDataSource.entities.values;

    // Update visibility for all entities
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];

      if (!entity || !entity._kesennumaFeature) {
        continue;
      }

      if (showAll) {
        // Show all markers when no tags selected
        entity.show = true;
      } else {
        // Filter by tags
        const allStoriesAtLocation = entity._kesennumaFeature.properties._allStoriesAtLocation || [entity._kesennumaFeature];

        const hasMatch = allStoriesAtLocation.some((feature: any) => {
          const storyTags = feature.properties?.tags || [];
          return storyTags.some((tag: any) => selectedTags.includes(tag?.id || tag));
        });

        entity.show = hasMatch;
      }
    }

    // Force Cesium to update and render
    if (viewer.scene) {
      viewer.scene.requestRender();
      // Request one more render to ensure visibility updates are applied
      requestAnimationFrame(() => {
        if (viewer.scene) {
          viewer.scene.requestRender();
        }
      });
    }
  }, [selectedTags, storyDataSource, viewer]);

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

      if (entity && viewer && Cesium) {
        // Get position from entity
        const position = entity.position?.getValue(Cesium.JulianDate.now());

        if (position) {
          const cartographic = Cesium.Cartographic.fromCartesian(position);
          const lat = Cesium.Math.toDegrees(cartographic.latitude);
          const lng = Cesium.Math.toDegrees(cartographic.longitude);

          // Find stories at this location
          const storiesAtLocation = findStoriesAtLocation(lat, lng, allStories);

          // Get location name from first story
          const locationName = storiesAtLocation[0]?.title?.split(' - ')[0] || 'この場所';

          // Open sidebar with stories
          setSelectedLocation({ lat, lng, name: locationName });
          setNearbyStories(storiesAtLocation);
          setShowSidebar(true);
          setSelectedStoryId(null); // Don't auto-select
        }

        // Fly to entity
        viewer.flyTo(entity, {
          duration: 1.5,
          offset: new Cesium.HeadingPitchRange(
            0,
            Cesium.Math.toRadians(-30),
            500
          ),
        }).then(() => {
          viewer.selectedEntity = entity;
          viewer.scene.requestRender();
        });
      }
    } else {
      // Use standard viewpoint
      flyToViewpoint(viewpointId);
    }
  }, [flyToViewpoint, storyDataSource, viewer, Cesium, allStories, findStoriesAtLocation]);

  // 3D Buildings (OSM - 350M+ buildings worldwide)
  const buildingsEnabled = layers.find(l => l.id === 'osm-buildings')?.enabled ?? true;
  const {
    isLoading: buildingsLoading,
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

  // Tag filter handler
  const handleTagsChange = useCallback((tagIds: number[]) => {
    setSelectedTags(tagIds);
  }, []);

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
        <ViewpointSelector
          onSelectViewpoint={handleViewpointSelect}
          onReset={resetView}
          onOpenChange={setIsViewpointSelectorOpen}
        />
      )}

      {/* Tag filter - hidden when viewpoint selector is open */}
      {viewer && !isViewpointSelectorOpen && (
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
        />
      )}

      {/* Layers control panel */}
      {viewer && (
        <LayersPanel
          layers={layers}
          onToggleLayer={handleToggleLayer}
        />
      )}

      {/* Story Sidebar - Custom collapsible sidebar for stories */}
      {showSidebar && nearbyStories.length > 0 && selectedLocation && (
        <StorySidebar
          stories={nearbyStories}
          selectedStoryId={selectedStoryId}
          onStorySelect={handleStorySelect}
          locationName={selectedLocation.name}
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
