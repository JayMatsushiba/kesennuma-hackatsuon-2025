'use client';

import CesiumViewer from '@/app/components/cesium/CesiumViewer';
import Link from 'next/link';

export default function TestCesiumPage() {
  return (
    <div className="relative w-screen h-screen">
      {/* Back button */}
      <div className="absolute top-4 right-4 z-20">
        <Link
          href="/"
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 font-medium transition-colors"
        >
          ← ホームに戻る
        </Link>
      </div>

      {/* Info panel */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 p-4 text-center">
          <h2 className="font-bold text-slate-900 mb-1">
            気仙沼3D地図
          </h2>
          <p className="text-sm text-slate-600">
            左上のメニューで視点を切り替え、マーカーをクリックで詳細表示
          </p>
        </div>
      </div>

      {/* Cesium Viewer */}
      <CesiumViewer
        showViewpointSelector={true}
        onStoryClick={(event) => {
          console.log('Story clicked:', event);
        }}
      />
    </div>
  );
}
