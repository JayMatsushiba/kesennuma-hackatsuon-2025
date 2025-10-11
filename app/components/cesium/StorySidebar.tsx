/**
 * Collapsible sidebar for displaying stories in Cesium viewer
 * Can show multiple stories as cards or a single story expanded
 */

'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import StoryCard from './StoryCard';
import StoryDetail from './StoryDetail';
import type { EntityClickEvent } from '@/lib/cesium/types';

export interface Story {
  id: string;
  title: string;
  description: string;
  mediaUrl?: string;
  submitter?: string;
  createdAt?: string;
  position: {
    latitude: number;
    longitude: number;
  };
  content?: ContentBlock[];
  tags?: Tag[];
}

export interface ContentBlock {
  id: string;
  blockType: 'text' | 'image' | 'video' | 'gallery' | 'quote' | 'embed' | 'model3d';
  order: number;
  data: any;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
  icon?: string;
}

export interface StorySidebarProps {
  stories: Story[];
  selectedStoryId: string | null;
  onStorySelect: (storyId: string) => void;
  onClose: () => void;
  className?: string;
}

export default function StorySidebar({
  stories,
  selectedStoryId,
  onStorySelect,
  onClose,
  className = '',
}: StorySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedStory = stories.find(s => s.id === selectedStoryId);
  const showingDetail = selectedStory && isExpanded;

  // Toggle collapse/expand
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle story card click
  const handleStoryClick = (storyId: string) => {
    onStorySelect(storyId);
    setIsExpanded(true);
  };

  // Handle back from detail view
  const handleBack = () => {
    setIsExpanded(false);
  };

  // If collapsed, show just a tab
  if (isCollapsed) {
    return (
      <div
        className={`absolute top-4 right-4 z-50 bg-white rounded-lg shadow-2xl ${className}`}
      >
        <button
          onClick={toggleCollapse}
          className="p-3 hover:bg-slate-50 rounded-lg transition-colors"
          aria-label="ストーリーを表示"
        >
          <ChevronLeftIcon className="w-6 h-6 text-slate-700" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`absolute top-0 right-0 h-full z-40 bg-white shadow-2xl flex flex-col transition-all duration-300 ${
        showingDetail ? 'w-full md:w-2/3 lg:w-1/2' : 'w-full md:w-96'
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          {showingDetail && (
            <button
              onClick={handleBack}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              aria-label="戻る"
            >
              <ChevronLeftIcon className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <h2 className="text-lg font-bold text-slate-900">
            {showingDetail ? selectedStory.title : 'ストーリー'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCollapse}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
            aria-label="折りたたむ"
          >
            <ChevronRightIcon className="w-5 h-5 text-slate-700" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
            aria-label="閉じる"
          >
            <XMarkIcon className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showingDetail ? (
          // Show detailed story view
          <StoryDetail story={selectedStory} />
        ) : (
          // Show list of story cards
          <div className="p-4 space-y-3">
            {stories.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm">ストーリーがありません</p>
              </div>
            ) : (
              stories.map(story => (
                <StoryCard
                  key={story.id}
                  story={story}
                  isSelected={story.id === selectedStoryId}
                  onClick={() => handleStoryClick(story.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer (optional - could add stats or actions) */}
      {!showingDetail && stories.length > 0 && (
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-600 text-center">
            {stories.length} 件のストーリー
          </p>
        </div>
      )}
    </div>
  );
}
