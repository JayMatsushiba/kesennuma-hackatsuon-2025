import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * GET /api/locations/search?q=query
 * Search existing locations for autocomplete
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ locations: [] });
    }

    // Search locations by name (case-insensitive)
    const { data, error } = await supabase
      .from('locations')
      .select('id, name, name_en, latitude, longitude, address, location_type')
      .or(`name.ilike.%${query}%,name_en.ilike.%${query}%,address.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Location search error:', error);
      return NextResponse.json({ locations: [] });
    }

    return NextResponse.json({
      locations: data || [],
    });
  } catch (error) {
    console.error('Failed to search locations:', error);
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    );
  }
}
