'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselImage {
  url: string;
  title: string;
  alt: string;
}

interface HeroCarouselProps {
  images: CarouselImage[];
  autoPlayInterval?: number;
}

export default function HeroCarousel({
  images,
  autoPlayInterval = 5000
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 150);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval]);

  if (images.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-400 text-lg">画像を読み込み中...</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
      {/* Main image */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
        <h3
          className={`text-xl md:text-2xl font-bold transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {currentImage.title}
        </h3>
      </div>

      {/* Navigation dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 150);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`スライド ${index + 1} に移動`}
            />
          ))}
        </div>
      )}

      {/* Navigation arrows (visible on hover) */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                setIsTransitioning(false);
              }, 150);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-20"
            aria-label="前の画像"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
                setIsTransitioning(false);
              }, 150);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-20"
            aria-label="次の画像"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
