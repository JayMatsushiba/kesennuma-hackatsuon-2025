/**
 * Viewpoint selector dropdown for Cesium
 * Allows users to navigate to predefined landmarks and stories
 */

'use client';

import { useState, useEffect } from 'react';
import type { StoryFeatureCollection } from '@/lib/cesium/types';

export interface ViewpointSelectorProps {
  onSelectViewpoint: (viewpointId: string) => void;
  onReset: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function ViewpointSelector({ onSelectViewpoint, onReset, onOpenChange }: ViewpointSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Notify parent when open state changes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);
  const [stories, setStories] = useState<StoryFeatureCollection | null>(null);
  const [uniqueLocations, setUniqueLocations] = useState<Array<{
    key: string;
    name: string;
    storyCount: number;
    representativeId: number | string;
  }>>([]);

  // Load stories from API
  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => {
        setStories(data);

        // Deduplicate by location (same logic as useStoryMarkers)
        if (data?.features) {
          const locationMap = new Map<string, typeof data.features>();

          data.features.forEach((feature: any) => {
            const lat = feature.geometry.coordinates[1].toFixed(5);
            const lng = feature.geometry.coordinates[0].toFixed(5);
            const key = `${lat},${lng}`;

            if (!locationMap.has(key)) {
              locationMap.set(key, []);
            }
            locationMap.get(key)!.push(feature);
          });

          // Create unique locations list
          const locations = Array.from(locationMap.entries()).map(([key, features]) => {
            const primaryFeature = features[0];
            const locationName = primaryFeature.properties.locationName ||
                                primaryFeature.properties.title?.split(' - ')[0] ||
                                '名称未設定';

            return {
              key,
              name: locationName,
              storyCount: features.length,
              representativeId: primaryFeature.id,
            };
          });

          setUniqueLocations(locations);
        }
      })
      .catch(err => console.error('Failed to load stories:', err));
  }, []);

  const handleSelect = (viewpointId: string) => {
    onSelectViewpoint(viewpointId);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-4 left-4 z-10">
      {/* Menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 flex items-center gap-2 font-medium transition-colors"
        aria-label="ビューポイントメニュー"
      >
        <span className="text-lg">📍</span>
        <span>視点を選択</span>
        <span className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-10 max-h-[600px] overflow-y-auto">
            {/* Unique Locations */}
            <div className="px-3 py-2 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                🗺️ 投稿された場所 {uniqueLocations.length > 0 && `(${uniqueLocations.length})`}
              </p>
            </div>

            {uniqueLocations.length > 0 ? (
              <div>
                {uniqueLocations.map((location) => (
                  <button
                    key={location.key}
                    onClick={() => handleSelect(`story-${location.representativeId}`)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <div className="font-medium text-slate-800">{location.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      📍 {location.storyCount}件のストーリー
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-slate-500 text-sm">
                まだ投稿がありません
                <div className="text-xs mt-2">最初の投稿者になりましょう！</div>
              </div>
            )}


            <div className="px-3 py-2 border-t border-slate-200">
              <button
                onClick={() => {
                  onReset();
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                全体ビューに戻る
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
