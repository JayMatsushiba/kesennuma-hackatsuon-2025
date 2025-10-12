'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useTranslations } from 'next-intl';
import AuthGuard from '@/app/components/auth/AuthGuard';
import Confetti from 'react-confetti';
import Link from 'next/link';

const QR_PARAMS_KEY = 'kesennuma_qr_params';

export default function ScanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address;
  const t = useTranslations('stamps');

  // Get QR parameters from URL or sessionStorage
  let locationId = searchParams.get('l');
  let secret = searchParams.get('s');

  // Handle OAuth redirect: restore QR params if missing but stored
  useEffect(() => {
    const dynamicOauthCode = searchParams.get('dynamicOauthCode');

    // If we have OAuth params but missing QR params, restore from storage
    if (dynamicOauthCode && (!locationId || !secret)) {
      const stored = sessionStorage.getItem(QR_PARAMS_KEY);
      if (stored) {
        try {
          const { l, s } = JSON.parse(stored);
          // Redirect to clean URL with restored params
          const newUrl = `/${locale}/stamps/scan?l=${l}&s=${s}`;
          sessionStorage.removeItem(QR_PARAMS_KEY); // Clean up
          router.replace(newUrl);
          return;
        } catch (e) {
          console.error('Failed to restore QR params:', e);
        }
      }
    }

    // If we have QR params, store them for potential OAuth flow
    if (locationId && secret) {
      sessionStorage.setItem(QR_PARAMS_KEY, JSON.stringify({ l: locationId, s: secret }));
    }
  }, [searchParams, locationId, secret, locale, router]);

  // Re-read after potential restoration
  locationId = searchParams.get('l');
  secret = searchParams.get('s');

  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [stampData, setStampData] = useState<any>(null);

  // Fetch location details
  useEffect(() => {
    if (!locationId || !secret) {
      setError(t('scan.invalid'));
      setLoading(false);
      return;
    }

    fetch(`/api/stamps/locations?id=${locationId}${address ? `&wallet=${address}` : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.locations?.length > 0) {
          setLocation(data.locations[0]);
        } else {
          setError(t('scan.invalid'));
        }
      })
      .catch(() => setError(t('scan.invalid')))
      .finally(() => setLoading(false));
  }, [locationId, secret, address, t]);

  const handleCollect = async () => {
    if (!address || !locationId || !secret) return;

    setCollecting(true);
    setError(null);

    try {
      // Get GPS location if available
      let latitude: number | undefined;
      let longitude: number | undefined;
      let accuracy: number | undefined;

      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000, // Increased timeout
              enableHighAccuracy: true, // Request high accuracy
              maximumAge: 0, // Don't use cached position
            });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          accuracy = position.coords.accuracy;

          console.log(`📍 GPS acquired: ${latitude}, ${longitude} (±${Math.round(accuracy)}m)`);
        } catch (gpsError: any) {
          console.error('GPS error:', gpsError);

          // Show specific GPS errors
          if (gpsError.code === 1) {
            setError(t('scan.gpsPermissionDenied') || 'GPS permission denied. Please enable location services.');
            setCollecting(false);
            return;
          } else if (gpsError.code === 3) {
            setError(t('scan.gpsTimeout') || 'GPS timeout. Please try again in an open area.');
            setCollecting(false);
            return;
          }

          // For other errors, warn but continue (server will validate)
          console.warn('GPS not available, server will validate');
        }
      }

      const res = await fetch('/api/stamps/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId,
          secret,
          walletAddress: address,
          userId: address, // Can be LINE user ID if available
          latitude,
          longitude,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle location verification errors specially
        if (res.status === 403 && data.distance) {
          setError(
            `${data.details || t('scan.tooFarAway')} (${data.distance}m away, need to be within ${data.requiredDistance}m)`
          );
        } else {
          setError(data.error || t('scan.failed'));
        }
        return;
      }

      setSuccess(true);
      setStampData(data.stamp);

      // Redirect to collection after 4 seconds
      setTimeout(() => {
        router.push(`/${locale}/stamps`);
      }, 4000);

    } catch (err) {
      console.error('Collection error:', err);
      setError(t('scan.failed'));
    } finally {
      setCollecting(false);
    }
  };

  // Success screen with confetti
  if (success && stampData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        <Confetti
          numberOfPieces={300}
          recycle={false}
          gravity={0.3}
        />

        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl text-center relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            {t('scan.success')}
          </h2>

          {stampData.image && (
            <div className="relative mb-6">
              <img
                src={stampData.image}
                alt={stampData.name}
                className="w-64 h-64 mx-auto rounded-2xl shadow-xl object-cover border-4 border-green-500"
              />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-3 shadow-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}

          <h3 className="text-2xl font-bold text-slate-900 mb-2">{stampData.name}</h3>

          {stampData.tokenId !== undefined && (
            <p className="text-sm text-slate-600 mb-4">Token #{stampData.tokenId}</p>
          )}

          {stampData.explorerUrl && !stampData.testMode && (
            <a
              href={stampData.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-6"
            >
              <span>{t('viewOnBlockchain')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">
              コレクションページに移動します...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href={`/${locale}/stamps`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backToHome')}
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-12">
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-lg text-slate-600">{t('scan.loading')}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-900 mb-2">{t('scan.title')}</h2>
              <p className="text-red-700 font-medium mb-6">{error}</p>
              <Link
                href={`/${locale}/stamps`}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                {t('scan.viewCollection')}
              </Link>
            </div>
          )}

          {location && !error && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Location Image */}
              {location.nft_image_url && (
                <div className="relative h-80 bg-gradient-to-br from-blue-100 to-purple-100">
                  <img
                    src={location.nft_image_url}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                  {location.collected && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('collected')}
                    </div>
                  )}
                </div>
              )}

              <div className="p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">{location.name}</h1>
                {location.name_en && (
                  <p className="text-lg text-slate-600 mb-4">{location.name_en}</p>
                )}

                {location.description && (
                  <p className="text-slate-700 leading-relaxed mb-6">
                    {location.description}
                  </p>
                )}

                {/* Location Info */}
                {location.location && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t('scan.locationInfo')}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {location.location.name}
                      {location.location.address && ` - ${location.location.address}`}
                    </p>
                  </div>
                )}

                {/* Collect Button */}
                {location.collected ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                    <svg className="w-16 h-16 text-green-600 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-800 font-bold text-lg mb-2">
                      {t('scan.alreadyCollected')}
                    </p>
                    <Link
                      href={`/${locale}/stamps`}
                      className="text-green-700 hover:text-green-800 font-medium underline"
                    >
                      {t('scan.viewCollection')}
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleCollect}
                    disabled={collecting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    {collecting ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('scan.collecting')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {t('scan.collectButton')}
                      </span>
                    )}
                  </button>
                )}

                {/* Info Note */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 {t('scan.howToCollect')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
