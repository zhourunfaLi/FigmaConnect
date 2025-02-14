import { type Artwork } from "@shared/schema";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Constants for layout configuration
const GRID_CONFIG = {
  MOBILE_COLUMNS: 2,
  TABLET_COLUMNS: 3,
  DESKTOP_COLUMNS: 4,
  GROUP_SIZE: 7, // 2*3 + 1 pattern
  BASE_HEIGHT: 128,
  TABLET_SCALE: 1.5,
  DESKTOP_SCALE: 2,
} as const;

// Common aspect ratios for artwork display
const ARTWORK_ASPECT_RATIOS = [3/4, 4/5, 2/3, 5/4, 1] as const;

type WorksListProps = {
  artworks: Artwork[];
  className?: string;
};

// Advertisement component for the artwork grid
function AdCard() {
  return (
    <div className="w-full">
      <div className="relative aspect-[3/4] w-full bg-white rounded-xl overflow-hidden border border-black/5">
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
          广告
        </div>
        <div className="w-full h-full flex items-center justify-center text-black/30">
          Google Ads
        </div>
      </div>
      <div className="flex justify-between items-center px-2 mt-2">
        <div className="text-sm text-[#111111] font-medium leading-5 truncate">
          推广内容
        </div>
      </div>
    </div>
  );
}

// Artwork component with lazy loading and loading state
function ArtworkItem({ 
  artwork, 
  isWide, 
  wideHeight, 
  index 
}: { 
  artwork: Artwork & { isWide: boolean; aspectRatio: number }; 
  isWide: boolean; 
  wideHeight: number;
  index: number;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px'
      }
    );

    const element = document.getElementById(`artwork-${artwork.id}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [artwork.id]);

  return (
    <div 
      id={`artwork-${artwork.id}`}
      className={cn(
        "break-inside-avoid mb-4",
        isWide && "-ml-[4px]" // Adjust wide artwork alignment
      )}
      style={{
        columnSpan: isWide ? "all" : "none",
        breakBefore: isWide ? "column" : "auto",
        position: 'relative'
      }}
    >
      <div 
        className="w-full relative"
        style={{ 
          height: isWide ? `${wideHeight}px` : undefined,
          aspectRatio: isWide ? undefined : artwork.aspectRatio,
        }}
      >
        {/* Loading skeleton */}
        {(!isVisible || !imageLoaded) && (
          <Skeleton 
            className={cn(
              "absolute inset-0 rounded-xl",
              !imageLoaded && "animate-pulse"
            )}
          />
        )}

        {isVisible && (
          <img
            src={`./src/assets/design/works-${String(artwork.id % 8 + 1).padStart(2, '0')}.png`}
            alt={artwork.title}
            className={cn(
              "w-full h-full rounded-xl object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        )}

        {/* Artwork labels */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
          #{index + 1}
        </div>
        {artwork.isPremium && (
          <div className="absolute top-2 left-[4.5rem] px-2 py-1 bg-[#EB9800] text-white text-xs font-medium rounded-md">
            SVIP
          </div>
        )}
      </div>
      {/* Artwork title and options */}
      <div className="flex justify-between items-center px-2 mt-2">
        <div className="text-sm text-[#111111] font-medium leading-5 truncate">
          {artwork.title}
        </div>
        <button className="flex gap-1 p-1 hover:bg-black/5 rounded-full transition-colors">
          <div className="w-1 h-1 rounded-full bg-[#111111]" />
          <div className="w-1 h-1 rounded-full bg-[#111111]" />
          <div className="w-1 h-1 rounded-full bg-[#111111]" />
        </button>
      </div>
    </div>
  );
}

export default function WorksList({ artworks, className }: WorksListProps) {
  const [wideHeight, setWideHeight] = useState(GRID_CONFIG.BASE_HEIGHT);

  // Update wide artwork height based on screen size
  useEffect(() => {
    const updateWideHeight = () => {
      const width = window.innerWidth;
      if (width < 768) { // Mobile: 2 columns
        setWideHeight(GRID_CONFIG.BASE_HEIGHT);
      } else if (width < 1024) { // Tablet: 3 columns
        setWideHeight(GRID_CONFIG.BASE_HEIGHT * GRID_CONFIG.TABLET_SCALE);
      } else { // Desktop: 4 columns
        setWideHeight(GRID_CONFIG.BASE_HEIGHT * GRID_CONFIG.DESKTOP_SCALE);
      }
    };

    updateWideHeight();
    window.addEventListener('resize', updateWideHeight);
    return () => window.removeEventListener('resize', updateWideHeight);
  }, []);

  // Transform artwork data for display
  const displayArtworks = Array.from({ length: 30 }, (_, index) => {
    // In 2*3*n+1 pattern, every 7th item (index 6, 13, 20, etc.) is wide
    const isWide = (index + 1) % GRID_CONFIG.GROUP_SIZE === 0;
    return {
      ...artworks[index % artworks.length],
      id: index + 1,
      aspectRatio: isWide ? 2.4 : ARTWORK_ASPECT_RATIOS[index % ARTWORK_ASPECT_RATIOS.length],
      isWide
    };
  });

  // Combine artworks with advertisements
  const contentWithAds = displayArtworks.reduce((acc: React.ReactNode[], artwork, index) => {
    // Add artwork
    acc.push(
      <ArtworkItem 
        key={artwork.id}
        artwork={artwork}
        isWide={artwork.isWide}
        wideHeight={wideHeight}
        index={index}
      />
    );

    // Add advertisement after every 6 artworks
    if ((index + 1) % GRID_CONFIG.GROUP_SIZE === 6) {
      acc.push(
        <div key={`ad-${index}`} className="break-inside-avoid mb-4">
          <AdCard />
        </div>
      );
    }

    return acc;
  }, []);

  return (
    <div 
      className={cn(
        "columns-2 md:columns-3 lg:columns-4 gap-4 px-[8px] pb-20",
        className
      )}
    >
      {contentWithAds}
    </div>
  );
}