import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// Type definitions
type StoryLocation = {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  latitude: number;
  longitude: number;
  altitude: number | null;
  address: string | null;
  address_en: string | null;
  location_type: string | null;
};

type StoryData = {
  id: number;
  title: string;
  title_en: string | null;
  slug: string;
  excerpt: string | null;
  excerpt_en: string | null;
  cover_image_url: string | null;
  status: string;
  featured: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  author_id: string | null;
  location_id: string | null;
  locations: StoryLocation | null;
};

type TagData = {
  tags: {
    id: number;
    name: string;
    name_en: string | null;
    slug: string;
    color: string;
    icon: string | null;
  };
};

/**
 * GET /api/stories/[slug]
 * Returns a single story with full details including content blocks
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch story with location and tags
    const { data, error: storyError } = await supabase
      .from('stories')
      .select(`
        id,
        title,
        title_en,
        slug,
        excerpt,
        excerpt_en,
        cover_image_url,
        status,
        featured,
        view_count,
        published_at,
        created_at,
        author_id,
        location_id,
        locations (
          id,
          name,
          name_en,
          description,
          description_en,
          latitude,
          longitude,
          altitude,
          address,
          address_en,
          location_type
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    const story = data as StoryData | null;

    if (storyError || !story) {
      if (storyError?.code === 'PGRST116' || !story) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }
      throw storyError;
    }

    // Fetch story tags
    const { data: storyTags, error: tagsError } = await supabase
      .from('story_tags')
      .select(`
        tags (
          id,
          name,
          name_en,
          slug,
          color,
          icon
        )
      `)
      .eq('story_id', story.id);

    if (tagsError) {
      console.error('Error fetching tags:', tagsError);
    }

    // Fetch story content blocks
    const { data: contentBlocks, error: contentError } = await supabase
      .from('story_content')
      .select('*')
      .eq('story_id', story.id)
      .order('order', { ascending: true });

    if (contentError) {
      console.error('Error fetching content:', contentError);
    }

    // Fetch camera keyframes
    const { data: keyframes, error: keyframesError } = await supabase
      .from('camera_keyframes')
      .select('*')
      .eq('story_id', story.id)
      .order('is_default', { ascending: false });

    if (keyframesError) {
      console.error('Error fetching keyframes:', keyframesError);
    }

    // Fetch story media
    const { data: media, error: mediaError } = await supabase
      .from('story_media')
      .select('*')
      .eq('story_id', story.id)
      .eq('is_used', true);

    if (mediaError) {
      console.error('Error fetching media:', mediaError);
    }

    // Increment view count (fire and forget)
    // Note: Using type assertion to bypass Supabase's strict typing
    const incrementViewCount = async () => {
      try {
        await (supabase as any)
          .from('stories')
          .update({ view_count: story.view_count + 1 })
          .eq('id', story.id);
      } catch (err) {
        console.error('Failed to increment view count:', err);
      }
    };
    void incrementViewCount();

    // Assemble response
    const typedStoryTags = (storyTags || []) as TagData[];

    const response = {
      ...story,
      tags: typedStoryTags.map((st) => st.tags).filter(Boolean) || [],
      content: contentBlocks || [],
      keyframes: keyframes || [],
      media: media || [],
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Failed to fetch story:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch story',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
