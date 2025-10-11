import { NextResponse } from 'next/server';

/**
 * GET /api/geocode?address=...
 * Proxy for OpenStreetMap Nominatim to avoid CORS issues
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address || address.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Add Kesennuma context if not already present
    const needsContext = !address.includes('気仙沼') &&
                         !address.includes('Kesennuma') &&
                         !address.includes('宮城');

    const searchQuery = needsContext
      ? `${address} 気仙沼 宮城県`
      : address;

    console.log('[Geocode] Searching for:', searchQuery);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&countrycodes=jp`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Kesennuma-Digital-Experiences/1.0',
      },
    });

    if (!response.ok) {
      console.error('[Geocode] API error:', response.status, response.statusText);
      return NextResponse.json({ results: [] });
    }

    const data = await response.json();
    console.log('[Geocode] Found results:', data.length);

    const results = data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      display_name: item.display_name,
      name: item.name || item.display_name.split(',')[0],
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('[Geocode] Error:', error);
    return NextResponse.json({ results: [] });
  }
}
