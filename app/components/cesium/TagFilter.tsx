/**
 * Tag filter component for filtering stories on the map
 * Displays tags as toggleable options that update immediately
 */

'use client';

import { useState, useEffect } from 'react';
import type { Tag as TagType } from '@/app/api/tags/route';

export interface TagFilterProps {
  selectedTags: number[];
  onTagsChange: (tagIds: number[]) => void;
  className?: string;
}

export default function TagFilter({ selectedTags, onTagsChange, className = '' }: TagFilterProps) {
  const [tags, setTags] = useState<TagType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Load tags from API
  useEffect(() => {
    fetch('/api/tags')
      .then(res => res.json())
      .then(data => {
        setTags(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load tags:', err);
        setIsLoading(false);
      });
  }, []);

  const handleTagToggle = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  return (
    <div className={`absolute top-20 left-4 z-10 ${className}`}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 flex items-center gap-2 font-medium transition-colors"
        aria-label="タグフィルター"
      >
        <span className="text-lg">🏷️</span>
        <span>フィルター</span>
        {selectedTags.length > 0 && (
          <span className="bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
            {selectedTags.length}
          </span>
        )}
        <span className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-10">
            <div className="px-3 py-2 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase">タグで絞り込み</p>
                {selectedTags.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                  >
                    クリア
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto py-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                </div>
              ) : tags.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">タグがありません</p>
                </div>
              ) : (
                tags.map(tag => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tag.icon}</span>
                          <div>
                            <div className="font-medium text-slate-800">{tag.name}</div>
                            <div className="text-xs text-slate-500">{tag.story_count}件のストーリー</div>
                          </div>
                        </div>

                        {/* Toggle switch */}
                        <div className={`relative inline-block w-11 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                          isSelected ? 'bg-brand-600' : 'bg-slate-300'
                        }`}>
                          <span className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out ${
                            isSelected ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-3 py-2 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                {selectedTags.length === 0
                  ? 'すべてのストーリーを表示中'
                  : `${selectedTags.length}個のタグでフィルター中`
                }
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
