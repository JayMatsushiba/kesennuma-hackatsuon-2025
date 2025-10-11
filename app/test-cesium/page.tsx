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
