import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export interface Tag {
  id: number;
  name: string;
  name_en: string | null;
  slug: string;
  color: string;
  icon: string | null;
  story_count: number;
}

/**
 * GET /api/tags
 * Returns all available tags with their metadata
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('id, name, name_en, slug, color, icon, story_count')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(data || [], {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch tags',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
