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
}

export default function ViewpointSelector({ onSelectViewpoint, onReset }: ViewpointSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stories, setStories] = useState<StoryFeatureCollection | null>(null);

  // Load stories from API
  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => setStories(data))
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
            {/* User Stories */}
            <div className="px-3 py-2 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                🗺️ 投稿された場所 {stories && `(${stories.features.length})`}
              </p>
            </div>

            {stories && stories.features.length > 0 ? (
              <div>
                {stories.features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => handleSelect(`story-${feature.id}`)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <div className="font-medium text-slate-800">{feature.properties.title}</div>
                    {feature.properties.locationName && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        📍 {feature.properties.locationName}
                      </div>
                    )}
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
