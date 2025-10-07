/**
 * Loading overlay for Cesium viewer
 * Shows while viewer and assets are initializing
 */

'use client';

export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-brand-500 mb-4"></div>
        <p className="text-white text-lg font-medium">地図を読み込み中...</p>
        <p className="text-slate-300 text-sm mt-2">しばらくお待ちください</p>
      </div>
    </div>
  );
}
