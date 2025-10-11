import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createClient } from '@supabase/supabase-js';
import type { StoryFeatureCollection } from '@/lib/cesium/types';

// Admin client with service role key for writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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

/**
 * POST /api/stories
 * Create a new story submission
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract data from request
    const {
      title,
      title_en,
      excerpt,
      excerpt_en,
      location,
      tags,
      content,
      coverImageUrl,
      submitterName,
    } = body;

    // Validation
    if (!title || !excerpt) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Validate location (either existing ID or new location with coordinates)
    if (!location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    // If not using existing location, validate coordinates
    if (!location.id && (!location.latitude || !location.longitude)) {
      return NextResponse.json(
        { error: 'Location with latitude and longitude is required' },
        { status: 400 }
      );
    }

    // Step 1: Create or find location
    let locationId: string;

    if (location.id) {
      // Use existing location
      locationId = location.id;
    } else {
      // Create new location (use admin client to bypass RLS)
      const { data: newLocation, error: locationError } = await (supabaseAdmin as any)
        .from('locations')
        .insert({
          name: location.name || title,
          name_en: location.name_en || title_en,
          description: location.description,
          description_en: location.description_en,
          latitude: location.latitude,
          longitude: location.longitude,
          altitude: location.altitude || null,
          address: location.address,
          address_en: location.address_en,
          location_type: location.location_type || 'user_submitted',
          // PostGIS point
          point: `SRID=4326;POINT(${location.longitude} ${location.latitude})`,
        })
        .select('id')
        .single();

      if (locationError || !newLocation) {
        console.error('Location creation error:', locationError);
        return NextResponse.json(
          { error: 'Failed to create location', details: locationError },
          { status: 500 }
        );
      }

      locationId = newLocation.id;
    }

    // Step 2: Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100) + '-' + Date.now();

    // Step 3: Create community user ID (default author)
    const communityUserId = '00000000-0000-0000-0000-000000000001';

    // Step 4: Create story (use admin client to bypass RLS)
    const { data: story, error: storyError } = await (supabaseAdmin as any)
      .from('stories')
      .insert({
        title,
        title_en,
        slug,
        excerpt,
        excerpt_en,
        cover_image_url: coverImageUrl || null,
        author_id: communityUserId,
        location_id: locationId,
        status: 'published', // Auto-publish for seamless UX
        featured: false,
        view_count: 0,
        published_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (storyError || !story) {
      console.error('Story creation error:', storyError);
      return NextResponse.json(
        { error: 'Failed to create story', details: storyError },
        { status: 500 }
      );
    }

    // Step 5: Add tags (if provided)
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagInserts = tags.map((tagId: number) => ({
        story_id: story.id,
        tag_id: tagId,
      }));

      const { error: tagsError } = await (supabaseAdmin as any)
        .from('story_tags')
        .insert(tagInserts);

      if (tagsError) {
        console.error('Tags creation error:', tagsError);
        // Non-fatal, continue
      }
    }

    // Step 6: Add content blocks (if provided)
    if (content && Array.isArray(content) && content.length > 0) {
      const contentInserts = content.map((block: any, index: number) => ({
        story_id: story.id,
        block_type: block.type || 'text',
        order: block.order !== undefined ? block.order : index,
        data: block.data || {},
      }));

      const { error: contentError } = await (supabaseAdmin as any)
        .from('story_content')
        .insert(contentInserts);

      if (contentError) {
        console.error('Content creation error:', contentError);
        // Non-fatal, continue
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: '送信しました。地図に表示されます。',
        story: {
          id: story.id,
          slug,
          title,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create story:', error);
    return NextResponse.json(
      {
        error: 'Failed to create story',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
