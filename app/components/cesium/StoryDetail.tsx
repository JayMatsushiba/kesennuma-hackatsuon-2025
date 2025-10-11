/**
 * Detailed story view component with full content blocks
 * Displays rich content including text, images, videos, galleries, etc.
 */

'use client';

import { MapPinIcon, UserIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline';
import type { Story, ContentBlock } from './StorySidebar';

export interface StoryDetailProps {
  story: Story;
}

export default function StoryDetail({ story }: StoryDetailProps) {
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render content blocks
  const renderContentBlock = (block: ContentBlock) => {
    switch (block.blockType) {
      case 'text':
        return <TextBlock key={block.id} data={block.data} />;
      case 'image':
        return <ImageBlock key={block.id} data={block.data} />;
      case 'video':
        return <VideoBlock key={block.id} data={block.data} />;
      case 'gallery':
        return <GalleryBlock key={block.id} data={block.data} />;
      case 'quote':
        return <QuoteBlock key={block.id} data={block.data} />;
      case 'embed':
        return <EmbedBlock key={block.id} data={block.data} />;
      case 'model3d':
        return <Model3DBlock key={block.id} data={block.data} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white">
      {/* Hero image */}
      {story.mediaUrl && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={story.mediaUrl}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {story.tags.map(tag => (
              <span
                key={tag.id}
                className="px-3 py-1 text-sm rounded-full font-medium"
                style={{
                  backgroundColor: tag.color ? `${tag.color}20` : '#e2e8f0',
                  color: tag.color || '#64748b',
                }}
              >
                {tag.icon && <span className="mr-1">{tag.icon}</span>}
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          {story.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 pb-4 border-b border-slate-200">
          {/* Submitter */}
          {story.submitter && (
            <div className="flex items-center gap-1.5">
              <UserIcon className="w-4 h-4" />
              <span>{story.submitter}</span>
            </div>
          )}

          {/* Date */}
          {story.createdAt && (
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              <span>{formatDate(story.createdAt)}</span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="w-4 h-4" />
            <span>
              {story.position.latitude.toFixed(4)}, {story.position.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Description (if no content blocks) */}
        {(!story.content || story.content.length === 0) && (
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {story.description}
            </p>
          </div>
        )}

        {/* Content blocks */}
        {story.content && story.content.length > 0 && (
          <div className="space-y-6">
            {story.content
              .sort((a, b) => a.order - b.order)
              .map(block => renderContentBlock(block))}
          </div>
        )}
      </div>
    </div>
  );
}

// Content block components

function TextBlock({ data }: { data: any }) {
  const { content, format = 'plain' } = data;

  if (format === 'markdown') {
    // TODO: Add markdown rendering library
    return (
      <div className="prose prose-slate max-w-none">
        <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="prose prose-slate max-w-none">
      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
        {content}
      </p>
    </div>
  );
}

function ImageBlock({ data }: { data: any }) {
  const { mediaId, caption, alt, layout = 'full' } = data;

  // TODO: Fetch actual image URL from mediaId
  const imageUrl = data.url || `/api/media/${mediaId}`;

  return (
    <figure className={`${layout === 'full' ? 'w-full' : 'max-w-lg mx-auto'}`}>
      <img
        src={imageUrl}
        alt={alt || caption || ''}
        className="w-full rounded-lg shadow-md"
        loading="lazy"
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-slate-600 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function VideoBlock({ data }: { data: any }) {
  const { mediaId, caption, autoplay = false } = data;

  // TODO: Fetch actual video URL from mediaId
  const videoUrl = data.url || `/api/media/${mediaId}`;

  return (
    <figure className="w-full">
      <video
        src={videoUrl}
        controls
        autoPlay={autoplay}
        className="w-full rounded-lg shadow-md"
      >
        お使いのブラウザは動画再生に対応していません。
      </video>
      {caption && (
        <figcaption className="mt-2 text-sm text-slate-600 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function GalleryBlock({ data }: { data: any }) {
  const { mediaIds, layout = 'grid' } = data;

  // TODO: Fetch actual image URLs from mediaIds
  const images = data.images || [];

  return (
    <div className={`grid ${
      layout === 'grid'
        ? 'grid-cols-2 md:grid-cols-3'
        : 'grid-cols-1'
    } gap-4`}>
      {images.map((img: any, index: number) => (
        <div key={index} className="relative aspect-square">
          <img
            src={img.url}
            alt={img.alt || `Image ${index + 1}`}
            className="w-full h-full object-cover rounded-lg shadow-md"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

function QuoteBlock({ data }: { data: any }) {
  const { text, author } = data;

  return (
    <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-4">
      <p className="text-lg text-slate-700 italic leading-relaxed">
        "{text}"
      </p>
      {author && (
        <cite className="block mt-2 text-sm text-slate-600 not-italic">
          — {author}
        </cite>
      )}
    </blockquote>
  );
}

function EmbedBlock({ data }: { data: any }) {
  const { embedType, url, metadata } = data;

  // Handle different embed types
  if (embedType === 'youtube') {
    const videoId = extractYouTubeId(url);
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="absolute inset-0 w-full h-full rounded-lg shadow-md"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Generic embed
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {metadata?.title || url}
      </a>
    </div>
  );
}

function Model3DBlock({ data }: { data: any }) {
  const { mediaId, viewerSettings } = data;

  // TODO: Implement 3D model viewer (Cesium Ion, Three.js, etc.)
  return (
    <div className="border border-slate-200 rounded-lg p-8 bg-slate-50 text-center">
      <p className="text-slate-600">3D Model Viewer</p>
      <p className="text-sm text-slate-500 mt-2">Model ID: {mediaId}</p>
    </div>
  );
}

// Helper functions

function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : '';
}
