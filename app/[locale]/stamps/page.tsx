'use client';

import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useTranslations } from 'next-intl';
import AuthGuard from '@/app/components/auth/AuthGuard';
import UserProfile from '@/app/components/auth/UserProfile';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function StampCollectionPage() {
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address;
  const t = useTranslations('stamps');
  const params = useParams();
  const locale = params.locale as string;

  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [myStamps, setMyStamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ collected: 0, total: 0, percentage: 0 });

  // Fetch all stamp locations and user's collection
  useEffect(() => {
    if (!address) return;

    Promise.all([
      fetch(`/api/stamps/locations?wallet=${address}`).then(res => res.json()),
      fetch(`/api/stamps/my-collection?wallet=${address}`).then(res => res.json()),
    ])
      .then(([locationsData, collectionData]) => {
        setAllLocations(locationsData.locations || []);
        setMyStamps(collectionData.stamps || []);
        setProgress(collectionData.progress || { collected: 0, total: 0, percentage: 0 });
      })
      .catch(err => console.error('Failed to fetch data:', err))
      .finally(() => setLoading(false));
  }, [address]);

  const collectedCount = progress.collected;
  const totalCount = progress.total;
  const progressPercentage = progress.percentage;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/${locale}`}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('backToHome')}
              </Link>
              <UserProfile />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              {t('title')}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{t('progress')}</h2>
                <p className="text-blue-100">
                  {t('collection.total', { collected: collectedCount, total: totalCount })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold">{collectedCount}</div>
                <div className="text-blue-100 text-sm">/ {totalCount}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-blue-400/30 rounded-full h-6 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-center text-xs font-bold text-blue-600"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage > 10 && `${progressPercentage}%`}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-lg text-slate-600">{t('scan.loading')}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && collectedCount === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-8xl mb-6">📍</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {t('collection.empty')}
              </h3>
              <p className="text-slate-600 mb-8">
                {t('collection.emptyMessage')}
              </p>
              <Link
                href={`/${locale}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                {t('backToHome')}
              </Link>
            </div>
          )}

          {/* Stamp Grid */}
          {!loading && (
            <>
              {/* Collected Stamps */}
              {myStamps.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t('collected')} ({myStamps.length})
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myStamps.map((stamp: any) => (
                      <div
                        key={stamp.id}
                        className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl"
                      >
                        <div className="relative aspect-square">
                          <img
                            src={stamp.stamp_location?.nft_image_url}
                            alt={stamp.stamp_location?.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1 text-slate-900">
                            {stamp.stamp_location?.name}
                          </h3>
                          <p className="text-xs text-slate-500 mb-2">
                            {t('collection.collectedOn')}: {new Date(stamp.collected_at).toLocaleDateString('ja-JP')}
                          </p>

                          {stamp.explorerUrl && (
                            <a
                              href={stamp.explorerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              <span>{t('viewOnBlockchain')}</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uncollected Stamps */}
              {allLocations.filter((loc: any) => !loc.collected).length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {t('notCollected')} ({allLocations.filter((loc: any) => !loc.collected).length})
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allLocations
                      .filter((loc: any) => !loc.collected)
                      .map((location: any) => (
                        <div
                          key={location.id}
                          className="bg-white rounded-xl shadow-lg overflow-hidden opacity-60 hover:opacity-80 transition-opacity"
                        >
                          <div className="relative aspect-square bg-slate-200">
                            <img
                              src={location.nft_image_url}
                              alt={location.name}
                              className="w-full h-full object-cover filter grayscale"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                          </div>

                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-1 text-slate-700">
                              {location.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {t('visitToCollect')}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
