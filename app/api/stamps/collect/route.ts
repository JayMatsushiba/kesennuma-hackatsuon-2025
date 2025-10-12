import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Contract ABI - only the functions we need
const CONTRACT_ABI = [
  "function claim(address to, uint256 tokenId) external",
  "function hasUserClaimed(address user, uint256 tokenId) view returns (bool)"
];

function getExplorerUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}

/**
 * POST /api/stamps/collect
 * Verify QR code and mint soulbound NFT on Base mainnet
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { locationId, secret, walletAddress, userId, latitude, longitude } = body;

    // Validation
    if (!locationId || !secret || !walletAddress) {
      return NextResponse.json(
        { error: '必須項目が不足しています', details: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Verify QR code secret
    const { data: location, error: locationError } = await supabase
      .from('stamp_locations')
      .select('*')
      .eq('id', locationId)
      .eq('qr_secret', secret)
      .eq('active', true)
      .single();

    if (locationError || !location) {
      console.error('Invalid QR code:', locationError);
      return NextResponse.json(
        { error: '無効なQRコードです', details: 'Invalid QR code or inactive location' },
        { status: 400 }
      );
    }

    // 2. Check if already collected
    const { data: existing } = await supabase
      .from('user_stamps')
      .select('id')
      .eq('wallet_address', walletAddress)
      .eq('stamp_location_id', locationId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'このスタンプは既に獲得済みです', details: 'Already collected' },
        { status: 409 }
      );
    }

    // 3. Check if contract is configured
    if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || !process.env.ADMIN_WALLET_ADDRESS || !process.env.THIRDWEB_ADMIN_PRIVATE_KEY) {
      console.warn('Contract not configured, saving to database only');

      // Save to database without blockchain (for testing)
      const { data: stamp, error: insertError } = await supabase
        .from('user_stamps')
        .insert({
          user_id: userId || walletAddress,
          wallet_address: walletAddress,
          stamp_location_id: locationId,
          token_id: location.token_id,
          tx_hash: 'test_' + Date.now(), // Placeholder
          latitude,
          longitude,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({
        success: true,
        message: 'スタンプを獲得しました！(テストモード)',
        testMode: true,
        stamp: {
          id: stamp.id,
          name: location.name,
          image: location.nft_image_url,
          tokenId: location.token_id,
        },
      }, { status: 201 });
    }

    // 4. 🚀 MINT NFT ON BASE MAINNET using ethers.js
    console.log('Connecting to Base mainnet...');

    // Create provider for Base mainnet
    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');

    // Create wallet from private key
    const wallet = new ethers.Wallet(
      process.env.THIRDWEB_ADMIN_PRIVATE_KEY!,
      provider
    );

    console.log('Admin wallet:', wallet.address);
    console.log('Getting contract at:', process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

    // Connect to contract
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      CONTRACT_ABI,
      wallet
    );

    // Check if already claimed on-chain (double-check)
    const hasClaimed = await contract.hasUserClaimed(walletAddress, location.token_id);
    if (hasClaimed) {
      return NextResponse.json(
        { error: 'このスタンプは既にブロックチェーン上で獲得済みです' },
        { status: 409 }
      );
    }

    console.log(`Minting token ID ${location.token_id} to ${walletAddress}...`);

    // Mint the NFT
    const tx = await contract.claim(walletAddress, location.token_id);

    console.log('Transaction sent:', tx.hash);
    console.log('Waiting for confirmation...');

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    console.log('✅ NFT minted successfully!', receipt.hash);

    // 5. Save to database WITH blockchain proof
    const { data: stamp, error: insertError } = await supabase
      .from('user_stamps')
      .insert({
        user_id: userId || walletAddress,
        wallet_address: walletAddress,
        stamp_location_id: locationId,
        token_id: location.token_id,
        tx_hash: receipt.hash,
        block_number: receipt.blockNumber,
        blockchain_network: 'base',
        latitude,
        longitude,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert failed:', insertError);
      // NFT minted but DB failed - not ideal but user still has NFT
      return NextResponse.json(
        {
          warning: 'NFT minted but database update failed',
          txHash: receipt.hash,
          explorerUrl: getExplorerUrl(receipt.hash),
        },
        { status: 201 }
      );
    }

    // 6. Success!
    return NextResponse.json({
      success: true,
      message: 'スタンプを獲得しました！',
      stamp: {
        id: stamp.id,
        name: location.name,
        nameEn: location.name_en,
        image: location.nft_image_url,
        txHash: receipt.hash,
        tokenId: location.token_id,
        explorerUrl: getExplorerUrl(receipt.hash),
        blockNumber: receipt.blockNumber,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Stamp collection failed:', error);

    // Detailed error logging
    if (error.reason) {
      console.error('Contract error reason:', error.reason);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }

    return NextResponse.json(
      {
        error: 'スタンプの獲得に失敗しました',
        details: error.message || error.reason || 'Unknown error',
        code: error.code,
      },
      { status: 500 }
    );
  }
}
