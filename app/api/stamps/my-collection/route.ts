import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getExplorerUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}

/**
 * GET /api/stamps/my-collection
 * Returns user's collected stamps with blockchain proof
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('wallet');

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch user's collected stamps with location details
    const { data: stamps, error } = await supabase
      .from('user_stamps')
      .select(`
        *,
        stamp_location:stamp_locations(
          id,
          name,
          name_en,
          description,
          description_en,
          nft_image_url,
          token_id,
          location:locations(
            id,
            name,
            name_en,
            latitude,
            longitude,
            address
          )
        )
      `)
      .eq('wallet_address', walletAddress)
      .order('collected_at', { ascending: false });

    if (error) {
      console.error('Error fetching collection:', error);
      throw error;
    }

    // Add explorer URLs
    const stampsWithExplorer = stamps?.map((stamp: any) => ({
      ...stamp,
      explorerUrl: stamp.tx_hash ? getExplorerUrl(stamp.tx_hash) : null,
    }));

    // Calculate progress
    const { data: totalLocations } = await supabase
      .from('stamp_locations')
      .select('id', { count: 'exact' })
      .eq('active', true);

    const totalCount = totalLocations?.length || 0;
    const collectedCount = stamps?.length || 0;
    const progress = totalCount > 0 ? Math.round((collectedCount / totalCount) * 100) : 0;

    return NextResponse.json({
      success: true,
      stamps: stampsWithExplorer || [],
      progress: {
        collected: collectedCount,
        total: totalCount,
        percentage: progress,
      },
    });
  } catch (error) {
    console.error('Failed to fetch stamp collection:', error);
    return NextResponse.json(
      {
        error: 'コレクションの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
