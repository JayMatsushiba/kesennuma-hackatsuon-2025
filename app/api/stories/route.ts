import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { storiesToGeoJSON } from '@/lib/cesium/utils/geojson';

/**
 * GET /api/stories
 * Returns approved stories as GeoJSON FeatureCollection
 */
export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
    });

    const geojson = storiesToGeoJSON(stories);

    return NextResponse.json(geojson, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}
