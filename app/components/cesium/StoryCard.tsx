/**
 * Compact story card component for displaying stories in list view
 */

'use client';

import { MapPinIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { Story } from './StorySidebar';

export interface StoryCardProps {
  story: Story;
  isSelected: boolean;
  onClick: () => void;
}

export default function StoryCard({ story, isSelected, onClick }: StoryCardProps) {
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Truncate description
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl transition-all duration-200 ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
          : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="p-4">
        {/* Cover image */}
        {story.mediaUrl && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={story.mediaUrl}
              alt={story.title}
              className="w-full h-32 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Title */}
        <h3 className={`font-bold text-base mb-2 ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
          {story.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {truncateText(story.description, 100)}
        </p>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {story.tags.slice(0, 3).map(tag => (
              <span
                key={tag.id}
                className="px-2 py-0.5 text-xs rounded-full"
                style={{
                  backgroundColor: tag.color ? `${tag.color}20` : '#e2e8f0',
                  color: tag.color || '#64748b',
                }}
              >
                {tag.icon && <span className="mr-1">{tag.icon}</span>}
                {tag.name}
              </span>
            ))}
            {story.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                +{story.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {/* Location */}
          <div className="flex items-center gap-1">
            <MapPinIcon className="w-3.5 h-3.5" />
            <span>
              {story.position.latitude.toFixed(4)}, {story.position.longitude.toFixed(4)}
            </span>
          </div>

          {/* Submitter */}
          {story.submitter && (
            <div className="flex items-center gap-1">
              <UserIcon className="w-3.5 h-3.5" />
              <span>{story.submitter}</span>
            </div>
          )}

          {/* Date */}
          {story.createdAt && (
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>{formatDate(story.createdAt)}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
