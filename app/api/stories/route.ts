import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { StoryFeatureCollection } from '@/lib/cesium/types';

// Type for the Supabase RPC response
type StoryGeoJsonData = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  latitude: number;
  longitude: number;
  location_name: string;
  cover_image_url: string | null;
  published_at: string | null;
  tags: Array<{
    id: number;
    name: string;
    color: string;
  }>;
};

/**
 * GET /api/stories
 * Returns published stories as GeoJSON FeatureCollection
 * Fetches data from Supabase using the get_stories_geojson() function
 */
export async function GET() {
  try {
    // Call the Supabase function that returns stories with location data
    // Note: Type assertion needed due to Supabase client type generation limitations
    const { data, error } = await (supabase.rpc as any)('get_stories_geojson', {
      status_filter: 'published',
    });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { type: 'FeatureCollection', features: [] } as StoryFeatureCollection,
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    }

    // Type assertion for the data
    const stories = data as unknown as StoryGeoJsonData[];

    // Convert Supabase data to GeoJSON FeatureCollection
    const geojson: StoryFeatureCollection = {
      type: 'FeatureCollection',
      features: stories.map((story) => ({
        type: 'Feature' as const,
        id: story.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [story.longitude, story.latitude] as [number, number], // [lng, lat] for GeoJSON
        },
        properties: {
          title: story.title,
          description: story.excerpt || '',
          slug: story.slug,
          locationName: story.location_name,
          coverImageUrl: story.cover_image_url,
          publishedAt: story.published_at,
          tags: Array.isArray(story.tags) ? story.tags : [],
        },
      })),
    };

    return NextResponse.json(geojson, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
