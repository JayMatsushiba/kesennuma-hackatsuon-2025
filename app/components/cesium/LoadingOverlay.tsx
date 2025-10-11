/**
 * Loading overlay for Cesium viewer
 * Shows while viewer and assets are initializing
 * Features Hoya Boya mascot with Japanese aesthetic
 */

'use client';

import { useEffect, useState } from 'react';

export default function LoadingOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  // Fade in animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`absolute inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-90' : 'opacity-0'
      }`}
    >
      <div className="text-center space-y-8 animate-fade-in">
        {/* Hoya Boya Mascot */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Animated glow effect behind mascot */}
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse"></div>

            {/* Mascot image with bounce animation */}
            <img
              src="https://www.hackatsuon.com/images/hoya-boya-transparent.png"
              alt="Hoya Boya"
              className="relative w-48 h-48 md:w-64 md:h-64 object-contain animate-bounce-slow"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>

        {/* Loading spinner */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-3">
          <p className="text-white text-xl md:text-2xl font-medium tracking-wide">
            地図を読み込み中
          </p>
          <p className="text-white/70 text-sm md:text-base">
            しばらくお待ちください...
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
