import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/stamps/locations
 * Returns all active stamp locations, optionally with collected status
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('wallet'); // Optional - to check collected status
  const locationId = searchParams.get('id'); // Optional - get single location

  try {
    let query = supabase
      .from('stamp_locations')
      .select(`
        *,
        location:locations(
          id,
          name,
          name_en,
          latitude,
          longitude,
          address,
          address_en
        )
      `)
      .eq('active', true);

    // If specific location requested
    if (locationId) {
      query = query.eq('id', locationId);
    }

    query = query.order('created_at', { ascending: true });

    const { data: locations, error } = await query;

    if (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }

    // If wallet address provided, check which stamps user already has
    let collectedIds: string[] = [];
    if (walletAddress) {
      const { data: collected } = await supabase
        .from('user_stamps')
        .select('stamp_location_id')
        .eq('wallet_address', walletAddress);

      collectedIds = collected?.map((s: any) => s.stamp_location_id) || [];
    }

    // Add collected status to each location
    const locationsWithStatus = locations?.map((loc: any) => ({
      ...loc,
      collected: collectedIds.includes(loc.id),
    }));

    return NextResponse.json({
      success: true,
      locations: locationsWithStatus || [],
      total: locations?.length || 0,
    });
  } catch (error) {
    console.error('Failed to fetch stamp locations:', error);
    return NextResponse.json(
      {
        error: 'スタンプ情報の取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
